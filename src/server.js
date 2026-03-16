﻿require('dotenv').config();

const crypto = require('crypto');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const {
  getAppConfig,
  updateAppConfig,
  listDiscountManagerProfiles,
  createDiscountProfile,
  updateDiscountProfile,
  deleteDiscountProfile,
  listReceiptTemplates,
  getActiveReceiptTemplate,
  createReceiptTemplate,
  updateReceiptTemplate,
  activateReceiptTemplate,
  deleteReceiptTemplate,
  listMenuCategories,
  listProducts,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  createMenuProduct,
  updateMenuProduct,
  deleteMenuProduct,
  createInvoice,
  getInvoice,
  setInvoicePaid,
  updateInvoiceLifecycleStatus,
  saveGcashSession,
  getGcashSessionByReference,
  getGcashSessionByInvoiceId,
  getSalesReport,
  getTopSalesPerProduct,
  getTopSalesPerProductByRange,
  createInventoryIngredient,
  updateInventoryIngredient,
  deleteInventoryIngredient,
  listExpenses,
  createExpense,
  listInventoryIngredients,
  getInventoryReport,
  getInventoryIngredientHistory,
  getMonthlyClosingReport,
  listProductRecipes,
  replaceProductRecipes,
  listAllInvoices,
  getEarliestInvoiceDate,
  startCashierShift,
  getCashierShiftById,
  getCashierShiftSummary,
  closeCashierShift,
  listCashierShifts,
  listActiveCashierMonitoring,
  reviewCashierShift,
  syncOfflineQueue,
  getOfflineQueueCount,
  getOfflineQueueSummary,
  getCashierShiftOpeningContext,
  getCashDrawerById,
  getCashDrawerUsageStats,
  listCashDrawers,
  createCashDrawer,
  updateCashDrawer,
  deleteCashDrawer,
  listCashDrawerMovements,
  createCashDrawerMovement
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
let supabaseAuthClient = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch (error) {
    console.warn('[SupabaseAuth] Client initialization failed:', error.message);
    supabaseAuthClient = null;
  }
}

function buildProductAvailability(products = [], ingredients = [], recipes = [], { enforceKitSpec = true } = {}) {
  const ingredientById = new Map(
    (ingredients || []).map((ingredient) => [String(ingredient.id || '').trim(), ingredient])
  );
  const recipesByProductId = new Map();
  (recipes || []).forEach((recipe) => {
    const productId = String(recipe.productId || '').trim();
    if (!productId) return;
    if (!recipesByProductId.has(productId)) recipesByProductId.set(productId, []);
    recipesByProductId.get(productId).push(recipe);
  });

  return (products || []).map((product) => {
    const productId = String(product.id || '').trim();
    const productRecipes = recipesByProductId.get(productId) || [];
    if (!enforceKitSpec) {
      return {
        ...product,
        hasKitSpec: productRecipes.length > 0,
        isAvailable: true,
        availabilityStatus: 'available',
        availabilityLabel: 'Available',
        availabilityReason: '',
        availableUnits: 0
      };
    }

    if (!productRecipes.length) {
      return {
        ...product,
        hasKitSpec: false,
        isAvailable: false,
        availabilityStatus: 'no-kit-spec',
        availabilityLabel: 'Needs Kit Spec',
        availabilityReason: 'Assign a kit specification before this product can be sold.',
        availableUnits: 0
      };
    }

    let maxUnits = Number.POSITIVE_INFINITY;
    let stockIssue = '';
    let kitIssue = '';

    productRecipes.forEach((recipe) => {
      const ingredientId = String(recipe.ingredientId || '').trim();
      const ingredient = ingredientById.get(ingredientId);
      const ingredientName = String(recipe.ingredientName || ingredient?.name || 'Ingredient').trim() || 'Ingredient';
      const qtyPerProduct = Number(recipe.qtyPerProduct || 0);

      if (!ingredient || !Number.isFinite(qtyPerProduct) || qtyPerProduct <= 0) {
        kitIssue = ingredient
          ? `Review kit specification for ${ingredientName}.`
          : `${ingredientName} is missing from Ingredients.`;
        maxUnits = 0;
        return;
      }

      const qtyOnHand = Number(ingredient.qtyOnHand || 0);
      const supportedUnits = Math.floor((qtyOnHand / qtyPerProduct) + 1e-9);
      if (supportedUnits < maxUnits) maxUnits = supportedUnits;
      if (supportedUnits <= 0 && !stockIssue) {
        stockIssue = `${ingredientName} has no stock available.`;
      }
    });

    if (kitIssue) {
      return {
        ...product,
        hasKitSpec: true,
        isAvailable: false,
        availabilityStatus: 'kit-spec-issue',
        availabilityLabel: 'Review Kit Spec',
        availabilityReason: kitIssue,
        availableUnits: 0
      };
    }

    if (!Number.isFinite(maxUnits) || maxUnits <= 0) {
      return {
        ...product,
        hasKitSpec: true,
        isAvailable: false,
        availabilityStatus: 'out-of-stock',
        availabilityLabel: 'Out of Stock',
        availabilityReason: stockIssue || 'One or more ingredients are out of stock.',
        availableUnits: 0
      };
    }

    return {
      ...product,
      hasKitSpec: true,
      isAvailable: true,
      availabilityStatus: 'available',
      availabilityLabel: 'Available',
      availabilityReason: `Kit spec ready. Estimated ${maxUnits} serving(s) can still be prepared.`,
      availableUnits: maxUnits
    };
  });
}

app.use(cors());
app.use(express.json({
  limit: '15mb',
  verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); }
}));
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
const ROLE_ACCESS_KEYS = Object.freeze([
  'control_center_access',
  'menu_editor_access',
  'cash_drawer_access',
  'inventory_access',
  'inventory_manage',
  'kit_spec_access',
  'kit_spec_mode_manage',
  'user_directory_access',
  'user_management_manage',
  'operations_access',
  'receipt_templates_access',
  'receipt_templates_manage',
  'reports_access',
  'discounts_access',
  'discounts_manage',
  'monthly_closing_access',
  'monthly_expenses_manage',
  'shift_session_access',
  'shift_monitor_access',
  'invoice_action_access'
]);
const DEFAULT_ROLE_ACCESS = Object.freeze({
  encharge: Object.freeze([
    'shift_session_access',
    'shift_monitor_access',
    'invoice_action_access'
  ]),
  supervisor: Object.freeze([
    'control_center_access',
    'menu_editor_access',
    'cash_drawer_access',
    'inventory_access',
    'kit_spec_access',
    'user_directory_access',
    'operations_access',
    'receipt_templates_access',
    'reports_access',
    'discounts_access',
    'monthly_closing_access',
    'shift_session_access',
    'invoice_action_access'
  ])
});
const AUDIT_EVENTS = new Set([
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

function normalizeRoleAccessEntries(entries = [], fallback = []) {
  const source = Array.isArray(entries) ? entries : fallback;
  const seen = new Set();
  return source.reduce((rows, entry) => {
    const key = String(entry || '').trim().toLowerCase();
    if (!ROLE_ACCESS_KEYS.includes(key) || seen.has(key)) return rows;
    seen.add(key);
    rows.push(key);
    return rows;
  }, []);
}

function normalizeRoleAccessConfig(roleAccess = {}) {
  const source = roleAccess && typeof roleAccess === 'object' ? roleAccess : {};
  const encharge = normalizeRoleAccessEntries(source?.encharge, DEFAULT_ROLE_ACCESS.encharge);
  const supervisor = normalizeRoleAccessEntries(source?.supervisor, DEFAULT_ROLE_ACCESS.supervisor);
  return {
    encharge: encharge.length ? encharge : [...DEFAULT_ROLE_ACCESS.encharge],
    supervisor: supervisor.length ? supervisor : [...DEFAULT_ROLE_ACCESS.supervisor]
  };
}

function roleHasAccess(role, permissionKey, appConfig = getAppConfig()) {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'administrations') return true;
  const safePermissionKey = String(permissionKey || '').trim().toLowerCase();
  if (!ROLE_ACCESS_KEYS.includes(safePermissionKey)) return false;
  const roleAccess = normalizeRoleAccessConfig(appConfig?.roleAccess);
  return Array.isArray(roleAccess?.[normalizedRole]) && roleAccess[normalizedRole].includes(safePermissionKey);
}

function requireRoleAccess(permissionKey, errorMessage = 'Current role does not have access to this endpoint.') {
  return (req, res, next) => {
    const role = normalizeRole(req.get('x-user-role') || req.body?.role || req.query?.role);
    if (!roleHasAccess(role, permissionKey)) {
      return res.status(403).json({ error: errorMessage });
    }
    return next();
  };
}

function requireAnyRoleAccess(permissionKeys = [], errorMessage = 'Current role does not have access to this endpoint.') {
  const keys = Array.isArray(permissionKeys) ? permissionKeys : [permissionKeys];
  return (req, res, next) => {
    const role = normalizeRole(req.get('x-user-role') || req.body?.role || req.query?.role);
    if (!keys.some((permissionKey) => roleHasAccess(role, permissionKey))) {
      return res.status(403).json({ error: errorMessage });
    }
    return next();
  };
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

function requireMenuManagerRole(req, res, next) {
  const role = normalizeRole(req.get('x-user-role') || req.body?.role || req.query?.role);
  if (role !== 'administrations' && role !== 'supervisor') {
    return res.status(403).json({ error: 'Only Administrations and Supervisor roles can manage menu items.' });
  }
  return next();
}

function requireAdminOrSupervisorRole(req, res, next) {
  const role = normalizeRole(req.get('x-user-role') || req.body?.role || req.query?.role);
  if (role !== 'administrations' && role !== 'supervisor') {
    return res.status(403).json({ error: 'Only Administrations and Supervisor roles can access this endpoint.' });
  }
  return next();
}

function canManageInvoiceLifecycle({
  invoice,
  nextStatus,
  role,
  actorUserId,
  actorEmail
}) {
  if (!invoice) return false;
  const normalizedNextStatus = String(nextStatus || '').trim().toUpperCase();
  const normalizedCurrentStatus = String(invoice.status || '').trim().toUpperCase();
  const hasDashboardReviewAccess = roleHasAccess(role, 'control_center_access') && roleHasAccess(role, 'invoice_action_access');

  if (hasDashboardReviewAccess) {
    if (normalizedNextStatus === 'CANCELLED') return normalizedCurrentStatus === 'PENDING';
    if (normalizedNextStatus === 'HOLD_FOR_VOID') return normalizedCurrentStatus === 'PAID';
    if (normalizedNextStatus === 'VOIDED') {
      return normalizedCurrentStatus === 'PAID' || normalizedCurrentStatus === 'HOLD_FOR_VOID';
    }
    return false;
  }

  if (!roleHasAccess(role, 'invoice_action_access')) return false;
  if (normalizedNextStatus === 'CANCELLED' && normalizedCurrentStatus !== 'PENDING') return false;
  if (normalizedNextStatus === 'HOLD_FOR_VOID' && normalizedCurrentStatus !== 'PAID') return false;
  if (normalizedNextStatus !== 'CANCELLED' && normalizedNextStatus !== 'HOLD_FOR_VOID') return false;

  const invoiceUserId = String(invoice.cashierUserId || '').trim();
  const invoiceEmail = String(invoice.cashierEmail || '').trim().toLowerCase();
  const safeActorUserId = String(actorUserId || '').trim();
  const safeActorEmail = String(actorEmail || '').trim().toLowerCase();

  return Boolean(
    (invoiceUserId && safeActorUserId && invoiceUserId === safeActorUserId)
    || (invoiceEmail && safeActorEmail && invoiceEmail === safeActorEmail)
  );
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
  } else if (range === 'monthly') {
    start = new Date(now);
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
  } else {
    start = new Date(now);
    start.setUTCHours(0, 0, 0, 0);
  }

  const end = new Date(now);
  end.setUTCHours(23, 59, 59, 999);

  return {
    label: range === 'weekly' ? 'weekly' : (range === 'monthly' ? 'monthly' : 'daily'),
    dateFrom: start.toISOString(),
    dateTo: end.toISOString()
  };
}

function buildOptionalRange(query, defaultRange = null) {
  if (query?.dateFrom && query?.dateTo) {
    return {
      label: 'custom',
      dateFrom: query.dateFrom,
      dateTo: query.dateTo
    };
  }

  const range = String(query?.range || '').trim().toLowerCase();
  if (range === 'all') {
    return {
      label: 'all',
      dateFrom: null,
      dateTo: null
    };
  }

  if (range === 'daily' || range === 'weekly' || range === 'monthly') {
    return buildSalesRange({ range });
  }

  if (defaultRange === 'daily' || defaultRange === 'weekly' || defaultRange === 'monthly') {
    return buildSalesRange({ range: defaultRange });
  }

  return {
    label: 'all',
    dateFrom: null,
    dateTo: null
  };
}

function toMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

async function enrichShiftWithSummary(shift) {
  const summary = await getCashierShiftSummary(shift);
  return {
    ...shift,
    expectedCash: Number(summary.expectedCashBalance || shift?.expectedCash || 0),
    cashWithdrawals: Number(summary.cashWithdrawals || 0),
    totalSales: Number(summary.totalSales || shift?.totalSales || 0),
    totalTransactions: Number(summary.totalTransactions || shift?.totalTransactions || 0),
    holdForVoidCount: Number(summary.holdForVoidCount || 0),
    holdForVoidAmount: Number(summary.holdForVoidAmount || 0),
    cashTendered: Number(summary.cashTendered || shift?.cashTendered || 0),
    changeGiven: Number(summary.changeGiven || shift?.changeGiven || 0),
    netCashRetained: Number(summary.netCashRetained || shift?.netCashRetained || 0)
  };
}

const HOUR_LABELS = Array.from({ length: 24 }, (_, hour) => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${ampm}`;
});

const WEEKDAY_ROWS = [
  { key: 'monday', label: 'Mon', fullLabel: 'Monday' },
  { key: 'tuesday', label: 'Tue', fullLabel: 'Tuesday' },
  { key: 'wednesday', label: 'Wed', fullLabel: 'Wednesday' },
  { key: 'thursday', label: 'Thu', fullLabel: 'Thursday' },
  { key: 'friday', label: 'Fri', fullLabel: 'Friday' },
  { key: 'saturday', label: 'Sat', fullLabel: 'Saturday' },
  { key: 'sunday', label: 'Sun', fullLabel: 'Sunday' }
];

function getManilaHourIndex(isoDate) {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    hour12: false
  }).formatToParts(d);
  const hourPart = parts.find((x) => x.type === 'hour')?.value;
  const hour = Number(hourPart);
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return null;
  return hour;
}

function getManilaWeekdayKey(isoDate) {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  const weekday = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long'
  }).format(d);
  const key = String(weekday || '').trim().toLowerCase();
  return WEEKDAY_ROWS.some((row) => row.key === key) ? key : null;
}

function buildHourlySalesRows(transactions = []) {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: HOUR_LABELS[hour],
    totalSales: 0,
    transactions: 0,
    cashSales: 0,
    cashTendered: 0,
    changeGiven: 0,
    netCashRetained: 0,
    digitalSales: 0
  }));

  (transactions || []).forEach((txn) => {
    const hour = getManilaHourIndex(txn?.payment?.paidAt || txn?.updatedAt || txn?.createdAt);
    if (hour === null) return;
    const amount = toMoney(txn?.total ?? 0);
    const bucket = buckets[hour];
    const method = String(txn?.paymentMethod || txn?.payment?.method || 'other').toLowerCase();
    bucket.totalSales += amount;
    bucket.transactions += 1;
    if (method === 'cash') {
      const tendered = toMoney(txn?.payment?.amountPaid ?? amount);
      const change = toMoney(txn?.payment?.change ?? 0);
      bucket.cashSales += amount;
      bucket.cashTendered += tendered;
      bucket.changeGiven += Math.max(0, change);
      bucket.netCashRetained += toMoney(tendered - Math.max(0, change));
    } else {
      bucket.digitalSales += amount;
    }
  });

  return buckets.map((x) => ({
    ...x,
    totalSales: toMoney(x.totalSales),
    cashSales: toMoney(x.cashSales),
    cashTendered: toMoney(x.cashTendered),
    changeGiven: toMoney(x.changeGiven),
    netCashRetained: toMoney(x.netCashRetained),
    digitalSales: toMoney(x.digitalSales)
  }));
}

function buildWeekdaySalesRows(transactions = []) {
  const buckets = new Map(
    WEEKDAY_ROWS.map((row) => [
      row.key,
      {
        ...row,
        totalSales: 0,
        transactions: 0,
        cashSales: 0,
        cashTendered: 0,
        changeGiven: 0,
        netCashRetained: 0,
        digitalSales: 0
      }
    ])
  );

  (transactions || []).forEach((txn) => {
    const key = getManilaWeekdayKey(txn?.payment?.paidAt || txn?.updatedAt || txn?.createdAt);
    if (!key || !buckets.has(key)) return;
    const bucket = buckets.get(key);
    const amount = toMoney(txn?.total ?? 0);
    const method = String(txn?.paymentMethod || txn?.payment?.method || 'other').toLowerCase();
    bucket.totalSales += amount;
    bucket.transactions += 1;
    if (method === 'cash') {
      const tendered = toMoney(txn?.payment?.amountPaid ?? amount);
      const change = toMoney(txn?.payment?.change ?? 0);
      bucket.cashSales += amount;
      bucket.cashTendered += tendered;
      bucket.changeGiven += Math.max(0, change);
      bucket.netCashRetained += toMoney(tendered - Math.max(0, change));
    } else {
      bucket.digitalSales += amount;
    }
  });

  return WEEKDAY_ROWS.map((row) => {
    const bucket = buckets.get(row.key);
    return {
      ...bucket,
      totalSales: toMoney(bucket?.totalSales || 0),
      cashSales: toMoney(bucket?.cashSales || 0),
      cashTendered: toMoney(bucket?.cashTendered || 0),
      changeGiven: toMoney(bucket?.changeGiven || 0),
      netCashRetained: toMoney(bucket?.netCashRetained || 0),
      digitalSales: toMoney(bucket?.digitalSales || 0)
    };
  });
}

function buildPreviousRange(range) {
  if (!range?.dateFrom || !range?.dateTo) {
    return { label: 'previous', dateFrom: null, dateTo: null };
  }

  const start = new Date(range.dateFrom);
  const end = new Date(range.dateTo);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return { label: 'previous', dateFrom: null, dateTo: null };
  }

  const durationMs = end.getTime() - start.getTime();
  const previousEnd = new Date(start.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - durationMs);
  return {
    label: `previous-${range.label || 'range'}`,
    dateFrom: previousStart.toISOString(),
    dateTo: previousEnd.toISOString()
  };
}

function buildOverviewComparison(currentValue, previousValue) {
  const current = Number(currentValue || 0);
  const previous = Number(previousValue || 0);
  const delta = toMoney(current - previous);
  const percentChange = previous === 0
    ? (current === 0 ? 0 : 100)
    : toMoney((delta / previous) * 100);

  return {
    current,
    previous,
    delta,
    percentChange,
    direction: delta === 0 ? 'flat' : (delta > 0 ? 'up' : 'down')
  };
}

function summarizeStatusRows(transactions = []) {
  const buckets = new Map();
  (transactions || []).forEach((txn) => {
    const status = String(txn?.status || 'PENDING').trim().toUpperCase() || 'PENDING';
    const amount = toMoney(txn?.total ?? 0);
    if (!buckets.has(status)) {
      buckets.set(status, { status, count: 0, amount: 0 });
    }
    const bucket = buckets.get(status);
    bucket.count += 1;
    bucket.amount = toMoney(bucket.amount + amount);
  });
  return Array.from(buckets.values()).sort((a, b) => b.count - a.count || b.amount - a.amount);
}

function summarizePaymentMix(transactions = []) {
  const totalSales = toMoney((transactions || []).reduce((sum, txn) => sum + Number(txn?.total || 0), 0));
  const buckets = new Map();
  (transactions || []).forEach((txn) => {
    const method = String(txn?.paymentMethod || txn?.payment?.method || 'other').trim().toLowerCase() || 'other';
    if (!buckets.has(method)) {
      buckets.set(method, { method, count: 0, amount: 0, share: 0 });
    }
    const bucket = buckets.get(method);
    bucket.count += 1;
    bucket.amount = toMoney(bucket.amount + Number(txn?.total || 0));
  });
  return Array.from(buckets.values())
    .map((row) => ({
      ...row,
      share: totalSales > 0 ? toMoney((row.amount / totalSales) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount || b.count - a.count);
}

function summarizeOrderTypeMix(transactions = []) {
  const totalTransactions = Math.max(1, (transactions || []).length);
  const buckets = new Map();
  (transactions || []).forEach((txn) => {
    const orderType = String(txn?.orderType || 'unknown').trim().toLowerCase() || 'unknown';
    if (!buckets.has(orderType)) {
      buckets.set(orderType, { orderType, count: 0, amount: 0, share: 0 });
    }
    const bucket = buckets.get(orderType);
    bucket.count += 1;
    bucket.amount = toMoney(bucket.amount + Number(txn?.total || 0));
  });
  return Array.from(buckets.values())
    .map((row) => ({
      ...row,
      share: toMoney((row.count / totalTransactions) * 100)
    }))
    .sort((a, b) => b.count - a.count || b.amount - a.amount);
}

function formatDiscountProfileMonitorLabel(profile = null) {
  if (!profile || typeof profile !== 'object') return '';
  const name = String(profile?.name || '').trim() || 'Discount';
  const type = String(profile?.type || '').trim().toLowerCase() === 'fixed' ? 'fixed' : 'percent';
  const amount = Number(profile?.amount || profile?.percent || 0);
  if (!Number.isFinite(amount) || amount <= 0) return name;
  if (type === 'fixed') {
    return `${name} (- ${money(amount)})`;
  }
  return `${name} (${Number.isInteger(amount) ? amount : amount.toFixed(2)}%)`;
}

function summarizeDiscountProfileRows(transactions = []) {
  const buckets = new Map();
  (transactions || []).forEach((txn) => {
    const profile = txn?.discountProfile;
    const discountAmount = toMoney(txn?.discount || 0);
    if (!profile || discountAmount <= 0) return;
    const label = formatDiscountProfileMonitorLabel(profile);
    if (!buckets.has(label)) {
      buckets.set(label, {
        label,
        profileName: String(profile?.name || '').trim() || 'Discount',
        count: 0,
        discountAmount: 0,
        salesAmount: 0
      });
    }
    const bucket = buckets.get(label);
    bucket.count += 1;
    bucket.discountAmount = toMoney(bucket.discountAmount + discountAmount);
    bucket.salesAmount = toMoney(bucket.salesAmount + Number(txn?.total || 0));
  });
  return Array.from(buckets.values()).sort((a, b) => b.discountAmount - a.discountAmount || b.count - a.count);
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

app.post('/api/admin/users', requireRoleAccess('user_management_manage', 'Current role does not have permission to manage users.'), async (req, res) => {
  try {
    if (!supabaseService) {
      return res.status(503).json({ error: 'Supabase is not configured on server.' });
    }

    const fullName = String(req.body?.fullName || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const role = String(req.body?.role || '').trim().toLowerCase();

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email, and password are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email format is invalid.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (!AUTH_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role value.' });
    }

    const existingUser = await getAppUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
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
      return res.status(isExisting ? 409 : 400).json({
        error: isExisting ? 'Email is already registered.' : msg
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

    cacheAppUser(appUser);
    return res.status(201).json({
      user: {
        id: appUser.id,
        fullName: appUser.full_name,
        email: appUser.email,
        role: normalizeRole(appUser.role),
        isActive: Boolean(appUser.is_active),
        createdAt: appUser.created_at,
        lastLoginAt: appUser.last_login_at
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/users', requireAnyRoleAccess(['user_directory_access', 'user_management_manage'], 'Current role does not have user directory access.'), async (_req, res) => {
  try {
    if (!supabaseService) {
      return res.status(503).json({ error: 'Supabase is not configured on server.' });
    }

    const { data, error } = await supabaseService
      .from('app_users')
      .select('id, full_name, email, role, is_active, created_at, last_login_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const users = (data || []).map((user) => ({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: normalizeRole(user.role),
      isActive: Boolean(user.is_active),
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at
    }));

    return res.json({ users });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.patch('/api/admin/users/:userId/role', requireRoleAccess('user_management_manage', 'Current role does not have permission to manage users.'), async (req, res) => {
  try {
    if (!supabaseService) {
      return res.status(503).json({ error: 'Supabase is not configured on server.' });
    }

    const userId = String(req.params?.userId || '').trim();
    const role = String(req.body?.role || '').trim().toLowerCase();
    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }
    if (!AUTH_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role value.' });
    }

    const { data, error } = await supabaseService
      .from('app_users')
      .update({ role })
      .eq('id', userId)
      .select('id, full_name, email, role, is_active, created_at, last_login_at')
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'User not found.' });
    }

    cacheAppUser(data);
    return res.json({
      user: {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        role: normalizeRole(data.role),
        isActive: Boolean(data.is_active),
        createdAt: data.created_at,
        lastLoginAt: data.last_login_at
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.patch('/api/admin/users/:userId/status', requireRoleAccess('user_management_manage', 'Current role does not have permission to manage users.'), async (req, res) => {
  try {
    if (!supabaseService) {
      return res.status(503).json({ error: 'Supabase is not configured on server.' });
    }

    const userId = String(req.params?.userId || '').trim();
    const actorUserId = String(req.get('x-user-id') || '').trim();
    const isActive = req.body?.isActive;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be boolean.' });
    }
    if (!isActive && actorUserId && actorUserId === userId) {
      return res.status(400).json({ error: 'You cannot deactivate your own account.' });
    }

    const { data, error } = await supabaseService
      .from('app_users')
      .update({ is_active: isActive })
      .eq('id', userId)
      .select('id, full_name, email, role, is_active, created_at, last_login_at')
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'User not found.' });
    }

    cacheAppUser(data);
    return res.json({
      user: {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        role: normalizeRole(data.role),
        isActive: Boolean(data.is_active),
        createdAt: data.created_at,
        lastLoginAt: data.last_login_at
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/users/:userId/reset-password', requireRoleAccess('user_management_manage', 'Current role does not have permission to manage users.'), async (req, res) => {
  try {
    if (!supabaseService) {
      return res.status(503).json({ error: 'Supabase is not configured on server.' });
    }

    const userId = String(req.params?.userId || '').trim();
    const password = String(req.body?.password || '');

    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const targetUser = await getAppUserById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { error } = await supabaseService.auth.admin.updateUserById(userId, { password });
    if (error) {
      throw error;
    }

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

// ── Connectivity & Offline Sync ──
app.get('/api/connectivity', async (_req, res) => {
  try {
    const queueSummary = getOfflineQueueSummary();
    let supabaseReachable = false;
    if (isSupabaseEnabled() && supabaseService) {
      try {
        // Lightweight ping to Supabase
        const { error } = await supabaseService.from('pos_invoices').select('id', { count: 'exact', head: true }).limit(1);
        supabaseReachable = !error;
      } catch (_) {
        supabaseReachable = false;
      }
    }
    res.json({
      online: true,
      supabaseReachable,
      supabaseEnabled: isSupabaseEnabled(),
      queuedOperations: getOfflineQueueCount(),
      queuedInvoices: queueSummary.invoices,
      now: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sync/trigger', async (_req, res) => {
  try {
    if (!isSupabaseEnabled()) {
      return res.status(503).json({ error: 'Supabase is not configured.' });
    }
    const result = await syncOfflineQueue();
    res.json({
      success: true,
      synced: result.synced,
      failed: result.failed,
      remaining: result.remaining
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/config', async (_req, res) => {
  try {
    const [appConfig, activeReceiptTemplate] = await Promise.all([
      Promise.resolve(getAppConfig()),
      getActiveReceiptTemplate()
    ]);
    res.json({ appConfig, activeReceiptTemplate });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/products', async (_req, res) => {
  try {
    const appConfig = getAppConfig();
    const [categories, products, ingredients, recipes] = await Promise.all([
      listMenuCategories(),
      listProducts(),
      listInventoryIngredients(),
      listProductRecipes()
    ]);
    const availabilityProducts = buildProductAvailability(products, ingredients, recipes, appConfig);
    return res.json({ categories, products: availabilityProducts, appConfig });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/menu/categories', async (_req, res) => {
  try {
    const categories = await listMenuCategories();
    return res.json({ categories });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/menu/categories', requireRoleAccess('menu_editor_access', 'Current role does not have menu editor access.'), async (req, res) => {
  try {
    const category = await createMenuCategory({
      name: req.body?.name,
      key: req.body?.key,
      image: req.body?.image,
      sortOrder: req.body?.sortOrder
    });
    return res.status(201).json({ category });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/menu/categories/:categoryKey', requireRoleAccess('menu_editor_access', 'Current role does not have menu editor access.'), async (req, res) => {
  try {
    const category = await updateMenuCategory(req.params.categoryKey, {
      name: req.body?.name,
      image: req.body?.image,
      sortOrder: req.body?.sortOrder
    });
    return res.json({ category });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/api/menu/categories/:categoryKey', requireRoleAccess('menu_editor_access', 'Current role does not have menu editor access.'), async (req, res) => {
  try {
    const category = await deleteMenuCategory(req.params.categoryKey);
    return res.json({ deleted: true, category });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/menu/products', requireRoleAccess('menu_editor_access', 'Current role does not have menu editor access.'), async (req, res) => {
  try {
    const product = await createMenuProduct({
      name: req.body?.name,
      price: req.body?.price,
      image: req.body?.image,
      category: req.body?.category,
      sortOrder: req.body?.sortOrder
    });
    return res.status(201).json({ product });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/menu/products/:productId', requireRoleAccess('menu_editor_access', 'Current role does not have menu editor access.'), async (req, res) => {
  try {
    const product = await updateMenuProduct(req.params.productId, {
      name: req.body?.name,
      price: req.body?.price,
      image: req.body?.image,
      category: req.body?.category,
      sortOrder: req.body?.sortOrder
    });
    return res.json({ product });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/api/menu/products/:productId', requireRoleAccess('menu_editor_access', 'Current role does not have menu editor access.'), async (req, res) => {
  try {
    const product = await deleteMenuProduct(req.params.productId);
    return res.json({ deleted: true, product });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const {
      items,
      paymentMethod,
      discountAmount,
      discountProfile,
      orderType,
      clientInvoiceId,
      clientReference,
      cashierUserId,
      cashierEmail,
      cashierName,
      cashierRole
    } = req.body;
    if (!['cash', 'gcash', 'paymaya'].includes((paymentMethod || '').toLowerCase())) {
      return res.status(400).json({ error: 'paymentMethod must be cash, gcash, or paymaya' });
    }
    const normalizedOrderType = String(orderType || '').toLowerCase();
    if (!['dine-in', 'take-out'].includes(normalizedOrderType)) {
      return res.status(400).json({ error: 'orderType must be dine-in or take-out' });
    }
    const normalizedCashierEmail = String(cashierEmail || '').trim().toLowerCase() || null;
    const normalizedCashierName = String(cashierName || '').trim() || null;
    const normalizedCashierRole = String(cashierRole || '').trim().toLowerCase() || null;
    const invoice = await createInvoice({
      items: items || [],
      paymentMethod: paymentMethod.toLowerCase(),
      discountAmount: Number(discountAmount || 0),
      discountProfile,
      orderType: normalizedOrderType,
      invoiceId: clientInvoiceId || null,
      reference: clientReference || null,
      cashierUserId: String(cashierUserId || '').trim() || null,
      cashierEmail: normalizedCashierEmail,
      cashierName: normalizedCashierName,
      cashierRole: normalizedCashierRole
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

app.patch('/api/admin/invoices/:invoiceId/status', async (req, res) => {
  try {
    const invoiceId = String(req.params?.invoiceId || '').trim();
    const status = String(req.body?.status || '').trim().toUpperCase();
    const reason = String(req.body?.reason || '').trim();
    const role = normalizeRole(req.get('x-user-role') || req.body?.role || req.query?.role);
    const actorUserId = String(req.get('x-user-id') || '').trim() || null;
    const actorEmail = String(req.get('x-user-email') || '').trim().toLowerCase() || null;

    if (!invoiceId) {
      return res.status(400).json({ error: 'invoiceId is required.' });
    }
    if (!['CANCELLED', 'VOIDED', 'HOLD_FOR_VOID'].includes(status)) {
      return res.status(400).json({ error: 'status must be CANCELLED, HOLD_FOR_VOID, or VOIDED.' });
    }
    if (!reason) {
      return res.status(400).json({ error: 'A reason is required for invoice cancellation, hold for void, or voiding.' });
    }

    const existingInvoice = await getInvoice(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    if (!canManageInvoiceLifecycle({
      invoice: existingInvoice,
      nextStatus: status,
      role,
      actorUserId,
      actorEmail
    })) {
      return res.status(403).json({ error: 'You are not allowed to change this invoice status.' });
    }

    const invoice = await updateInvoiceLifecycleStatus({
      invoiceId,
      status,
      reason,
      actedByUserId: actorUserId,
      actedByEmail: actorEmail
    });

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

app.get('/api/admin/inventory/report', requireAnyRoleAccess(['inventory_access', 'inventory_manage'], 'Current role does not have inventory access.'), async (_req, res) => {
  try {
    const report = await getInventoryReport();
    return res.json(report);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/monthly-closing', requireAnyRoleAccess(['monthly_closing_access', 'monthly_expenses_manage'], 'Current role does not have monthly closing access.'), async (req, res) => {
  try {
    const month = String(req.query?.month || '').trim();
    if (!month) {
      return res.status(400).json({ error: 'month is required in YYYY-MM format.' });
    }
    const report = await getMonthlyClosingReport({ month });
    return res.json(report);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/expenses', requireAnyRoleAccess(['monthly_closing_access', 'monthly_expenses_manage'], 'Current role does not have monthly closing access.'), async (req, res) => {
  try {
    const expenses = await listExpenses({
      month: String(req.query?.month || '').trim() || null
    });
    return res.json({ expenses });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/expenses', requireRoleAccess('monthly_expenses_manage', 'Current role does not have permission to add monthly expenses.'), async (req, res) => {
  try {
    const expense = await createExpense({
      expenseDate: req.body?.expenseDate,
      category: req.body?.category,
      description: req.body?.description,
      amount: req.body?.amount,
      note: req.body?.note || null,
      createdByUserId: String(req.get('x-user-id') || '').trim() || null,
      createdByEmail: String(req.get('x-user-email') || '').trim().toLowerCase() || null,
      createdByName: req.body?.createdByName || null
    });
    return res.status(201).json({ expense });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/inventory/ingredients/:ingredientId/history', requireAnyRoleAccess(['inventory_access', 'inventory_manage'], 'Current role does not have inventory access.'), async (req, res) => {
  try {
    const history = await getInventoryIngredientHistory(req.params.ingredientId, {
      limit: Number(req.query?.limit || 50)
    });
    return res.json(history);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/inventory/ingredients', requireRoleAccess('inventory_manage', 'Current role does not have permission to manage inventory.'), async (req, res) => {
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

app.put('/api/admin/inventory/ingredients/:ingredientId', requireRoleAccess('inventory_manage', 'Current role does not have permission to manage inventory.'), async (req, res) => {
  try {
    const ingredient = await updateInventoryIngredient(req.params.ingredientId, {
      name: req.body?.name,
      qtyOnHand: req.body?.qtyOnHand,
      unitPrice: req.body?.unitPrice,
      reorderLevel: req.body?.reorderLevel,
      unit: req.body?.unit
    });
    return res.json({ ingredient });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/api/admin/inventory/ingredients/:ingredientId', requireRoleAccess('inventory_manage', 'Current role does not have permission to manage inventory.'), async (req, res) => {
  try {
    const ingredient = await deleteInventoryIngredient(req.params.ingredientId);
    return res.json({ deleted: true, ingredient });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/kit-spec', requireRoleAccess('kit_spec_access', 'Current role does not have kit specification access.'), async (_req, res) => {
  try {
    const appConfig = getAppConfig();
    const [categories, products, ingredients, recipes] = await Promise.all([
      listMenuCategories(),
      listProducts(),
      listInventoryIngredients(),
      listProductRecipes()
    ]);

    return res.json({
      categories,
      products: buildProductAvailability(products, ingredients, recipes, appConfig),
      appConfig,
      ingredients,
      recipes
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/app-config', requireAdminRole, async (req, res) => {
  try {
    const appConfig = await updateAppConfig({
      enforceKitSpec: req.body?.enforceKitSpec,
      discountProfiles: req.body?.discountProfiles,
      roleAccess: req.body?.roleAccess
    });
    return res.json({ appConfig });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/kit-spec-mode', requireRoleAccess('kit_spec_mode_manage', 'Current role does not have permission to change Kit Spec mode.'), async (req, res) => {
  try {
    const appConfig = await updateAppConfig({
      enforceKitSpec: req.body?.enforceKitSpec
    });
    return res.json({ appConfig });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/role-access', requireRoleAccess('user_management_manage', 'Current role does not have permission to manage role access.'), async (req, res) => {
  try {
    const appConfig = await updateAppConfig({
      roleAccess: req.body?.roleAccess
    });
    return res.json({ appConfig });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/discount-profiles', requireAnyRoleAccess(['discounts_access', 'discounts_manage'], 'Current role does not have discount manager access.'), async (_req, res) => {
  try {
    const [appConfig, profiles] = await Promise.all([
      Promise.resolve(getAppConfig()),
      listDiscountManagerProfiles()
    ]);
    return res.json({ appConfig, profiles });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/discount-profiles', requireRoleAccess('discounts_manage', 'Current role does not have permission to manage discount types.'), async (req, res) => {
  try {
    const result = await createDiscountProfile({
      name: req.body?.name,
      type: req.body?.type,
      amount: req.body?.amount
    });
    const profiles = await listDiscountManagerProfiles();
    return res.status(201).json({
      profile: result.profile,
      appConfig: result.appConfig,
      profiles
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/discount-profiles/:profileId', requireRoleAccess('discounts_manage', 'Current role does not have permission to manage discount types.'), async (req, res) => {
  try {
    const result = await updateDiscountProfile(req.params.profileId, {
      name: req.body?.name,
      type: req.body?.type,
      amount: req.body?.amount
    });
    const profiles = await listDiscountManagerProfiles();
    return res.json({
      profile: result.profile,
      appConfig: result.appConfig,
      profiles
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/api/admin/discount-profiles/:profileId', requireRoleAccess('discounts_manage', 'Current role does not have permission to manage discount types.'), async (req, res) => {
  try {
    const result = await deleteDiscountProfile(req.params.profileId);
    const profiles = await listDiscountManagerProfiles();
    return res.json({
      deleted: true,
      profile: result.profile,
      appConfig: result.appConfig,
      profiles
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/receipt-templates', requireAnyRoleAccess(['receipt_templates_access', 'receipt_templates_manage'], 'Current role does not have receipt template access.'), async (_req, res) => {
  try {
    const templates = await listReceiptTemplates();
    const activeTemplate = templates.find((template) => template.isActive) || templates[0] || null;
    return res.json({
      templates,
      activeTemplateId: activeTemplate?.id || null,
      activeReceiptTemplate: activeTemplate
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/receipt-templates', requireRoleAccess('receipt_templates_manage', 'Current role does not have permission to manage receipt templates.'), async (req, res) => {
  try {
    const template = await createReceiptTemplate({
      name: req.body?.name,
      settings: req.body?.settings
    });
    return res.status(201).json({ template });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/receipt-templates/:templateId', requireRoleAccess('receipt_templates_manage', 'Current role does not have permission to manage receipt templates.'), async (req, res) => {
  try {
    const template = await updateReceiptTemplate(req.params.templateId, {
      name: req.body?.name,
      settings: req.body?.settings
    });
    return res.json({ template });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/receipt-templates/:templateId/activate', requireRoleAccess('receipt_templates_manage', 'Current role does not have permission to manage receipt templates.'), async (req, res) => {
  try {
    const template = await activateReceiptTemplate(req.params.templateId);
    return res.json({ template });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/api/admin/receipt-templates/:templateId', requireRoleAccess('receipt_templates_manage', 'Current role does not have permission to manage receipt templates.'), async (req, res) => {
  try {
    const template = await deleteReceiptTemplate(req.params.templateId);
    return res.json({ deleted: true, template });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/kit-spec/:productId', requireRoleAccess('kit_spec_access', 'Current role does not have kit specification access.'), async (req, res) => {
  try {
    const productId = String(req.params?.productId || '').trim();
    if (!productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }

    const products = await listProducts();
    const product = (products || []).find((item) => String(item.id || '') === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const recipeItems = Array.isArray(req.body?.recipeItems) ? req.body.recipeItems : null;
    if (!recipeItems) {
      return res.status(400).json({ error: 'recipeItems must be an array.' });
    }

    const recipes = await replaceProductRecipes({
      productId,
      productName: product.name,
      recipeItems
    });

    return res.json({
      product: {
        id: product.id,
        name: product.name,
        category: product.category
      },
      recipes
    });
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
app.get('/api/admin/transactions', requireRoleAccess('control_center_access', 'Current role does not have Control Center access.'), async (req, res) => {
  try {
    const { status: filterStatus } = req.query;
    const range = buildOptionalRange(req.query, null);

    let transactions = await listAllInvoices({
      dateFrom: range.dateFrom || undefined,
      dateTo: range.dateTo || undefined,
      status: filterStatus || undefined
    });

    if (!String(filterStatus || '').trim()) {
      transactions = transactions.filter((txn) => String(txn.status || '').toUpperCase() !== 'CANCELLED');
    }

    return res.json({ transactions });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/overview', requireRoleAccess('control_center_access', 'Current role does not have Control Center access.'), async (req, res) => {
  try {
    const range = buildOptionalRange(req.query, 'daily');
    const previousRange = buildPreviousRange(range);
    const currentMonth = new Date().toISOString().slice(0, 7);

    const [
      transactions,
      previousTransactions,
      activeCashiers,
      discrepancyShifts,
      topProducts,
      previousTopProducts,
      inventoryReport,
      monthlyClosing,
      offlineQueueSummary
    ] = await Promise.all([
      listAllInvoices({
        dateFrom: range.dateFrom || undefined,
        dateTo: range.dateTo || undefined
      }),
      previousRange.dateFrom && previousRange.dateTo
        ? listAllInvoices({
          dateFrom: previousRange.dateFrom,
          dateTo: previousRange.dateTo
        })
        : Promise.resolve([]),
      listActiveCashierMonitoring(),
      listCashierShifts({
        dateFrom: range.dateFrom || undefined,
        dateTo: range.dateTo || undefined,
        discrepancyOnly: true
      }),
      getTopSalesPerProductByRange({
        dateFrom: range.dateFrom || undefined,
        dateTo: range.dateTo || undefined,
        limit: 100
      }),
      previousRange.dateFrom && previousRange.dateTo
        ? getTopSalesPerProductByRange({
          dateFrom: previousRange.dateFrom,
          dateTo: previousRange.dateTo,
          limit: 100
        })
        : Promise.resolve([]),
      getInventoryReport(),
      getMonthlyClosingReport({ month: currentMonth }),
      Promise.resolve(getOfflineQueueSummary())
    ]);

    const paidTransactions = transactions.filter((txn) => String(txn.status || '').toUpperCase() === 'PAID');
    const previousPaidTransactions = previousTransactions.filter((txn) => String(txn.status || '').toUpperCase() === 'PAID');
    const cancelledTransactions = transactions.filter((txn) => String(txn.status || '').toUpperCase() === 'CANCELLED');
    const voidedTransactions = transactions.filter((txn) => String(txn.status || '').toUpperCase() === 'VOIDED');
    const pendingTransactions = transactions.filter((txn) => String(txn.status || '').toUpperCase() === 'PENDING');

    const totalSales = toMoney(paidTransactions.reduce((sum, txn) => sum + Number(txn.total || 0), 0));
    const previousTotalSales = toMoney(previousPaidTransactions.reduce((sum, txn) => sum + Number(txn.total || 0), 0));
    const voidedAmount = toMoney(voidedTransactions.reduce((sum, txn) => sum + Number(txn.total || 0), 0));
    const averageTicket = paidTransactions.length ? toMoney(totalSales / paidTransactions.length) : 0;
    const previousAverageTicket = previousPaidTransactions.length
      ? toMoney(previousTotalSales / previousPaidTransactions.length)
      : 0;
    const cashTendered = toMoney(paidTransactions
      .filter((txn) => String(txn.paymentMethod || txn.payment?.method || '').toLowerCase() === 'cash')
      .reduce((sum, txn) => sum + Number(txn?.payment?.amountPaid ?? txn.total ?? 0), 0));
    const changeGiven = toMoney(paidTransactions
      .filter((txn) => String(txn.paymentMethod || txn.payment?.method || '').toLowerCase() === 'cash')
      .reduce((sum, txn) => sum + Number(txn?.payment?.change ?? 0), 0));
    const netCash = toMoney(cashTendered - changeGiven);
    const itemsSold = topProducts.reduce((sum, row) => sum + Number(row.qtySold || 0), 0);
    const previousItemsSold = previousTopProducts.reduce((sum, row) => sum + Number(row.qtySold || 0), 0);
    const lowStockIngredients = Number(inventoryReport?.totals?.lowStockCount || 0);
    const discrepancyAlerts = discrepancyShifts.length;
    const paymentMix = summarizePaymentMix(paidTransactions);
    const orderTypeMix = summarizeOrderTypeMix(paidTransactions);
    const statusBreakdown = summarizeStatusRows(transactions);
    const discountTypeSummary = summarizeDiscountProfileRows(paidTransactions);
    const peakHour = buildHourlySalesRows(paidTransactions)
      .reduce((best, row) => Number(row.totalSales || 0) > Number(best?.totalSales || 0) ? row : best, null);

    return res.json({
      generatedAt: new Date().toISOString(),
      range,
      transactions,
      metrics: {
        totalSales,
        totalTransactions: transactions.length,
        paidTransactions: paidTransactions.length,
        pendingTransactions: pendingTransactions.length,
        cancelledTransactions: cancelledTransactions.length,
        voidedTransactions: voidedTransactions.length,
        voidedAmount,
        averageTicket,
        itemsSold,
        netCash,
        cashTendered,
        changeGiven,
        activeCashiers: activeCashiers.length,
        lowStockIngredients,
        discrepancyAlerts,
        monthlyNetAfterExpenses: Number(monthlyClosing?.summary?.netSalesAfterExpenses || 0),
        monthlyExpenses: Number(monthlyClosing?.summary?.totalExpenses || 0),
        unsyncedOperations: Number(offlineQueueSummary?.operations || 0)
      },
      comparisons: {
        sales: buildOverviewComparison(totalSales, previousTotalSales),
        transactions: buildOverviewComparison(paidTransactions.length, previousPaidTransactions.length),
        averageTicket: buildOverviewComparison(averageTicket, previousAverageTicket),
        itemsSold: buildOverviewComparison(itemsSold, previousItemsSold)
      },
      paymentMix,
      orderTypeMix,
      statusBreakdown,
      discountTypeSummary,
      attention: {
        pendingPayments: pendingTransactions.length,
        discrepancyAlerts,
        lowStockIngredients,
        activeCashiers: activeCashiers.length,
        unsyncedOperations: Number(offlineQueueSummary?.operations || 0),
        voidedTransactions: voidedTransactions.length,
        cancelledTransactions: cancelledTransactions.length
      },
      topProducts: topProducts.slice(0, 8),
      activeCashiers: activeCashiers.slice(0, 6),
      hourlySales: buildHourlySalesRows(paidTransactions),
      weekdaySales: buildWeekdaySalesRows(paidTransactions),
      monthlyClosing: {
        month: monthlyClosing?.month || currentMonth,
        summary: monthlyClosing?.summary || {}
      },
      inventory: {
        totals: inventoryReport?.totals || {},
        alerts: inventoryReport?.monitor?.alerts || []
      },
      highlights: {
        peakHour: peakHour || null
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/cash-drawers', async (_req, res) => {
  try {
    const drawers = await listCashDrawers();
    return res.json({ drawers });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/shifts/opening-context', requireRoleAccess('shift_session_access', 'Current role does not have shift-session access.'), async (req, res) => {
  try {
    const drawerId = String(req.query?.drawerId || '').trim() || null;
    const cashierEmail = String(req.get('x-user-email') || req.query?.cashierEmail || '').trim().toLowerCase();
    const cashierUserId = String(req.get('x-user-id') || req.query?.cashierUserId || '').trim() || null;
    if (!drawerId) {
      return res.status(400).json({ error: 'drawerId is required.' });
    }

    const context = await getCashierShiftOpeningContext({
      drawerId,
      cashierUserId,
      cashierEmail
    });

    return res.json({
      drawer: context.drawer,
      activeShift: context.activeShift,
      previousShift: context.previousShift,
      previousDrawerBalance: context.previousDrawerBalance
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/shifts/start', requireRoleAccess('shift_session_access', 'Current role does not have shift-session access.'), async (req, res) => {
  try {
    const drawerId = String(req.body?.drawerId || '').trim() || null;
    const cashierEmail = String(req.body?.cashierEmail || req.get('x-user-email') || '').trim().toLowerCase();
    const cashierUserId = String(req.body?.cashierUserId || req.get('x-user-id') || '').trim() || null;
    const cashierName = String(req.body?.cashierName || '').trim() || 'Cashier';
    const cashierRole = normalizeRole(req.body?.cashierRole || req.get('x-user-role') || 'encharge');
    const startingCash = toMoney(req.body?.startingCash);
    const previousDrawerBalance = req.body?.previousDrawerBalance === null || req.body?.previousDrawerBalance === undefined || req.body?.previousDrawerBalance === ''
      ? null
      : toMoney(req.body?.previousDrawerBalance);
    const openingAdjustment = req.body?.openingAdjustment === null || req.body?.openingAdjustment === undefined || req.body?.openingAdjustment === ''
      ? null
      : Math.round(Number(req.body?.openingAdjustment) * 100) / 100;
    if (!drawerId) {
      return res.status(400).json({ error: 'drawerId is required.' });
    }
    if (!cashierEmail) {
      return res.status(400).json({ error: 'cashierEmail is required.' });
    }
    if (!Number.isFinite(startingCash) || startingCash < 0) {
      return res.status(400).json({ error: 'startingCash must be a number >= 0.' });
    }
    if (previousDrawerBalance !== null && (!Number.isFinite(previousDrawerBalance) || previousDrawerBalance < 0)) {
      return res.status(400).json({ error: 'previousDrawerBalance must be a number >= 0.' });
    }
    if (openingAdjustment !== null && !Number.isFinite(openingAdjustment)) {
      return res.status(400).json({ error: 'openingAdjustment must be a valid amount.' });
    }

    const shift = await startCashierShift({
      drawerId,
      cashierUserId,
      cashierEmail,
      cashierName,
      cashierRole,
      previousShiftId: String(req.body?.previousShiftId || '').trim() || null,
      previousDrawerBalance,
      openingAdjustment,
      startingCash,
      shiftStartAt: req.body?.shiftStartAt || null
    });
    return res.status(201).json({ shift });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/drawers', requireAnyRoleAccess(['cash_drawer_access', 'operations_access'], 'Current role does not have cash drawer access.'), async (_req, res) => {
  try {
    const drawers = await listCashDrawers();
    const activeShifts = await listCashierShifts({ status: 'active' });
    const rows = await Promise.all(drawers.map(async (drawer) => {
      const activeShift = activeShifts.find((shift) => String(shift.drawerId || '') === String(drawer.id || '')) || null;
      let currentAmount = Number(drawer.currentBalance || 0);
      let activeCashierName = null;
      if (activeShift) {
        const enriched = await enrichShiftWithSummary(activeShift);
        currentAmount = Number(enriched.expectedCash || currentAmount);
        activeCashierName = enriched.cashierName || null;
      }
      return {
        ...drawer,
        currentAmount,
        activeShiftId: activeShift?.id || null,
        activeCashierName
      };
    }));
    return res.json({ drawers: rows });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/drawers', requireRoleAccess('cash_drawer_access', 'Current role does not have cash drawer access.'), async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const initialBalance = toMoney(req.body?.initialBalance);
    if (!name) {
      return res.status(400).json({ error: 'name is required.' });
    }
    if (!Number.isFinite(initialBalance) || initialBalance <= 0) {
      return res.status(400).json({ error: 'initialBalance must be a number greater than 0.' });
    }
    const drawer = await createCashDrawer({ name, initialBalance });
    return res.status(201).json({ drawer });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/drawers/:drawerId', requireRoleAccess('cash_drawer_access', 'Current role does not have cash drawer access.'), async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const initialBalance = toMoney(req.body?.initialBalance);
    if (!name) {
      return res.status(400).json({ error: 'name is required.' });
    }
    if (!Number.isFinite(initialBalance) || initialBalance <= 0) {
      return res.status(400).json({ error: 'initialBalance must be a number greater than 0.' });
    }
    const drawer = await updateCashDrawer(req.params.drawerId, { name, initialBalance });
    return res.json({ drawer });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/api/admin/drawers/:drawerId', requireRoleAccess('cash_drawer_access', 'Current role does not have cash drawer access.'), async (req, res) => {
  try {
    const drawer = await deleteCashDrawer(req.params.drawerId);
    return res.json({ deleted: true, drawer });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/shifts/:shiftId/summary', requireAnyRoleAccess(['shift_session_access', 'shift_monitor_access', 'operations_access'], 'Current role does not have shift summary access.'), async (req, res) => {
  try {
    const shift = await getCashierShiftById(req.params.shiftId);
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found.' });
    }

    const summary = await getCashierShiftSummary(shift);
    return res.json({
      shift,
      summary: {
        shiftId: summary.shiftId,
        drawerId: shift.drawerId || null,
        drawerName: shift.drawerName || null,
        startedAt: shift.shiftStartAt,
        endedAt: shift.shiftEndAt || null,
        startingCash: Number(shift.startingCash || 0),
        totalSales: Number(summary.totalSales || 0),
        totalTransactions: Number(summary.totalTransactions || 0),
        holdForVoidCount: Number(summary.holdForVoidCount || 0),
        holdForVoidAmount: Number(summary.holdForVoidAmount || 0),
        cashPayments: Number(summary.cashSales || 0),
        cashTendered: Number(summary.cashTendered || 0),
        changeGiven: Number(summary.changeGiven || 0),
        netCashRetained: Number(summary.netCashRetained || 0),
        cashWithdrawals: Number(summary.cashWithdrawals || 0),
        otherPayments: Number(summary.digitalSales || 0),
        paymentMethods: summary.paymentMethods || {},
        expectedCashBalance: Number(summary.expectedCashBalance || 0)
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/shifts/:shiftId/end', requireRoleAccess('shift_session_access', 'Current role does not have shift-session access.'), async (req, res) => {
  try {
    const endingCash = toMoney(req.body?.endingCash);
    if (!Number.isFinite(endingCash) || endingCash < 0) {
      return res.status(400).json({ error: 'endingCash must be a number >= 0.' });
    }

    const result = await closeCashierShift({
      shiftId: req.params.shiftId,
      endingCash,
      reviewedByUserId: String(req.get('x-user-id') || '').trim() || null,
      reviewedByEmail: String(req.get('x-user-email') || '').trim().toLowerCase() || null
    });

    return res.json({
      shift: result.shift,
      summary: {
        shiftId: result.summary.shiftId,
        drawerId: result.shift?.drawerId || null,
        drawerName: result.shift?.drawerName || null,
        startedAt: result.shift?.shiftStartAt || null,
        endedAt: result.shift?.shiftEndAt || null,
        startingCash: Number(result.shift?.startingCash || 0),
        totalSales: Number(result.summary.totalSales || 0),
        totalTransactions: Number(result.summary.totalTransactions || 0),
        holdForVoidCount: Number(result.summary.holdForVoidCount || 0),
        holdForVoidAmount: Number(result.summary.holdForVoidAmount || 0),
        cashPayments: Number(result.summary.cashSales || 0),
        cashTendered: Number(result.summary.cashTendered || 0),
        changeGiven: Number(result.summary.changeGiven || 0),
        netCashRetained: Number(result.summary.netCashRetained || 0),
        cashWithdrawals: Number(result.summary.cashWithdrawals || 0),
        otherPayments: Number(result.summary.digitalSales || 0),
        paymentMethods: result.summary.paymentMethods || {},
        expectedCashBalance: Number(result.summary.expectedCashBalance || 0),
        endingCash: Number(result.summary.endingCash || 0),
        discrepancy: Number(result.summary.discrepancy || 0)
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/cashiers/active', requireRoleAccess('operations_access', 'Current role does not have operations access.'), async (_req, res) => {
  try {
    const cashiers = await listActiveCashierMonitoring();
    return res.json({ cashiers });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/cash-drawer', requireAnyRoleAccess(['cash_drawer_access', 'operations_access'], 'Current role does not have cash drawer access.'), async (_req, res) => {
  try {
    const drawers = await listCashDrawers();
    const activeShifts = await listCashierShifts({ status: 'active' });
    const drawerRows = await Promise.all(drawers.map(async (drawer) => {
      const activeShift = activeShifts.find((shift) => String(shift.drawerId || '') === String(drawer.id || '')) || null;
      const usage = await getCashDrawerUsageStats(drawer.id);
      let currentAmount = Number(drawer.currentBalance || 0);
      let activeCashierName = null;
      if (activeShift) {
        const enriched = await enrichShiftWithSummary(activeShift);
        currentAmount = Number(enriched.expectedCash || currentAmount);
        activeCashierName = enriched.cashierName || null;
      }
      return {
        ...drawer,
        currentAmount,
        activeShiftId: activeShift?.id || null,
        activeCashierName,
        shiftCount: Number(usage.shiftCount || 0),
        movementCount: Number(usage.movementCount || 0),
        canEdit: !usage.hasTransactions,
        canDelete: !usage.hasTransactions
      };
    }));
    const recentMovementsRaw = await listCashDrawerMovements({ limit: 25 });
    const recentMovements = await Promise.all(recentMovementsRaw.map(async (movement) => {
      const shift = movement.shiftId ? await getCashierShiftById(movement.shiftId) : null;
      const drawer = movement.drawerId ? await getCashDrawerById(movement.drawerId) : null;
      return {
        ...movement,
        drawerName: drawer?.name || movement.drawerName || null,
        cashierName: shift?.cashierName || null,
        cashierEmail: shift?.cashierEmail || null
      };
    }));

    return res.json({
      summary: {
        drawerCount: drawerRows.length,
        activeDrawers: drawerRows.filter((row) => row.activeShiftId).length,
        totalCurrentDrawerCash: toMoney(drawerRows.reduce((sum, row) => sum + Number(row.currentAmount || 0), 0)),
        totalWithdrawals: toMoney(recentMovements
          .filter((row) => String(row.movementType || '').toLowerCase() === 'withdrawal')
          .reduce((sum, row) => sum + Number(row.amount || 0), 0))
      },
      drawers: drawerRows,
      recentMovements
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/drawers/:drawerId/withdraw', requireRoleAccess('cash_drawer_access', 'Current role does not have cash drawer access.'), async (req, res) => {
  try {
    const drawerId = String(req.params?.drawerId || req.body?.drawerId || '').trim();
    const amount = toMoney(req.body?.amount);
    const note = String(req.body?.note || '').trim();
    if (!drawerId) {
      return res.status(400).json({ error: 'drawerId is required.' });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'amount must be greater than 0.' });
    }
    if (!note) {
      return res.status(400).json({ error: 'note is required for drawer deductions.' });
    }

    const drawer = await getCashDrawerById(drawerId);
    if (!drawer) {
      return res.status(404).json({ error: 'Drawer not found.' });
    }
    const activeShifts = await listCashierShifts({ status: 'active' });
    const activeShift = activeShifts.find((shift) => String(shift.drawerId || '') === drawerId) || null;
    const activeShiftSummary = activeShift ? await enrichShiftWithSummary(activeShift) : null;
    const currentDrawerAmount = activeShiftSummary
      ? Number(activeShiftSummary.expectedCash || 0)
      : Number(drawer.currentBalance || 0);
    if (amount > currentDrawerAmount) {
      return res.status(400).json({ error: 'Deduction amount exceeds the current drawer amount.' });
    }

    const movement = await createCashDrawerMovement({
      drawerId,
      shiftId: activeShiftSummary?.id || null,
      movementType: 'withdrawal',
      amount,
      note,
      performedByUserId: String(req.get('x-user-id') || '').trim() || null,
      performedByEmail: String(req.get('x-user-email') || '').trim().toLowerCase() || null,
      performedByName: String(req.body?.performedByName || '').trim() || null
    });
    const current = activeShiftSummary
      ? await enrichShiftWithSummary(activeShiftSummary)
      : await getCashDrawerById(drawerId);

    return res.status(201).json({ movement, drawer: current });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/shifts', requireRoleAccess('operations_access', 'Current role does not have operations access.'), async (req, res) => {
  try {
    const range = buildOptionalRange(req.query, null);
    const status = String(req.query?.status || '').trim().toLowerCase() || null;
    const discrepancyOnly = String(req.query?.discrepancyOnly || '').trim().toLowerCase() === 'true';

    const shifts = await listCashierShifts({
      status,
      dateFrom: range.dateFrom || undefined,
      dateTo: range.dateTo || undefined,
      discrepancyOnly
    });
    const rows = await Promise.all(shifts.map((shift) => enrichShiftWithSummary(shift)));

    const summary = {
      total: rows.length,
      active: rows.filter((x) => String(x.status || '').toLowerCase() === 'active').length,
      loggedOut: rows.filter((x) => String(x.status || '').toLowerCase() === 'logged_out').length,
      pendingReview: rows.filter((x) => String(x.reviewStatus || '').toLowerCase() === 'pending').length,
      discrepancyCount: rows.filter((x) => Number(x.discrepancy || 0) !== 0).length,
      openingAdjustments: toMoney(rows.reduce((sum, x) => sum + Math.abs(Number(x.openingAdjustment || 0)), 0)),
      holdForVoidCount: rows.reduce((sum, x) => sum + Number(x.holdForVoidCount || 0), 0),
      holdForVoidAmount: toMoney(rows.reduce((sum, x) => sum + Number(x.holdForVoidAmount || 0), 0)),
      cashWithdrawals: toMoney(rows.reduce((sum, x) => sum + Number(x.cashWithdrawals || 0), 0)),
      cashTendered: toMoney(rows.reduce((sum, x) => sum + Number(x.cashTendered || 0), 0)),
      changeGiven: toMoney(rows.reduce((sum, x) => sum + Number(x.changeGiven || 0), 0)),
      netCashRetained: toMoney(rows.reduce((sum, x) => sum + Number(x.netCashRetained || 0), 0))
    };

    return res.json({ range, summary, shifts: rows });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/discrepancies', requireRoleAccess('operations_access', 'Current role does not have operations access.'), async (req, res) => {
  try {
    const range = buildOptionalRange(req.query, null);
    const shifts = await listCashierShifts({
      dateFrom: range.dateFrom || undefined,
      dateTo: range.dateTo || undefined,
      discrepancyOnly: true
    });

    const alerts = shifts
      .filter((x) => Number(x.discrepancy || 0) !== 0)
      .map((x) => {
        const discrepancy = Number(x.discrepancy || 0);
        return {
          shiftId: x.id,
          drawerId: x.drawerId || null,
          drawerName: x.drawerName || 'Drawer',
          cashierName: x.cashierName,
          cashierEmail: x.cashierEmail,
          shiftStartAt: x.shiftStartAt,
          shiftEndAt: x.shiftEndAt,
          expectedCash: Number(x.expectedCash || 0),
          endingCash: x.endingCash === null ? null : Number(x.endingCash || 0),
          discrepancy,
          discrepancyType: discrepancy > 0 ? 'over' : 'short',
          reviewStatus: x.reviewStatus || 'pending',
          reviewNote: x.reviewNote || null,
          reviewedByEmail: x.reviewedByEmail || null,
          reviewedAt: x.reviewedAt || null
        };
      })
      .sort((a, b) => Math.abs(b.discrepancy) - Math.abs(a.discrepancy));

    return res.json({
      range,
      summary: {
        totalAlerts: alerts.length,
        pendingReview: alerts.filter((x) => x.reviewStatus === 'pending').length,
        approved: alerts.filter((x) => x.reviewStatus === 'approved').length,
        investigate: alerts.filter((x) => x.reviewStatus === 'investigate').length
      },
      alerts
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.patch('/api/admin/shifts/:shiftId/review', requireRoleAccess('operations_access', 'Current role does not have operations access.'), async (req, res) => {
  try {
    const reviewedShift = await reviewCashierShift({
      shiftId: req.params.shiftId,
      reviewStatus: req.body?.reviewStatus,
      reviewNote: req.body?.reviewNote || null,
      reviewedByUserId: String(req.get('x-user-id') || '').trim() || null,
      reviewedByEmail: String(req.get('x-user-email') || '').trim().toLowerCase() || null
    });
    return res.json({ shift: reviewedShift });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/sales/dashboard', requireRoleAccess('reports_access', 'Current role does not have reports access.'), async (req, res) => {
  try {
    const range = buildOptionalRange(req.query, 'daily');
    let resolvedRange = range;

    if (range.label === 'all' && (!range.dateFrom || !range.dateTo)) {
      const earliestPaidDate = await getEarliestInvoiceDate({ status: 'PAID' });
      const rangeEnd = new Date();
      rangeEnd.setUTCHours(23, 59, 59, 999);
      resolvedRange = {
        label: 'all',
        dateFrom: earliestPaidDate,
        dateTo: rangeEnd.toISOString()
      };
    }

    const transactions = await listAllInvoices({
      dateFrom: resolvedRange.dateFrom || undefined,
      dateTo: resolvedRange.dateTo || undefined,
      status: 'PAID'
    });

    const totals = {
      totalSales: 0,
      cashSales: 0,
      cashTendered: 0,
      changeGiven: 0,
      netCashRetained: 0,
      digitalSales: 0,
      totalTransactions: transactions.length
    };
    const paymentMethods = {};

    transactions.forEach((txn) => {
      const method = String(txn.paymentMethod || txn.payment?.method || 'other').toLowerCase();
      const amount = toMoney(txn.total ?? 0);
      totals.totalSales += amount;
      paymentMethods[method] = toMoney((paymentMethods[method] || 0) + amount);
      if (method === 'cash') {
        totals.cashSales += amount;
        const tendered = toMoney(txn?.payment?.amountPaid ?? amount);
        const change = toMoney(txn?.payment?.change ?? 0);
        totals.cashTendered += tendered;
        totals.changeGiven += Math.max(0, change);
      }
      else totals.digitalSales += amount;
    });

    totals.totalSales = toMoney(totals.totalSales);
    totals.cashSales = toMoney(totals.cashSales);
    totals.cashTendered = toMoney(totals.cashTendered);
    totals.changeGiven = toMoney(totals.changeGiven);
    totals.netCashRetained = toMoney(totals.cashTendered - totals.changeGiven);
    totals.digitalSales = toMoney(totals.digitalSales);

    const topSellingProducts = resolvedRange.dateFrom && resolvedRange.dateTo
      ? await getTopSalesPerProductByRange({
        dateFrom: resolvedRange.dateFrom,
        dateTo: resolvedRange.dateTo,
        limit: Number(req.query?.limit || 10)
      })
      : [];

    const hourlySales = buildHourlySalesRows(transactions);
    const weekdaySales = buildWeekdaySalesRows(transactions);

    return res.json({
      generatedAt: new Date().toISOString(),
      range: resolvedRange,
      totals,
      paymentMethods,
      topSellingProducts,
      hourlySales,
      weekdaySales
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/reports/:reportType', requireRoleAccess('reports_access', 'Current role does not have reports access.'), async (req, res) => {
  try {
    const reportType = String(req.params?.reportType || '').trim().toLowerCase();
    const range = buildOptionalRange(req.query, 'daily');
    const generatedAt = new Date().toISOString();

    if (reportType === 'daily-sales') {
      const report = await getSalesReport({
        dateFrom: range.dateFrom || undefined,
        dateTo: range.dateTo || undefined
      });
      return res.json({
        reportType,
        generatedAt,
        range: { label: range.label, dateFrom: report.range.dateFrom, dateTo: report.range.dateTo },
        summary: {
          totalSales: report.totalSales,
          totalTransactions: report.totalTransactions,
          averageTicket: report.averageTicket,
          byMethod: report.byMethod
        },
        rows: report.transactions || []
      });
    }

    if (reportType === 'monthly-closing') {
      const month = String(req.query?.month || '').trim();
      if (!month) {
        return res.status(400).json({ error: 'month is required for monthly closing report.' });
      }
      const report = await getMonthlyClosingReport({ month });
      return res.json({
        ...report,
        generatedAt,
        rows: report.expenses || []
      });
    }

    if (reportType === 'cashier-shift') {
      const shifts = await listCashierShifts({
        dateFrom: range.dateFrom || undefined,
        dateTo: range.dateTo || undefined
      });
      const rows = await Promise.all(shifts.map((shift) => enrichShiftWithSummary(shift)));
      return res.json({
        reportType,
        generatedAt,
        range,
        summary: {
          totalShifts: rows.length,
          totalSales: toMoney(rows.reduce((sum, x) => sum + Number(x.totalSales || 0), 0)),
          cashTendered: toMoney(rows.reduce((sum, x) => sum + Number(x.cashTendered || 0), 0)),
          changeGiven: toMoney(rows.reduce((sum, x) => sum + Number(x.changeGiven || 0), 0)),
          netCashRetained: toMoney(rows.reduce((sum, x) => sum + Number(x.netCashRetained || 0), 0)),
          cashWithdrawals: toMoney(rows.reduce((sum, x) => sum + Number(x.cashWithdrawals || 0), 0)),
          discrepancies: rows.filter((x) => Number(x.discrepancy || 0) !== 0).length
        },
        rows
      });
    }

    if (reportType === 'transactions') {
      const status = String(req.query?.status || '').trim().toUpperCase() || undefined;
      const transactions = await listAllInvoices({
        dateFrom: range.dateFrom || undefined,
        dateTo: range.dateTo || undefined,
        status
      });
      return res.json({
        reportType,
        generatedAt,
        range,
        summary: {
          totalTransactions: transactions.length,
          paidTransactions: transactions.filter((x) => x.status === 'PAID').length,
          pendingTransactions: transactions.filter((x) => x.status === 'PENDING').length
        },
        rows: transactions
      });
    }

    if (reportType === 'product-sales') {
      const rows = await getTopSalesPerProductByRange({
        dateFrom: range.dateFrom || undefined,
        dateTo: range.dateTo || undefined,
        limit: Number(req.query?.limit || 50)
      });
      return res.json({
        reportType,
        generatedAt,
        range,
        summary: {
          totalProducts: rows.length
        },
        rows
      });
    }

    if (reportType === 'discrepancy') {
      const rows = await listCashierShifts({
        dateFrom: range.dateFrom || undefined,
        dateTo: range.dateTo || undefined,
        discrepancyOnly: true
      });
      return res.json({
        reportType,
        generatedAt,
        range,
        summary: {
          totalDiscrepancies: rows.length,
          pendingReview: rows.filter((x) => String(x.reviewStatus || '').toLowerCase() === 'pending').length
        },
        rows
      });
    }

    return res.status(400).json({
      error: 'reportType must be one of: daily-sales, monthly-closing, cashier-shift, transactions, product-sales, discrepancy'
    });
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

app.use((error, _req, res, next) => {
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Uploaded image is too large. Please use a smaller image file.' });
  }
  return next(error);
});

if (require.main === module && process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`POS server running on ${baseUrl}`);
    console.log(`Provider: ${providerName}`);
    console.log(`Supabase: ${isSupabaseEnabled() ? `enabled (${getSupabaseMode()})` : 'disabled'}`);

    // Start periodic sync for offline queue (every 60 seconds)
    if (isSupabaseEnabled()) {
      setInterval(() => {
        syncOfflineQueue().catch((err) => {
          console.warn('[PeriodicSync] Failed:', err.message);
        });
      }, 60000);
      console.log('Periodic sync: enabled (60s interval)');
    }
  });
}

module.exports = app;
