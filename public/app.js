const state = {
  products: [],
  cart: {},
  activeInvoice: null,
  poller: null,
};

// ── POS Tab Elements ──
const productsEl = document.getElementById('products');
const cartEl = document.getElementById('cart');
const totalEl = document.getElementById('total');
const statusEl = document.getElementById('status');
const paymentMethodEl = document.getElementById('paymentMethod');
const amountTenderedEl = document.getElementById('amountTendered');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearBtn = document.getElementById('clearBtn');
const cashRowEl = document.getElementById('cashRow');
const gcashInfoEl = document.getElementById('gcashInfo');
const salesSummaryEl = document.getElementById('salesSummary');
const salesListEl = document.getElementById('salesList');
const salesDailyBtn = document.getElementById('salesDailyBtn');
const salesWeeklyBtn = document.getElementById('salesWeeklyBtn');
const salesRefreshBtn = document.getElementById('salesRefreshBtn');

// ── Admin Tab Elements ──
const adminFilterEl = document.getElementById('adminFilter');
const adminRangeEl = document.getElementById('adminRange');
const adminRefreshBtn = document.getElementById('adminRefreshBtn');
const adminVerifyAllBtn = document.getElementById('adminVerifyAllBtn');
const adminTransactionsEl = document.getElementById('adminTransactions');
const statTotalEl = document.getElementById('statTotal');
const statPaidEl = document.getElementById('statPaid');
const statPendingEl = document.getElementById('statPending');
const statRevenueEl = document.getElementById('statRevenue');
const statCashEl = document.getElementById('statCash');
const statGcashEl = document.getElementById('statGcash');

// ── Tab Elements ──
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let activeSalesRange = 'daily';

// ══════════════════════════════════════════
// Utility Functions
// ══════════════════════════════════════════

function money(value) {
  return `PHP ${Number(value).toFixed(2)}`;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getCartItems() {
  return Object.entries(state.cart)
    .filter(([, qty]) => qty > 0)
    .map(([productId, qty]) => ({ productId, qty }));
}

function getCartTotal() {
  const byId = Object.fromEntries(state.products.map((p) => [p.id, p]));
  return Object.entries(state.cart).reduce((sum, [productId, qty]) => {
    const p = byId[productId];
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

// ══════════════════════════════════════════
// Tab Navigation
// ══════════════════════════════════════════

function switchTab(tabName) {
  tabBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  tabContents.forEach((content) => {
    content.classList.toggle('active', content.id === `tab-${tabName}`);
  });

  if (tabName === 'admin') {
    refreshAdminTransactions();
  }
}

// ══════════════════════════════════════════
// POS Terminal Functions
// ══════════════════════════════════════════

function renderProducts() {
  productsEl.innerHTML = '';
  state.products.forEach((p) => {
    const row = document.createElement('div');
    row.className = 'product-row';
    row.innerHTML = `
      <div>
        <strong>${p.name}</strong><br />
        <small>${money(p.price)}</small>
      </div>
      <button data-add="${p.id}">Add</button>
    `;
    productsEl.appendChild(row);
  });
}

function renderCart() {
  cartEl.innerHTML = '';

  const items = getCartItems();
  if (!items.length) {
    cartEl.innerHTML = '<p>No items yet.</p>';
  } else {
    const byId = Object.fromEntries(state.products.map((p) => [p.id, p]));
    items.forEach(({ productId, qty }) => {
      const p = byId[productId];
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div>${p.name} x ${qty}</div>
        <div>
          ${money(p.price * qty)}
          <button class="secondary" data-remove="${p.id}">-1</button>
        </div>
      `;
      cartEl.appendChild(row);
    });
  }

  totalEl.textContent = `Total: ${money(getCartTotal())}`;
}

function onProductClick(e) {
  const addId = e.target.getAttribute('data-add');
  const removeId = e.target.getAttribute('data-remove');

  if (addId) {
    state.cart[addId] = (state.cart[addId] || 0) + 1;
    renderCart();
  }

  if (removeId) {
    state.cart[removeId] = Math.max(0, (state.cart[removeId] || 0) - 1);
    renderCart();
  }
}

function resetAfterSale() {
  state.cart = {};
  state.activeInvoice = null;
  gcashInfoEl.innerHTML = '';
  if (state.poller) {
    clearInterval(state.poller);
    state.poller = null;
  }
  renderCart();
}

function renderReceipt(invoice) {
  const lines = invoice.lineItems
    .map((x) => `${x.name} x ${x.qty} = ${money(x.subtotal)}`)
    .join('\n');

  const successText = invoice?.payment?.successMessage || (invoice.status === 'PAID' ? 'Payment Successful' : 'Payment Pending');

  setStatus(
    [
      `Invoice: ${invoice.reference}`,
      `Status: ${invoice.status}`,
      `Payment: ${invoice.paymentMethod.toUpperCase()}`,
      `Result: ${successText}`,
      '',
      lines,
      '',
      `Total: ${money(invoice.total)}`,
      `Paid: ${money(invoice.payment.amountPaid)}`,
      `Change: ${money(invoice.payment.change || 0)}`,
      invoice.paymentMethod === 'gcash' ? `Recipient GCash: ${invoice.payment.recipientGcashNumber || 'via PayMongo'}` : '',
      `Paid At: ${invoice.payment.paidAt}`
    ].filter(Boolean).join('\n')
  );
}

function renderSalesReport(report) {
  salesSummaryEl.textContent = [
    `Range: ${report.range.label.toUpperCase()}`,
    `Total Sales: ${money(report.totalSales)}`,
    `Transactions: ${report.totalTransactions}`,
    `Average Ticket: ${money(report.averageTicket)}`,
    `Cash: ${money(report.byMethod?.cash || 0)}`,
    `GCash: ${money(report.byMethod?.gcash || 0)}`
  ].join('\n');

  const rows = (report.transactions || []).slice(0, 10);
  if (!rows.length) {
    salesListEl.innerHTML = '<p>No sales found for this range.</p>';
    return;
  }

  salesListEl.innerHTML = rows
    .map(
      (x) => `
      <div class="sales-row">
        <span>${x.reference}</span>
        <span>${String(x.method || '').toUpperCase()}</span>
        <span>${money(x.amountPaid)}</span>
      </div>
    `
    )
    .join('');
}

async function refreshSalesReport(range = activeSalesRange) {
  try {
    activeSalesRange = range;
    const report = await api(`/api/reports/sales?range=${encodeURIComponent(range)}`);
    renderSalesReport(report);
  } catch (error) {
    salesSummaryEl.textContent = `Sales report error: ${error.message}`;
    salesListEl.innerHTML = '';
  }
}

async function pollInvoice(invoiceId) {
  if (state.poller) {
    clearInterval(state.poller);
  }

  let pollCount = 0;
  const maxPolls = 90; // 3 minutes at 2s intervals

  state.poller = setInterval(async () => {
    try {
      pollCount++;

      // Every 5th poll, also try to verify directly with PayMongo
      if (pollCount % 5 === 0) {
        try {
          const verifyResult = await api(`/api/payments/gcash/verify/${invoiceId}`, {
            method: 'POST'
          });
          if (verifyResult.verified || verifyResult.alreadyPaid) {
            clearInterval(state.poller);
            state.poller = null;
            const inv = verifyResult.invoice;
            renderReceipt(inv);
            await refreshSalesReport(activeSalesRange);
            return;
          }
        } catch (verifyErr) {
          // Ignore verify errors, continue polling
        }
      }

      const { invoice } = await api(`/api/invoices/${invoiceId}`);
      if (invoice.status === 'PAID') {
        clearInterval(state.poller);
        state.poller = null;
        renderReceipt(invoice);
        await refreshSalesReport(activeSalesRange);
      } else if (pollCount >= maxPolls) {
        clearInterval(state.poller);
        state.poller = null;
        setStatus('Payment verification timed out. Check Admin tab to verify manually.');
      }
    } catch (err) {
      setStatus(`Polling error: ${err.message}`);
    }
  }, 2000);
}

async function handleCheckout() {
  try {
    const items = getCartItems();
    if (!items.length) {
      setStatus('Add at least one item first.');
      return;
    }

    const paymentMethod = paymentMethodEl.value;

    const { invoice } = await api('/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ items, paymentMethod })
    });

    state.activeInvoice = invoice;

    if (paymentMethod === 'cash') {
      const tendered = Number(amountTenderedEl.value || 0);
      const paid = await api('/api/payments/cash', {
        method: 'POST',
        body: JSON.stringify({ invoiceId: invoice.id, amountTendered: tendered })
      });
      renderReceipt(paid.invoice);
      await refreshSalesReport(activeSalesRange);
      resetAfterSale();
      return;
    }

    const { checkout } = await api('/api/payments/gcash/checkout', {
      method: 'POST',
      body: JSON.stringify({ invoiceId: invoice.id })
    });

    const qrMarkup = checkout.qrDataUrl
      ? `<img class="qr" alt="GCash QR" src="${checkout.qrDataUrl}" />`
      : '<div>No direct QR in POS for this provider. Continue in hosted checkout.</div>';

    gcashInfoEl.innerHTML = `
      <h3>GCash Checkout</h3>
      <div>Gateway: <strong>${String(checkout.provider || '').toUpperCase()}</strong></div>
      <div>Reference: ${checkout.reference}</div>
      ${qrMarkup}
      <div class="row">
        <button id="openCheckout" class="secondary">Open Hosted Checkout</button>
      </div>
    `;

    const openBtn = document.getElementById('openCheckout');
    openBtn.addEventListener('click', () => {
      window.open(checkout.checkoutUrl, '_blank', 'noopener');
    });

    window.open(checkout.checkoutUrl, '_blank', 'noopener');
    setStatus(`GCash checkout created via ${String(checkout.provider || '').toUpperCase()}. Waiting for payment...\nReference: ${checkout.reference}\n\nPayment will be auto-verified every 10 seconds.`);

    await pollInvoice(invoice.id);
  } catch (error) {
    setStatus(`Checkout error: ${error.message}`);
  }
}

function onPaymentMethodChange() {
  cashRowEl.style.display = paymentMethodEl.value === 'cash' ? 'flex' : 'none';
}

// ══════════════════════════════════════════
// Admin / Transactions Functions
// ══════════════════════════════════════════

async function refreshAdminTransactions() {
  try {
    const filterStatus = adminFilterEl.value;
    const range = adminRangeEl.value;

    let url = '/api/admin/transactions?';
    if (filterStatus) url += `status=${encodeURIComponent(filterStatus)}&`;
    if (range) url += `range=${encodeURIComponent(range)}&`;

    const { transactions } = await api(url);
    renderAdminTransactions(transactions);
    renderAdminStats(transactions);
  } catch (error) {
    adminTransactionsEl.innerHTML = `<p class="error">Error loading transactions: ${error.message}</p>`;
  }
}

function renderAdminStats(transactions) {
  const total = transactions.length;
  const paid = transactions.filter((t) => t.status === 'PAID');
  const pending = transactions.filter((t) => t.status === 'PENDING');

  const totalRevenue = paid.reduce((sum, t) => sum + (t.payment?.amountPaid || t.total), 0);
  const cashRevenue = paid
    .filter((t) => t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + (t.payment?.amountPaid || t.total), 0);
  const gcashRevenue = paid
    .filter((t) => t.paymentMethod === 'gcash')
    .reduce((sum, t) => sum + (t.payment?.amountPaid || t.total), 0);

  statTotalEl.textContent = total;
  statPaidEl.textContent = paid.length;
  statPendingEl.textContent = pending.length;
  statRevenueEl.textContent = money(totalRevenue);
  statCashEl.textContent = money(cashRevenue);
  statGcashEl.textContent = money(gcashRevenue);
}

function renderAdminTransactions(transactions) {
  if (!transactions.length) {
    adminTransactionsEl.innerHTML = '<p>No transactions found.</p>';
    return;
  }

  const rows = transactions.map((t) => {
    const statusClass = t.status === 'PAID' ? 'badge-paid' : 'badge-pending';
    const methodClass = t.paymentMethod === 'gcash' ? 'badge-gcash' : 'badge-cash';

    const verifyBtn = (t.status === 'PENDING' && t.paymentMethod === 'gcash')
      ? `<button class="verify-btn small" data-verify="${t.id}">Verify</button>`
      : '';

    const paidInfo = t.payment
      ? `<div class="txn-paid-info">Paid: ${money(t.payment.amountPaid)} at ${formatDate(t.payment.paidAt)}</div>`
      : '';

    // Customer information from PayMongo billing
    let customerInfoHtml = '';
    if (t.payment) {
      const name = t.payment.customerName;
      const email = t.payment.customerEmail;
      const phone = t.payment.customerPhone;

      if (name || email || phone) {
        customerInfoHtml = `
          <div class="txn-customer">
            <div class="txn-customer-label">Customer Info:</div>
            ${name ? `<div class="txn-customer-field"><span class="field-icon">👤</span> ${escapeHtml(name)}</div>` : ''}
            ${email ? `<div class="txn-customer-field"><span class="field-icon">📧</span> ${escapeHtml(email)}</div>` : ''}
            ${phone ? `<div class="txn-customer-field"><span class="field-icon">📱</span> ${escapeHtml(phone)}</div>` : ''}
          </div>
        `;
      }
    }

    return `
      <div class="txn-row">
        <div class="txn-main">
          <div class="txn-ref">${t.reference}</div>
          <div class="txn-badges">
            <span class="badge ${statusClass}">${t.status}</span>
            <span class="badge ${methodClass}">${t.paymentMethod.toUpperCase()}</span>
          </div>
        </div>
        <div class="txn-details">
          <div class="txn-amount">${money(t.total)}</div>
          <div class="txn-date">${formatDate(t.createdAt)}</div>
          ${paidInfo}
          ${customerInfoHtml}
        </div>
        <div class="txn-actions">
          ${verifyBtn}
        </div>
      </div>
    `;
  });

  adminTransactionsEl.innerHTML = rows.join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function verifyPayment(invoiceId) {
  try {
    const btn = document.querySelector(`[data-verify="${invoiceId}"]`);
    if (btn) {
      btn.textContent = 'Verifying...';
      btn.disabled = true;
    }

    const result = await api(`/api/payments/gcash/verify/${invoiceId}`, {
      method: 'POST'
    });

    if (result.verified || result.alreadyPaid) {
      alert(`✅ Payment verified! Invoice ${result.invoice.reference} is now PAID.`);
    } else {
      alert(`⏳ Payment not yet completed.\nStatus: ${result.sessionStatus || 'unknown'}\n${result.message}`);
    }

    await refreshAdminTransactions();
    await refreshSalesReport(activeSalesRange);
  } catch (error) {
    alert(`❌ Verification failed: ${error.message}`);
    await refreshAdminTransactions();
  }
}

async function verifyAllPending() {
  try {
    adminVerifyAllBtn.textContent = 'Verifying...';
    adminVerifyAllBtn.disabled = true;

    const filterStatus = adminFilterEl.value;
    const range = adminRangeEl.value;

    let url = '/api/admin/transactions?status=PENDING&';
    if (range) url += `range=${encodeURIComponent(range)}&`;

    const { transactions } = await api(url);
    const gcashPending = transactions.filter((t) => t.paymentMethod === 'gcash');

    if (!gcashPending.length) {
      alert('No pending GCash transactions to verify.');
      adminVerifyAllBtn.textContent = 'Verify All Pending';
      adminVerifyAllBtn.disabled = false;
      return;
    }

    let verified = 0;
    let failed = 0;

    for (const t of gcashPending) {
      try {
        const result = await api(`/api/payments/gcash/verify/${t.id}`, { method: 'POST' });
        if (result.verified || result.alreadyPaid) {
          verified++;
        }
      } catch (err) {
        failed++;
      }
    }

    alert(`Verification complete!\n✅ Verified: ${verified}\n⏳ Still pending: ${gcashPending.length - verified - failed}\n❌ Errors: ${failed}`);

    await refreshAdminTransactions();
    await refreshSalesReport(activeSalesRange);
  } catch (error) {
    alert(`Verification error: ${error.message}`);
  } finally {
    adminVerifyAllBtn.textContent = 'Verify All Pending';
    adminVerifyAllBtn.disabled = false;
  }
}

// ══════════════════════════════════════════
// Event Listeners & Init
// ══════════════════════════════════════════

function setupEventListeners() {
  // Tab navigation
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  // POS events
  productsEl.addEventListener('click', onProductClick);
  cartEl.addEventListener('click', onProductClick);
  paymentMethodEl.addEventListener('change', onPaymentMethodChange);
  checkoutBtn.addEventListener('click', handleCheckout);
  clearBtn.addEventListener('click', () => {
    resetAfterSale();
    setStatus('Cleared. Ready.');
  });
  salesDailyBtn.addEventListener('click', () => refreshSalesReport('daily'));
  salesWeeklyBtn.addEventListener('click', () => refreshSalesReport('weekly'));
  salesRefreshBtn.addEventListener('click', () => refreshSalesReport(activeSalesRange));

  // Admin events
  adminRefreshBtn.addEventListener('click', refreshAdminTransactions);
  adminVerifyAllBtn.addEventListener('click', verifyAllPending);
  adminFilterEl.addEventListener('change', refreshAdminTransactions);
  adminRangeEl.addEventListener('change', refreshAdminTransactions);

  // Delegate verify button clicks in admin transactions list
  adminTransactionsEl.addEventListener('click', (e) => {
    const verifyId = e.target.getAttribute('data-verify');
    if (verifyId) {
      verifyPayment(verifyId);
    }
  });
}

async function init() {
  const [{ products }] = await Promise.all([api('/api/products'), api('/api/config')]);
  state.products = products;
  renderProducts();
  renderCart();

  setupEventListeners();
  onPaymentMethodChange();
  await refreshSalesReport('daily');
}

init().catch((error) => {
  setStatus(`Startup error: ${error.message}`);
});
