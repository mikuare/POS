const { v4: uuidv4 } = require('uuid');
const { getSupabase, isSupabaseEnabled } = require('./supabaseClient');

const PRODUCTS = [
  { id: 'p1', name: 'Milk Tea', price: 120 },
  { id: 'p2', name: 'Burger', price: 180 },
  { id: 'p3', name: 'Fries', price: 90 },
  { id: 'p4', name: 'Iced Coffee', price: 140 }
];

const invoices = new Map();
const gcashSessions = new Map();
const supabase = getSupabase();

function listProducts() {
  return PRODUCTS;
}

function toDbInvoice(invoice) {
  return {
    id: invoice.id,
    reference: invoice.reference,
    status: invoice.status,
    payment_method: invoice.paymentMethod,
    total_amount: invoice.total,
    created_at: invoice.createdAt,
    updated_at: invoice.updatedAt
  };
}

function toAppInvoice(dbInvoice, lineItems, payment) {
  return {
    id: dbInvoice.id,
    reference: dbInvoice.reference,
    createdAt: dbInvoice.created_at,
    updatedAt: dbInvoice.updated_at,
    status: dbInvoice.status,
    paymentMethod: dbInvoice.payment_method,
    total: Number(dbInvoice.total_amount),
    lineItems,
    payment
  };
}

function toDbLineItems(invoiceId, lineItems) {
  return lineItems.map((item) => ({
    id: uuidv4(),
    invoice_id: invoiceId,
    product_id: item.productId,
    product_name: item.name,
    unit_price: item.price,
    qty: item.qty,
    subtotal: item.subtotal
  }));
}

function toAppLineItems(dbItems) {
  return dbItems.map((item) => ({
    productId: item.product_id,
    name: item.product_name,
    price: Number(item.unit_price),
    qty: Number(item.qty),
    subtotal: Number(item.subtotal)
  }));
}

function toAppPayment(dbPayment) {
  if (!dbPayment) return null;

  return {
    method: dbPayment.method,
    provider: dbPayment.provider,
    providerReference: dbPayment.provider_reference,
    recipientGcashNumber: dbPayment.recipient_gcash_number,
    paidAt: dbPayment.paid_at,
    amountPaid: Number(dbPayment.amount_paid),
    change: Number(dbPayment.change_amount || 0),
    success: Boolean(dbPayment.success),
    successMessage: dbPayment.success_message
  };
}

async function persistInvoice(invoice) {
  if (!isSupabaseEnabled()) return;

  const { error: invoiceError } = await supabase
    .from('pos_invoices')
    .upsert(toDbInvoice(invoice), { onConflict: 'id' });

  if (invoiceError) {
    throw new Error(`Supabase invoice upsert failed: ${invoiceError.message}`);
  }

  const { error: deleteItemsError } = await supabase
    .from('pos_invoice_items')
    .delete()
    .eq('invoice_id', invoice.id);

  if (deleteItemsError) {
    throw new Error(`Supabase invoice-items cleanup failed: ${deleteItemsError.message}`);
  }

  const dbItems = toDbLineItems(invoice.id, invoice.lineItems);
  const { error: itemsError } = await supabase.from('pos_invoice_items').insert(dbItems);

  if (itemsError) {
    throw new Error(`Supabase invoice-items insert failed: ${itemsError.message}`);
  }
}

async function createInvoice({ items, paymentMethod }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Invoice must contain at least one item');
  }

  const now = new Date().toISOString();
  const lineItems = items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Unknown product: ${item.productId}`);
      }
      const qty = Number(item.qty || 0);
      if (qty <= 0) {
        throw new Error(`Invalid qty for product: ${item.productId}`);
      }
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        qty,
        subtotal: product.price * qty
      };
    });

  const total = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const invoice = {
    id: uuidv4(),
    reference: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: now,
    updatedAt: now,
    status: 'PENDING',
    paymentMethod,
    total,
    lineItems,
    payment: null
  };

  invoices.set(invoice.id, invoice);
  await persistInvoice(invoice);

  return invoice;
}

async function getInvoice(invoiceId) {
  const localInvoice = invoices.get(invoiceId);
  if (localInvoice) {
    return localInvoice;
  }

  if (!isSupabaseEnabled()) {
    return null;
  }

  const { data: dbInvoice, error: invoiceError } = await supabase
    .from('pos_invoices')
    .select('*')
    .eq('id', invoiceId)
    .maybeSingle();

  if (invoiceError) {
    throw new Error(`Supabase invoice fetch failed: ${invoiceError.message}`);
  }

  if (!dbInvoice) {
    return null;
  }

  const { data: dbItems, error: itemsError } = await supabase
    .from('pos_invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('created_at', { ascending: true });

  if (itemsError) {
    throw new Error(`Supabase invoice-items fetch failed: ${itemsError.message}`);
  }

  const { data: dbPayment, error: paymentError } = await supabase
    .from('pos_payments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .maybeSingle();

  if (paymentError) {
    throw new Error(`Supabase payment fetch failed: ${paymentError.message}`);
  }

  const invoice = toAppInvoice(dbInvoice, toAppLineItems(dbItems || []), toAppPayment(dbPayment));
  invoices.set(invoice.id, invoice);

  return invoice;
}

async function setInvoicePaid(invoiceId, paymentData) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  if (invoice.status === 'PAID') {
    return invoice;
  }

  invoice.status = 'PAID';
  invoice.payment = paymentData;
  invoice.updatedAt = new Date().toISOString();
  invoices.set(invoiceId, invoice);

  if (isSupabaseEnabled()) {
    const { error: invoiceError } = await supabase
      .from('pos_invoices')
      .update({
        status: invoice.status,
        updated_at: invoice.updatedAt
      })
      .eq('id', invoice.id);

    if (invoiceError) {
      throw new Error(`Supabase invoice payment-status update failed: ${invoiceError.message}`);
    }

    const paymentRow = {
      invoice_id: invoice.id,
      method: paymentData.method,
      provider: paymentData.provider || null,
      provider_reference: paymentData.providerReference || null,
      recipient_gcash_number: paymentData.recipientGcashNumber || null,
      paid_at: paymentData.paidAt,
      amount_paid: paymentData.amountPaid,
      change_amount: paymentData.change || 0,
      success: Boolean(paymentData.success),
      success_message: paymentData.successMessage || null
    };

    const { error: paymentError } = await supabase
      .from('pos_payments')
      .upsert(paymentRow, { onConflict: 'invoice_id' });

    if (paymentError) {
      throw new Error(`Supabase payment upsert failed: ${paymentError.message}`);
    }
  }

  return invoice;
}

function toDbSession(session) {
  return {
    reference: session.reference,
    invoice_id: session.invoiceId,
    provider: session.provider,
    amount: session.amount,
    currency: session.currency,
    qr_text: session.qrText,
    qr_data_url: session.qrDataUrl,
    checkout_url: session.checkoutUrl,
    status: session.status,
    merchant_gcash_number: session?.merchant?.gcashNumber || null,
    created_at: session.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function toAppSession(dbSession) {
  return {
    reference: dbSession.reference,
    invoiceId: dbSession.invoice_id,
    provider: dbSession.provider,
    amount: Number(dbSession.amount),
    currency: dbSession.currency,
    qrText: dbSession.qr_text,
    qrDataUrl: dbSession.qr_data_url,
    checkoutUrl: dbSession.checkout_url,
    status: dbSession.status,
    merchant: {
      gcashNumber: dbSession.merchant_gcash_number
    }
  };
}

async function saveGcashSession(session) {
  gcashSessions.set(session.reference, session);

  if (!isSupabaseEnabled()) {
    return;
  }

  const { error } = await supabase
    .from('pos_gcash_sessions')
    .upsert(toDbSession(session), { onConflict: 'reference' });

  if (error) {
    throw new Error(`Supabase GCash session upsert failed: ${error.message}`);
  }
}

async function getGcashSessionByReference(reference) {
  const localSession = gcashSessions.get(reference);
  if (localSession) {
    return localSession;
  }

  if (!isSupabaseEnabled()) {
    return null;
  }

  const { data, error } = await supabase
    .from('pos_gcash_sessions')
    .select('*')
    .eq('reference', reference)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase GCash session fetch failed: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const session = toAppSession(data);
  gcashSessions.set(reference, session);
  return session;
}

function normalizeDateRange({ dateFrom, dateTo }) {
  if (!dateFrom || !dateTo) {
    throw new Error('dateFrom and dateTo are required');
  }
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    throw new Error('Invalid dateFrom/dateTo format');
  }
  if (from > to) {
    throw new Error('dateFrom must be before or equal to dateTo');
  }
  return { fromIso: from.toISOString(), toIso: to.toISOString() };
}

function summarizeSalesRows(rows) {
  const byMethod = {};
  let totalSales = 0;

  rows.forEach((row) => {
    totalSales += Number(row.amountPaid);
    const method = row.method || 'unknown';
    byMethod[method] = (byMethod[method] || 0) + Number(row.amountPaid);
  });

  const totalTransactions = rows.length;
  const averageTicket = totalTransactions ? totalSales / totalTransactions : 0;

  return {
    totalSales,
    totalTransactions,
    averageTicket,
    byMethod
  };
}

async function getSalesReport({ dateFrom, dateTo }) {
  const { fromIso, toIso } = normalizeDateRange({ dateFrom, dateTo });

  if (isSupabaseEnabled()) {
    const { data: invoices, error: invoicesError } = await supabase
      .from('pos_invoices')
      .select('id,reference,total_amount,payment_method,status,created_at')
      .eq('status', 'PAID')
      .gte('created_at', fromIso)
      .lte('created_at', toIso)
      .order('created_at', { ascending: false });

    if (invoicesError) {
      throw new Error(`Supabase invoices report query failed: ${invoicesError.message}`);
    }

    const invoiceIds = (invoices || []).map((x) => x.id);
    let payments = [];

    if (invoiceIds.length) {
      const { data: dbPayments, error: paymentsError } = await supabase
        .from('pos_payments')
        .select('invoice_id,method,amount_paid,change_amount,paid_at')
        .in('invoice_id', invoiceIds);

      if (paymentsError) {
        throw new Error(`Supabase payments report query failed: ${paymentsError.message}`);
      }
      payments = dbPayments || [];
    }

    const paymentByInvoiceId = new Map(payments.map((p) => [p.invoice_id, p]));
    const salesRows = (invoices || []).map((inv) => {
      const p = paymentByInvoiceId.get(inv.id);
      return {
        invoiceId: inv.id,
        reference: inv.reference,
        method: p?.method || inv.payment_method,
        amountPaid: Number(p?.amount_paid ?? inv.total_amount),
        paidAt: p?.paid_at || inv.created_at
      };
    });

    const summary = summarizeSalesRows(salesRows);
    return {
      range: { dateFrom: fromIso, dateTo: toIso },
      ...summary,
      transactions: salesRows
    };
  }

  const salesRows = Array.from(invoices.values())
    .filter((inv) => inv.status === 'PAID')
    .filter((inv) => {
      const d = new Date(inv.updatedAt || inv.createdAt);
      return d >= new Date(fromIso) && d <= new Date(toIso);
    })
    .map((inv) => ({
      invoiceId: inv.id,
      reference: inv.reference,
      method: inv.payment?.method || inv.paymentMethod,
      amountPaid: Number(inv.payment?.amountPaid ?? inv.total),
      paidAt: inv.payment?.paidAt || inv.updatedAt || inv.createdAt
    }))
    .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

  const summary = summarizeSalesRows(salesRows);
  return {
    range: { dateFrom: fromIso, dateTo: toIso },
    ...summary,
    transactions: salesRows
  };
}

module.exports = {
  listProducts,
  createInvoice,
  getInvoice,
  setInvoicePaid,
  saveGcashSession,
  getGcashSessionByReference,
  getSalesReport
};
