const state = {
  products: [],
  cart: {},
  activeInvoice: null,
  poller: null,
};

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

let activeSalesRange = 'daily';

function money(value) {
  return `PHP ${Number(value).toFixed(2)}`;
}

function setStatus(text) {
  statusEl.textContent = text;
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

  state.poller = setInterval(async () => {
    try {
      const { invoice } = await api(`/api/invoices/${invoiceId}`);
      if (invoice.status === 'PAID') {
        clearInterval(state.poller);
        state.poller = null;
        renderReceipt(invoice);
        await refreshSalesReport(activeSalesRange);
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
    setStatus(`GCash checkout created via ${String(checkout.provider || '').toUpperCase()}. Waiting for payment webhook...\nReference: ${checkout.reference}`);

    await pollInvoice(invoice.id);
  } catch (error) {
    setStatus(`Checkout error: ${error.message}`);
  }
}

function onPaymentMethodChange() {
  cashRowEl.style.display = paymentMethodEl.value === 'cash' ? 'flex' : 'none';
}

async function init() {
  const [{ products }] = await Promise.all([api('/api/products'), api('/api/config')]);
  state.products = products;
  renderProducts();
  renderCart();

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

  onPaymentMethodChange();
  await refreshSalesReport('daily');
}

init().catch((error) => {
  setStatus(`Startup error: ${error.message}`);
});

