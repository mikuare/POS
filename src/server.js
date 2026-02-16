require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const {
  listProducts,
  createInvoice,
  getInvoice,
  setInvoicePaid,
  saveGcashSession,
  getGcashSessionByReference,
  getSalesReport
} = require('./data/store');
const { isSupabaseEnabled, getSupabaseMode } = require('./data/supabaseClient');
const MockProvider = require('./providers/mockProvider');
const PaymongoProvider = require('./providers/paymongoProvider');

const app = express();
const PORT = Number(process.env.PORT || 4000);
const baseUrl = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const providerName = (process.env.PAYMENT_PROVIDER || 'mock').toLowerCase();
const gcashOwnerNumber = process.env.GCASH_OWNER_NUMBER || '09615745812';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const provider = providerName === 'paymongo'
  ? new PaymongoProvider()
  : new MockProvider({ baseUrl, gcashOwnerNumber });

async function processPaymentWebhook(payload) {
  const { reference, status, provider: webhookProvider } = payload;
  const session = await getGcashSessionByReference(reference);

  if (!session) {
    return { statusCode: 404, body: { error: 'Session not found for reference' } };
  }

  if ((status || '').toUpperCase() !== 'PAID') {
    return { statusCode: 200, body: { ok: true, ignored: true } };
  }

  const invoice = await setInvoicePaid(session.invoiceId, {
    method: 'gcash',
    provider: webhookProvider || session.provider,
    providerReference: reference,
    recipientGcashNumber: session?.merchant?.gcashNumber || gcashOwnerNumber,
    paidAt: new Date().toISOString(),
    amountPaid: session.amount,
    change: 0,
    success: true,
    successMessage: 'Payment Successful'
  });

  session.status = 'PAID';
  await saveGcashSession(session);

  return { statusCode: 200, body: { ok: true, invoice } };
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    provider: providerName,
    gcashOwnerNumber,
    supabaseEnabled: isSupabaseEnabled(),
    supabaseMode: getSupabaseMode(),
    now: new Date().toISOString()
  });
});

app.get('/api/config', (_req, res) => {
  res.json({ gcashOwnerNumber });
});

app.get('/api/products', (_req, res) => {
  res.json({ products: listProducts() });
});

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

app.post('/api/invoices', async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    if (!['cash', 'gcash'].includes((paymentMethod || '').toLowerCase())) {
      return res.status(400).json({ error: 'paymentMethod must be cash or gcash' });
    }
    const invoice = await createInvoice({ items: items || [], paymentMethod: paymentMethod.toLowerCase() });
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

app.post('/api/payments/gcash/checkout', async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const invoice = await getInvoice(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.paymentMethod !== 'gcash') {
      return res.status(400).json({ error: 'Invoice payment method is not gcash' });
    }

    if (invoice.status === 'PAID') {
      return res.status(400).json({ error: 'Invoice already paid' });
    }

    const session = await provider.createGcashCheckout({ invoice });
    await saveGcashSession({ ...session, invoiceId: invoice.id, status: 'PENDING' });

    return res.status(201).json({ checkout: session });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

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
  try {
    const result = await processPaymentWebhook(req.body);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
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

app.get('/checkout/:reference', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'checkout.html'));
});

app.listen(PORT, () => {
  console.log(`POS server running on ${baseUrl}`);
  console.log(`Provider: ${providerName}`);
  console.log(`Supabase: ${isSupabaseEnabled() ? `enabled (${getSupabaseMode()})` : 'disabled'}`);
});
