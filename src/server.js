require('dotenv').config();

const crypto = require('crypto');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const {
  listProducts,
  createInvoice,
  getInvoice,
  setInvoicePaid,
  saveGcashSession,
  getGcashSessionByReference,
  getGcashSessionByInvoiceId,
  getSalesReport,
  getTopSalesPerProduct,
  createInventoryIngredient,
  getInventoryReport,
  listAllInvoices
} = require('./data/store');
const {
  getSupabase,
  isSupabaseEnabled,
  getSupabaseMode,
  supabaseUrl
} = require('./data/supabaseClient');
const MockProvider = require('./providers/mockProvider');
const PaymongoProvider = require('./providers/paymongoProvider');

const app = express();
const PORT = Number(process.env.PORT || 4000);
const baseUrl = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const providerName = (process.env.PAYMENT_PROVIDER || 'paymongo').toLowerCase();
const supabaseService = getSupabase();
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
const supabaseAuthClient = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

app.use(cors());
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); } }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/assets/confetti', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Confetti.json'));
});
app.get('/assets/yummy', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Yummy emoji.json'));
});

const provider = providerName === 'paymongo'
  ? new PaymongoProvider({ baseUrl })
  : new MockProvider({ baseUrl });

const AUTH_ROLES = ['administrations', 'supervisor', 'encharge'];
const AUDIT_EVENTS = new Set([
  'signup_success',
  'signup_failed',
  'login_success',
  'login_failed',
  'logout',
  'admin_access_allowed',
  'admin_access_denied'
]);
const APP_USER_CACHE_TTL_MS = 30 * 1000;
const appUserByIdCache = new Map();

function normalizeRole(role) {
  const normalized = String(role || '').trim().toLowerCase();
  return AUTH_ROLES.includes(normalized) ? normalized : 'encharge';
}

function getCachedAppUserById(userId) {
  if (!userId) return null;
  const cached = appUserByIdCache.get(userId);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    appUserByIdCache.delete(userId);
    return null;
  }
  return cached.user;
}

function cacheAppUser(user) {
  if (!user?.id) return;
  appUserByIdCache.set(user.id, {
    user,
    expiresAt: Date.now() + APP_USER_CACHE_TTL_MS
  });
}

function runInBackground(promiseLike, label = 'background-task') {
  Promise.resolve(promiseLike).catch((error) => {
    console.warn(`[${label}]`, error.message);
  });
}

function requireAdminRole(req, res, next) {
  const role = normalizeRole(req.get('x-user-role') || req.body?.role || req.query?.role);
  if (role !== 'administrations') {
    return res.status(403).json({ error: 'Only Administrations role can manage Inventory.' });
  }
  return next();
}

function getRequestIp(req) {
  const forwarded = req.get('x-forwarded-for');
  if (forwarded) {
    return String(forwarded).split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
}

async function logAuthAudit({
  userId = null,
  userEmail = null,
  eventType,
  req = null,
  metadata = {}
}) {
  if (!supabaseService || !AUDIT_EVENTS.has(eventType)) return;
  try {
    const payload = {
      user_id: userId || null,
      user_email: userEmail || null,
      event_type: eventType,
      event_source: 'web',
      metadata: metadata || {}
    };
    if (req) {
      payload.ip_address = getRequestIp(req);
      payload.user_agent = req.get('user-agent') || null;
    }
    await supabaseService.from('auth_audit_logs').insert(payload);
  } catch (error) {
    console.warn('[AuthAudit] Failed to insert audit log:', error.message);
  }
}

async function getAppUserByEmail(email) {
  if (!supabaseService) return null;
  const { data, error } = await supabaseService
    .from('app_users')
    .select('id, full_name, email, role, is_active, created_at, last_login_at')
    .eq('email', email)
    .maybeSingle();
  if (error) throw error;
  if (data) cacheAppUser(data);
  return data;
}

async function getAppUserById(userId) {
  if (!supabaseService) return null;
  const cached = getCachedAppUserById(userId);
  if (cached) return cached;
  const { data, error } = await supabaseService
    .from('app_users')
    .select('id, full_name, email, role, is_active, created_at, last_login_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  if (data) cacheAppUser(data);
  return data;
}

function isEWalletMethod(method) {
  const m = String(method || '').toLowerCase();
  return m === 'gcash' || m === 'paymaya';
}

function buildSalesRange(query) {
  const now = new Date();
  const range = (query.range || 'daily').toLowerCase();

  if (query.dateFrom && query.dateTo) {
    return {
      label: 'custom',
      dateFrom: query.dateFrom,
      dateTo: query.dateTo
    };
  }

  let start;
  if (range === 'weekly') {
    start = new Date(now);
    start.setUTCDate(now.getUTCDate() - 6);
    start.setUTCHours(0, 0, 0, 0);
  } else {
    start = new Date(now);
    start.setUTCHours(0, 0, 0, 0);
  }

  const end = new Date(now);
  end.setUTCHours(23, 59, 59, 999);

  return {
    label: range === 'weekly' ? 'weekly' : 'daily',
    dateFrom: start.toISOString(),
    dateTo: end.toISOString()
  };
}

function parsePaymongoSignature(headerValue) {
  const parts = String(headerValue || '').split(',').map((x) => x.trim()).filter(Boolean);
  const parsed = {};

  parts.forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx);
    const value = part.slice(idx + 1);
    parsed[key] = value;
  });

  return parsed;
}

function timingSafeEqualHex(a, b) {
  if (!a || !b) return false;
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyPaymongoWebhook(req) {
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET || '';
  if (!webhookSecret) {
    // If no webhook secret configured, log warning but allow processing
    // This helps during initial setup
    console.warn('[Webhook] PAYMONGO_WEBHOOK_SECRET is not configured - skipping signature verification');
    return { ok: true };
  }

  const headerValue = req.get('paymongo-signature') || req.get('Paymongo-Signature');
  const signature = parsePaymongoSignature(headerValue);
  if (!signature.t || (!signature.te && !signature.li)) {
    return { ok: false, error: 'Missing or invalid PayMongo signature header' };
  }

  // Use rawBody if available, otherwise fall back to JSON.stringify(req.body)
  // Vercel serverless may not preserve rawBody from Express verify callback
  const bodyString = req.rawBody || JSON.stringify(req.body);
  const signedPayload = `${signature.t}.${bodyString}`;
  const computed = crypto.createHmac('sha256', webhookSecret).update(signedPayload).digest('hex');

  const isLive = Boolean(req.body?.data?.attributes?.livemode);
  const expected = isLive ? signature.li : signature.te;

  if (!timingSafeEqualHex(computed, expected)) {
    return { ok: false, error: 'Invalid PayMongo webhook signature' };
  }

  return { ok: true };
}

function extractPaymongoWebhookPayload(body) {
  const eventType = body?.data?.attributes?.type;
  const eventData = body?.data?.attributes?.data;
  const metadata = eventData?.attributes?.metadata || {};

  if (eventType === 'checkout_session.payment.paid') {
    return {
      provider: 'paymongo',
      reference: metadata.local_reference || metadata.reference || null,
      method: metadata.payment_method || null,
      providerReference: eventData?.id || null,
      status: 'PAID',
      amountPaid: null
    };
  }

  if (eventType === 'payment.paid') {
    return {
      provider: 'paymongo',
      reference: metadata.local_reference || metadata.reference || null,
      method: metadata.payment_method || null,
      providerReference: eventData?.id || null,
      status: 'PAID',
      amountPaid: Number(eventData?.attributes?.amount || 0) / 100
    };
  }

  return null;
}

async function processPaymentWebhook(payload) {
  const {
    reference,
    status,
    method,
    provider: webhookProvider,
    providerReference,
    amountPaid
  } = payload;

  if (!reference) {
    return { statusCode: 400, body: { error: 'Missing payment reference in webhook payload' } };
  }

  const session = await getGcashSessionByReference(reference);

  if (!session) {
    return { statusCode: 404, body: { error: 'Session not found for reference' } };
  }

  if ((status || '').toUpperCase() !== 'PAID') {
    return { statusCode: 200, body: { ok: true, ignored: true } };
  }

  const invoice = await setInvoicePaid(session.invoiceId, {
    method: method || session.method || 'gcash',
    provider: webhookProvider || session.provider,
    providerReference: providerReference || reference,
    recipientGcashNumber: (method || session.method || 'gcash') === 'gcash' ? (session?.merchant?.gcashNumber || '') : '',
    paidAt: new Date().toISOString(),
    amountPaid: Number(amountPaid || session.amount),
    change: 0,
    success: true,
    successMessage: 'Payment Successful'
  });

  session.status = 'PAID';
  await saveGcashSession(session);

  return { statusCode: 200, body: { ok: true, invoice } };
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    if (!supabaseService) {
      return res.status(503).json({ error: 'Supabase is not configured on server.' });
    }

    const fullName = String(req.body?.fullName || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const role = normalizeRole(req.body?.role);

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existingUser = await getAppUserByEmail(email);
    if (existingUser) {
      await logAuthAudit({
        userId: existingUser.id,
        userEmail: email,
        eventType: 'signup_failed',
        req,
        metadata: { reason: 'Email already exists' }
      });
      return res.status(409).json({ error: 'Email is already registered. Please login instead.' });
    }

    const { data, error } = await supabaseService.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role
      }
    });

    if (error) {
      const msg = String(error.message || '');
      const isExisting = /already|exists|registered/i.test(msg);
      await logAuthAudit({
        userEmail: email,
        eventType: 'signup_failed',
        req,
        metadata: { reason: msg }
      });
      return res.status(isExisting ? 409 : 400).json({
        error: isExisting ? 'Email is already registered. Please login instead.' : msg
      });
    }

    const createdUser = data?.user;
    if (!createdUser) {
      return res.status(500).json({ error: 'User was not created.' });
    }

    let appUser = await getAppUserById(createdUser.id);
    if (!appUser) {
      const { data: fallbackProfile, error: profileError } = await supabaseService
        .from('app_users')
        .upsert({
          id: createdUser.id,
          full_name: fullName,
          email,
          role,
          is_active: true
        }, { onConflict: 'id' })
        .select('id, full_name, email, role, is_active, created_at, last_login_at')
        .single();
      if (profileError) throw profileError;
      appUser = fallbackProfile;
    }

    await logAuthAudit({
      userId: appUser.id,
      userEmail: appUser.email,
      eventType: 'signup_success',
      req,
      metadata: { role: appUser.role }
    });

    return res.status(201).json({
      user: {
        id: appUser.id,
        fullName: appUser.full_name,
        email: appUser.email,
        role: appUser.role
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (!supabaseService || !supabaseAuthClient) {
      return res.status(503).json({ error: 'Supabase auth is not configured on server.' });
    }

    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }

    const { data, error } = await supabaseAuthClient.auth.signInWithPassword({ email, password });
    if (error || !data?.user || !data?.session) {
      runInBackground(logAuthAudit({
        userEmail: email,
        eventType: 'login_failed',
        req,
        metadata: { reason: error?.message || 'Invalid credentials' }
      }), 'auth-audit');
      return res.status(401).json({ error: error?.message || 'Invalid credentials.' });
    }

    let appUser = await getAppUserById(data.user.id);
    if (!appUser) {
      const fallbackRole = normalizeRole(data.user.user_metadata?.role);
      const fallbackName = String(data.user.user_metadata?.full_name || email.split('@')[0] || 'User');
      const { data: fallbackProfile, error: profileError } = await supabaseService
        .from('app_users')
        .upsert({
          id: data.user.id,
          full_name: fallbackName,
          email,
          role: fallbackRole,
          is_active: true
        }, { onConflict: 'id' })
        .select('id, full_name, email, role, is_active, created_at, last_login_at')
        .single();
      if (profileError) throw profileError;
      appUser = fallbackProfile;
      cacheAppUser(appUser);
    }

    if (!appUser.is_active) {
      runInBackground(logAuthAudit({
        userId: appUser.id,
        userEmail: appUser.email,
        eventType: 'login_failed',
        req,
        metadata: { reason: 'User is inactive' }
      }), 'auth-audit');
      return res.status(403).json({ error: 'Account is inactive. Contact administrator.' });
    }

    runInBackground(supabaseService
      .from('app_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', appUser.id), 'last-login-update');

    runInBackground(logAuthAudit({
      userId: appUser.id,
      userEmail: appUser.email,
      eventType: 'login_success',
      req,
      metadata: { role: appUser.role }
    }), 'auth-audit');

    return res.json({
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at
      },
      user: {
        id: appUser.id,
        fullName: appUser.full_name,
        email: appUser.email,
        role: appUser.role
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/session', async (req, res) => {
  try {
    if (!supabaseService) {
      return res.status(503).json({ error: 'Supabase is not configured on server.' });
    }

    const authHeader = req.get('authorization') || '';
    const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7).trim()
      : '';
    const accessToken = String(req.body?.accessToken || bearerToken || '');

    if (!accessToken) {
      return res.status(401).json({ error: 'Missing access token.' });
    }

    const { data, error } = await supabaseService.auth.getUser(accessToken);
    if (error || !data?.user) {
      return res.status(401).json({ error: error?.message || 'Invalid session.' });
    }

    const appUser = await getAppUserById(data.user.id);
    if (!appUser || !appUser.is_active) {
      return res.status(403).json({ error: 'Account is inactive or missing profile.' });
    }

    return res.json({
      user: {
        id: appUser.id,
        fullName: appUser.full_name,
        email: appUser.email,
        role: appUser.role
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const userId = req.body?.userId || null;
    const userEmail = req.body?.email || null;
    await logAuthAudit({
      userId,
      userEmail,
      eventType: 'logout',
      req
    });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/audit', async (req, res) => {
  try {
    const eventType = String(req.body?.eventType || '').trim();
    if (!AUDIT_EVENTS.has(eventType)) {
      return res.status(400).json({ error: 'Invalid event type.' });
    }
    if (!eventType.startsWith('admin_access_')) {
      return res.status(400).json({ error: 'This endpoint is limited to admin access events.' });
    }

    await logAuthAudit({
      userId: req.body?.userId || null,
      userEmail: req.body?.email || null,
      eventType,
      req,
      metadata: req.body?.metadata || {}
    });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    provider: providerName,
    supabaseEnabled: isSupabaseEnabled(),
    supabaseMode: getSupabaseMode(),
    now: new Date().toISOString()
  });
});

app.get('/api/config', (_req, res) => {
  res.json({});
});

app.get('/api/products', (_req, res) => {
  res.json({ products: listProducts() });
});

app.post('/api/invoices', async (req, res) => {
  try {
    const { items, paymentMethod, discountAmount, orderType } = req.body;
    if (!['cash', 'gcash', 'paymaya'].includes((paymentMethod || '').toLowerCase())) {
      return res.status(400).json({ error: 'paymentMethod must be cash, gcash, or paymaya' });
    }
    const normalizedOrderType = String(orderType || '').toLowerCase();
    if (!['dine-in', 'take-out'].includes(normalizedOrderType)) {
      return res.status(400).json({ error: 'orderType must be dine-in or take-out' });
    }
    const invoice = await createInvoice({
      items: items || [],
      paymentMethod: paymentMethod.toLowerCase(),
      discountAmount: Number(discountAmount || 0),
      orderType: normalizedOrderType
    });
    return res.status(201).json({ invoice });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/invoices/:invoiceId', async (req, res) => {
  try {
    const invoice = await getInvoice(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    return res.json({ invoice });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/reports/sales', async (req, res) => {
  try {
    const range = buildSalesRange(req.query);
    const report = await getSalesReport({
      dateFrom: range.dateFrom,
      dateTo: range.dateTo
    });

    return res.json({
      reportType: 'sales',
      range: { label: range.label, ...report.range },
      totalSales: report.totalSales,
      totalTransactions: report.totalTransactions,
      averageTicket: report.averageTicket,
      byMethod: report.byMethod,
      transactions: report.transactions
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/reports/sales/detailed', async (_req, res) => {
  try {
    const now = new Date();

    const dailyStart = new Date(now);
    dailyStart.setUTCHours(0, 0, 0, 0);
    const dailyEnd = new Date(now);
    dailyEnd.setUTCHours(23, 59, 59, 999);

    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    const [daily, monthly, topProducts] = await Promise.all([
      getSalesReport({ dateFrom: dailyStart.toISOString(), dateTo: dailyEnd.toISOString() }),
      getSalesReport({ dateFrom: monthStart.toISOString(), dateTo: monthEnd.toISOString() }),
      getTopSalesPerProduct(10)
    ]);

    return res.json({
      reportType: 'sales_detailed',
      generatedAt: new Date().toISOString(),
      dailySales: {
        totalSales: daily.totalSales,
        totalTransactions: daily.totalTransactions,
        averageTicket: daily.averageTicket
      },
      monthlySales: {
        totalSales: monthly.totalSales,
        totalTransactions: monthly.totalTransactions,
        averageTicket: monthly.averageTicket
      },
      topSalesPerProduct: topProducts
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/inventory/report', async (_req, res) => {
  try {
    const report = await getInventoryReport();
    return res.json(report);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/inventory/ingredients', requireAdminRole, async (req, res) => {
  try {
    const ingredient = await createInventoryIngredient({
      name: req.body?.name,
      qtyOnHand: req.body?.qtyOnHand,
      unitPrice: req.body?.unitPrice,
      reorderLevel: req.body?.reorderLevel,
      unit: req.body?.unit
    });
    return res.status(201).json({ ingredient });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/payments/cash', async (req, res) => {
  try {
    const { invoiceId, amountTendered } = req.body;
    const invoice = await getInvoice(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.paymentMethod !== 'cash') {
      return res.status(400).json({ error: 'Invoice payment method is not cash' });
    }

    const tendered = Number(amountTendered || 0);
    if (tendered < invoice.total) {
      return res.status(400).json({ error: 'Insufficient amount tendered' });
    }

    const paidInvoice = await setInvoicePaid(invoice.id, {
      method: 'cash',
      paidAt: new Date().toISOString(),
      amountPaid: tendered,
      change: tendered - invoice.total,
      success: true,
      successMessage: 'Payment Successful'
    });

    return res.json({ invoice: paidInvoice });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

async function createEwalletCheckoutHandler(req, res) {
  try {
    const { invoiceId, customerInfo } = req.body;
    const invoice = await getInvoice(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (!isEWalletMethod(invoice.paymentMethod)) {
      return res.status(400).json({ error: 'Invoice payment method is not an e-wallet (gcash/paymaya)' });
    }

    if (invoice.status === 'PAID') {
      return res.status(400).json({ error: 'Invoice already paid' });
    }

    // Pass customer info to provider for pre-filling PayMongo checkout
    const session = await provider.createEwalletCheckout({
      invoice,
      paymentMethod: invoice.paymentMethod,
      customerInfo: customerInfo || {}
    });
    await saveGcashSession({ ...session, invoiceId: invoice.id, status: 'PENDING' });

    return res.status(201).json({ checkout: session });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

app.post('/api/payments/ewallet/checkout', createEwalletCheckoutHandler);
app.post('/api/payments/gcash/checkout', createEwalletCheckoutHandler);

app.get('/api/payments/gcash/session/:reference', async (req, res) => {
  try {
    const session = await getGcashSessionByReference(req.params.reference);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    return res.json({ session });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/webhooks/payments', async (req, res) => {
  // PayMongo REQUIRES webhook to ALWAYS return 200
  // Even if payment failed or there's an error
  // Otherwise PayMongo will retry up to 12 times
  try {
    if (providerName === 'paymongo') {
      const verified = verifyPaymongoWebhook(req);
      if (!verified.ok) {
        console.error('[Webhook] Signature verification failed:', verified.error);
        // Still return 200 to acknowledge receipt
        return res.status(200).json({ received: true, error: verified.error });
      }

      const extracted = extractPaymongoWebhookPayload(req.body);
      if (!extracted) {
        console.log('[Webhook] Event ignored (not a payment event)');
        return res.status(200).json({ received: true, ignored: true });
      }

      const result = await processPaymentWebhook(extracted);
      // Always return 200, but include the actual result
      console.log('[Webhook] Processed:', result.body);
      return res.status(200).json({ received: true, ...result.body });
    }

    const result = await processPaymentWebhook(req.body);
    return res.status(200).json({ received: true, ...result.body });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error.message);
    // ALWAYS return 200 even on error
    return res.status(200).json({ received: true, error: error.message });
  }
});

app.post('/api/mock/gcash/pay', async (req, res) => {
  try {
    const { reference } = req.body;
    const result = await processPaymentWebhook({ provider: 'mock', reference, status: 'PAID' });
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// ── Admin: list all transactions (pending + paid) ──
app.get('/api/admin/transactions', async (req, res) => {
  try {
    const { status: filterStatus, range } = req.query;
    let dateFrom, dateTo;

    if (range) {
      const rangeData = buildSalesRange({ range });
      dateFrom = rangeData.dateFrom;
      dateTo = rangeData.dateTo;
    }

    const transactions = await listAllInvoices({
      dateFrom,
      dateTo,
      status: filterStatus || undefined
    });

    return res.json({ transactions });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// ── Verify GCash payment status directly with PayMongo ──
async function verifyEwalletPaymentHandler(req, res) {
  try {
    const { invoiceId } = req.params;
    const invoice = await getInvoice(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.status === 'PAID') {
      return res.json({ invoice, alreadyPaid: true, message: 'Invoice is already paid' });
    }

    if (!isEWalletMethod(invoice.paymentMethod)) {
      return res.status(400).json({ error: 'Invoice payment method is not an e-wallet (gcash/paymaya)' });
    }

    // Find the GCash session for this invoice
    const session = await getGcashSessionByInvoiceId(invoiceId);

    if (!session) {
      return res.status(404).json({ error: 'No GCash checkout session found for this invoice' });
    }

    // Only PayMongo provider supports direct status check
    if (providerName !== 'paymongo' || !provider.getCheckoutSessionStatus) {
      return res.status(400).json({ error: 'Direct payment verification not supported for this provider' });
    }

    const checkoutSessionId = session.paymongoCheckoutSessionId || session.reference;

    // Try to find the PayMongo checkout session ID
    // It might be stored in the session or we need to look it up
    let paymongoSessionId = null;

    if (session.paymongoCheckoutSessionId) {
      paymongoSessionId = session.paymongoCheckoutSessionId;
    } else {
      // Try to find it from Supabase gcash_sessions table
      // The checkout_url contains the session ID
      if (session.checkoutUrl) {
        const urlParts = session.checkoutUrl.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart) {
          paymongoSessionId = `cs_${lastPart}`;
        }
      }
    }

    if (!paymongoSessionId) {
      return res.status(400).json({ error: 'Cannot determine PayMongo checkout session ID' });
    }

    // Check status directly with PayMongo
    const statusResult = await provider.getCheckoutSessionStatus(paymongoSessionId);

    if (statusResult.paid) {
      // Payment confirmed! Update invoice to PAID
      const paymentDetails = statusResult.paymentDetails || {};
      const customerInfo = statusResult.customerInfo || {};
      const paidInvoice = await setInvoicePaid(invoiceId, {
        method: invoice.paymentMethod,
        provider: 'paymongo',
        providerReference: paymentDetails.paymentId || paymongoSessionId,
        recipientGcashNumber: invoice.paymentMethod === 'gcash' ? (customerInfo.phone || '') : '',
        paidAt: paymentDetails.paidAt || new Date().toISOString(),
        amountPaid: paymentDetails.amount || invoice.total,
        change: 0,
        success: true,
        successMessage: 'Payment verified directly with PayMongo',
        customerName: customerInfo.name || null,
        customerEmail: customerInfo.email || null,
        customerPhone: customerInfo.phone || null
      });

      // Update session status
      session.status = 'PAID';
      await saveGcashSession(session);

      return res.json({
        invoice: paidInvoice,
        verified: true,
        message: 'Payment confirmed via PayMongo API'
      });
    }

    return res.json({
      invoice,
      verified: false,
      sessionStatus: statusResult.sessionStatus,
      message: 'Payment not yet completed on PayMongo'
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

app.post('/api/payments/ewallet/verify/:invoiceId', verifyEwalletPaymentHandler);
app.post('/api/payments/gcash/verify/:invoiceId', verifyEwalletPaymentHandler);

app.post('/api/payments/ewallet/manual-complete/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    if (invoice.status === 'PAID') {
      return res.json({ invoice, alreadyPaid: true });
    }
    if (!isEWalletMethod(invoice.paymentMethod)) {
      return res.status(400).json({ error: 'Invoice payment method is not an e-wallet (gcash/paymaya)' });
    }

    const session = await getGcashSessionByInvoiceId(invoiceId);
    const paidInvoice = await setInvoicePaid(invoiceId, {
      method: invoice.paymentMethod,
      provider: session?.provider || providerName || 'manual',
      providerReference: session?.reference || `MANUAL-${Date.now()}`,
      recipientGcashNumber: invoice.paymentMethod === 'gcash' ? (session?.merchant?.gcashNumber || '') : '',
      paidAt: new Date().toISOString(),
      amountPaid: invoice.total,
      change: 0,
      success: true,
      successMessage: 'Payment manually confirmed by encharge'
    });

    if (session) {
      session.status = 'PAID';
      await saveGcashSession(session);
    }

    return res.json({ invoice: paidInvoice, manual: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/checkout/:reference', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'checkout.html'));
});

app.listen(PORT, () => {
  console.log(`POS server running on ${baseUrl}`);
  console.log(`Provider: ${providerName}`);
  console.log(`Supabase: ${isSupabaseEnabled() ? `enabled (${getSupabaseMode()})` : 'disabled'}`);
});
