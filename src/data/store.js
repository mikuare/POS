const { v4: uuidv4 } = require('uuid');
const { getSupabase, isSupabaseEnabled } = require('./supabaseClient');

const PRODUCTS = [
  // Main Dish
  { id: 'p1', name: 'Succulent Roast Beef', price: 249, category: 'main-dish', image: '/Main Dish/Succulent Roast Beef Slides with rice and beef sauce.png' },
  { id: 'p2', name: 'Roasted Beef w Java Rice', price: 229, category: 'main-dish', image: '/Main Dish/roasted beef w java rice.png' },
  { id: 'p3', name: 'Party Tray', price: 799, category: 'main-dish', image: '/Main Dish/Party Tray.png' },
  { id: 'p4', name: 'Letchon Baka', price: 269, category: 'main-dish', image: '/Main Dish/Letchon Baka.png' },
  { id: 'p5', name: 'Crispy Letchon Kawali', price: 219, category: 'main-dish', image: '/Main Dish/Crispy Letchon Kawali.png' },
  { id: 'p6', name: 'Beef Steak with Hot Sauce', price: 239, category: 'main-dish', image: '/Main Dish/beef steak with hot sauce.png' },
  { id: 'p7', name: 'Beef Caldereta', price: 229, category: 'main-dish', image: '/Main Dish/Beef Caldereta.png' },

  // Rice
  { id: 'p20', name: 'Delicious Fried Rice', price: 79, category: 'rice', image: '/Rice/Delicious fried rice.png' },
  { id: 'p21', name: 'Unli Rice', price: 59, category: 'rice', image: '/Rice/Unli Rice.png' },
  { id: 'p22', name: 'Brown Rice Bowl', price: 69, category: 'rice', image: '/Rice/Steaming bowl of brown rice.png' },
  { id: 'p23', name: 'Fluffy Rice Bowl', price: 65, category: 'rice', image: '/Rice/Steaming bowl of fluffy rice.png' },

  // Burger
  { id: 'p30', name: 'Spicy Jalapeno Cheeseburger', price: 189, category: 'burger', image: '/Burger/Spicy jalapeño cheeseburger with fries.png' },
  { id: 'p31', name: 'Gourmet Cheese Burger', price: 179, category: 'burger', image: '/Burger/Gourmet cheese burger.png' },
  { id: 'p32', name: 'Crispy Chicken Sandwich', price: 169, category: 'burger', image: '/Burger/Crispy chicken sandwich with slaw Burger.png' },
  { id: 'p33', name: 'BBQ Bacon Cheeseburger', price: 199, category: 'burger', image: '/Burger/BBQ bacon cheeseburger.png' },

  // Drinks
  { id: 'p40', name: 'Lemon-Lime Soda', price: 59, category: 'drinks', image: '/Drinks/Refreshing lemon-lime soda on wood.png' },
  { id: 'p41', name: 'Iced Tea Citrus Mint', price: 69, category: 'drinks', image: '/Drinks/Iced tea with citrus and mint.png' },
  { id: 'p42', name: 'Refreshing Soda Lemon', price: 55, category: 'drinks', image: '/Drinks/Refreshing soda with lemon wedges.png' },
  { id: 'p43', name: 'Coke Float', price: 79, category: 'drinks', image: '/Drinks/Coke Float.png' },
  { id: 'p44', name: 'Mango Juice', price: 85, category: 'drinks', image: '/Drinks/Refreshing mango juice with mint garnish.png' },
  { id: 'p45', name: 'Citrus Iced Drink', price: 75, category: 'drinks', image: '/Drinks/Citrus iced drinks with mint garnish.png' },
  { id: 'p46', name: 'Strawberry Lemonade', price: 89, category: 'drinks', image: '/Drinks/Refreshing strawberry lemonade.png' },

  // Fries
  { id: 'p50', name: 'Loaded Bacon Cheese Fries', price: 139, category: 'fries', image: '/Fries/Loaded bacon cheese fries close-up.png' },
  { id: 'p51', name: 'Crispy Fries', price: 99, category: 'fries', image: '/Fries/Crispy Fries with dipping sauce.png' },
  { id: 'p52', name: 'Cajun Seasoned Fries', price: 119, category: 'fries', image: '/Fries/Cajun seasoned fries.png' },

  // Dessert
  { id: 'p60', name: 'Strawberry Cheesecake Slice', price: 109, category: 'dessert', image: '/Dessert/Delicious strawberry cheesecake slice.png' },
  { id: 'p61', name: 'Leche Flan Slice', price: 89, category: 'dessert', image: '/Dessert/Delicious slice of leche flan.png' },
  { id: 'p62', name: 'Chocolate Fudge Cake Slice', price: 119, category: 'dessert', image: '/Dessert/Delicious chocolate fudge cake slice.png' },

  // Sauces
  { id: 'p70', name: 'Spicy Vinegar Sauce', price: 25, category: 'sauces', image: '/Sauces/Spicy Vinegar sauce.png' },
  { id: 'p71', name: 'Spicy BBQ Sauce', price: 30, category: 'sauces', image: '/Sauces/Spicy BBQ sauce.png' },
  { id: 'p72', name: 'Gravy Sauce', price: 25, category: 'sauces', image: '/Sauces/Gravy Sauce.png' },
  { id: 'p73', name: 'Baka Sauce', price: 35, category: 'sauces', image: '/Sauces/Baka Sauce.png' }
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
    subtotal: Number(dbInvoice.total_amount),
    discount: 0,
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
    successMessage: dbPayment.success_message,
    customerName: dbPayment.customer_name || null,
    customerEmail: dbPayment.customer_email || null,
    customerPhone: dbPayment.customer_phone || null
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

async function createInvoice({ items, paymentMethod, discountAmount = 0 }) {
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

  const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const requestedDiscount = Number(discountAmount || 0);
  const discount = Number.isFinite(requestedDiscount) && requestedDiscount > 0
    ? Math.min(requestedDiscount, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discount);
  const invoice = {
    id: uuidv4(),
    reference: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: now,
    updatedAt: now,
    status: 'PENDING',
    paymentMethod,
    subtotal,
    discount,
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
      success_message: paymentData.successMessage || null,
      customer_name: paymentData.customerName || null,
      customer_email: paymentData.customerEmail || null,
      customer_phone: paymentData.customerPhone || null
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

async function listAllInvoices({ dateFrom, dateTo, status } = {}) {
  const { fromIso, toIso } = dateFrom && dateTo
    ? normalizeDateRange({ dateFrom, dateTo })
    : { fromIso: null, toIso: null };

  if (isSupabaseEnabled()) {
    let query = supabase
      .from('pos_invoices')
      .select('id,reference,total_amount,payment_method,status,created_at,updated_at')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (fromIso && toIso) {
      query = query.gte('created_at', fromIso).lte('created_at', toIso);
    }

    const { data: invoicesData, error: invoicesError } = await query;

    if (invoicesError) {
      throw new Error(`Supabase invoices query failed: ${invoicesError.message}`);
    }

    const invoiceIds = (invoicesData || []).map((x) => x.id);
    let payments = [];
    let gcashSessions = [];

    if (invoiceIds.length) {
      const { data: dbPayments, error: paymentsError } = await supabase
        .from('pos_payments')
        .select('invoice_id,method,amount_paid,change_amount,paid_at,provider,provider_reference,customer_name,customer_email,customer_phone')
        .in('invoice_id', invoiceIds);

      if (paymentsError) {
        throw new Error(`Supabase payments query failed: ${paymentsError.message}`);
      }
      payments = dbPayments || [];

      const { data: dbSessions, error: sessionsError } = await supabase
        .from('pos_gcash_sessions')
        .select('invoice_id,reference,provider,checkout_url,status')
        .in('invoice_id', invoiceIds);

      if (!sessionsError) {
        gcashSessions = dbSessions || [];
      }
    }

    const paymentByInvoiceId = new Map(payments.map((p) => [p.invoice_id, p]));
    const sessionByInvoiceId = new Map(gcashSessions.map((s) => [s.invoice_id, s]));

    return (invoicesData || []).map((inv) => {
      const payment = paymentByInvoiceId.get(inv.id);
      const session = sessionByInvoiceId.get(inv.id);
      return {
        id: inv.id,
        reference: inv.reference,
        status: inv.status,
        paymentMethod: inv.payment_method,
        subtotal: Number(inv.total_amount),
        discount: 0,
        total: Number(inv.total_amount),
        createdAt: inv.created_at,
        updatedAt: inv.updated_at,
        payment: payment ? {
          method: payment.method,
          amountPaid: Number(payment.amount_paid),
          change: Number(payment.change_amount || 0),
          paidAt: payment.paid_at,
          provider: payment.provider,
          providerReference: payment.provider_reference,
          customerName: payment.customer_name || null,
          customerEmail: payment.customer_email || null,
          customerPhone: payment.customer_phone || null
        } : null,
        gcashSession: session ? {
          reference: session.reference,
          provider: session.provider,
          checkoutUrl: session.checkout_url,
          status: session.status
        } : null
      };
    });
  }

  // In-memory fallback
  let results = Array.from(invoices.values());

  if (status) {
    results = results.filter((inv) => inv.status === status);
  }

  if (fromIso && toIso) {
    results = results.filter((inv) => {
      const d = new Date(inv.createdAt);
      return d >= new Date(fromIso) && d <= new Date(toIso);
    });
  }

  return results
    .map((inv) => ({
      id: inv.id,
      reference: inv.reference,
      status: inv.status,
      paymentMethod: inv.paymentMethod,
      subtotal: inv.subtotal ?? inv.total,
      discount: inv.discount || 0,
      total: inv.total,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt,
      payment: inv.payment,
      gcashSession: gcashSessions.get(inv.id) || null
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getGcashSessionByInvoiceId(invoiceId) {
  // Check local memory first
  for (const [, session] of gcashSessions) {
    if (session.invoiceId === invoiceId) {
      return session;
    }
  }

  if (!isSupabaseEnabled()) {
    return null;
  }

  const { data, error } = await supabase
    .from('pos_gcash_sessions')
    .select('*')
    .eq('invoice_id', invoiceId)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase GCash session fetch failed: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const session = toAppSession(data);
  gcashSessions.set(session.reference, session);
  return session;
}

module.exports = {
  listProducts,
  createInvoice,
  getInvoice,
  setInvoicePaid,
  saveGcashSession,
  getGcashSessionByReference,
  getGcashSessionByInvoiceId,
  getSalesReport,
  listAllInvoices
};

