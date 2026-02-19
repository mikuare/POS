const state = {
  products: [],
  cart: {},
  activeInvoice: null,
  poller: null,
  activeCategory: 'main-dish',
  orderType: null,
  cashPromptActive: false,
  discountAmount: 0,
};

// -- POS Tab Elements --
const productsEl = document.getElementById('products');
const cartEl = document.getElementById('cart');
const addToCartConfettiEl = document.getElementById('addToCartConfetti');
const yummyOrderEmojiEl = document.getElementById('yummyOrderEmoji');
const subtotalValueEl = document.getElementById('subtotalValue');
const discountInputEl = document.getElementById('discountInput');
const totalDueValueEl = document.getElementById('totalDueValue');
const statusEl = document.getElementById('status');
const paymentMethodEl = document.getElementById('paymentMethod');
const amountTenderedEl = document.getElementById('amountTendered');
const cashPayBtn = document.getElementById('cashPayBtn');
const clearBtn = document.getElementById('clearBtn');
const dineInCheckoutBtn = document.getElementById('dineInCheckoutBtn');
const takeOutCheckoutBtn = document.getElementById('takeOutCheckoutBtn');
const cashPaymentBtn = document.getElementById('cashPaymentBtn');
const ePaymentBtn = document.getElementById('ePaymentBtn');
const cashRowEl = document.getElementById('cashRow');
const gcashInfoEl = document.getElementById('gcashInfo');
const salesSummaryEl = document.getElementById('salesSummary');
const salesListEl = document.getElementById('salesList');
const salesDailyBtn = document.getElementById('salesDailyBtn');
const salesWeeklyBtn = document.getElementById('salesWeeklyBtn');
const salesRefreshBtn = document.getElementById('salesRefreshBtn');
const categoryTitleEl = document.getElementById('categoryTitle');
const paymentSuccessModalEl = document.getElementById('paymentSuccessModal');
const receiptRefEl = document.getElementById('receiptRef');
const receiptDateEl = document.getElementById('receiptDate');
const receiptOrderTypeEl = document.getElementById('receiptOrderType');
const receiptPaymentMethodEl = document.getElementById('receiptPaymentMethod');
const receiptItemsEl = document.getElementById('receiptItems');
const receiptSubtotalEl = document.getElementById('receiptSubtotal');
const receiptDiscountEl = document.getElementById('receiptDiscount');
const receiptTotalDueEl = document.getElementById('receiptTotalDue');
const receiptAmountPaidEl = document.getElementById('receiptAmountPaid');
const receiptChangeEl = document.getElementById('receiptChange');
const receiptPrintBtn = document.getElementById('receiptPrintBtn');
const receiptPrintAreaEl = document.getElementById('receiptPrintArea');
const paymentSuccessDoneBtn = document.getElementById('paymentSuccessDoneBtn');
const adminReceiptModalEl = document.getElementById('adminReceiptModal');
const adminReceiptPrintAreaEl = document.getElementById('adminReceiptPrintArea');
const adminReceiptRefEl = document.getElementById('adminReceiptRef');
const adminReceiptDateEl = document.getElementById('adminReceiptDate');
const adminReceiptOrderTypeEl = document.getElementById('adminReceiptOrderType');
const adminReceiptPaymentMethodEl = document.getElementById('adminReceiptPaymentMethod');
const adminReceiptItemsEl = document.getElementById('adminReceiptItems');
const adminReceiptSubtotalEl = document.getElementById('adminReceiptSubtotal');
const adminReceiptDiscountEl = document.getElementById('adminReceiptDiscount');
const adminReceiptTotalDueEl = document.getElementById('adminReceiptTotalDue');
const adminReceiptAmountPaidEl = document.getElementById('adminReceiptAmountPaid');
const adminReceiptChangeEl = document.getElementById('adminReceiptChange');
const adminReceiptPrintBtn = document.getElementById('adminReceiptPrintBtn');
const adminReceiptCloseBtn = document.getElementById('adminReceiptCloseBtn');
const eWalletModalEl = document.getElementById('eWalletModal');
const chooseGcashBtn = document.getElementById('chooseGcashBtn');
const choosePaymayaBtn = document.getElementById('choosePaymayaBtn');
const cancelEwalletBtn = document.getElementById('cancelEwalletBtn');

// -- Customer Info Elements --
const customerNameEl = document.getElementById('customerName');
const customerEmailEl = document.getElementById('customerEmail');
const customerPhoneEl = document.getElementById('customerPhone');

// -- Admin Tab Elements --
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
const adminLoginModalEl = document.getElementById('adminLoginModal');
const adminUsernameEl = document.getElementById('adminUsername');
const adminPasswordEl = document.getElementById('adminPassword');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminCancelBtn = document.getElementById('adminCancelBtn');
const adminLoginErrorEl = document.getElementById('adminLoginError');
const adminCloseBtn = document.getElementById('adminCloseBtn');

// -- Tab Elements --
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let activeSalesRange = 'daily';
const ADMIN_DEFAULT_USERNAME = 'admin';
const ADMIN_DEFAULT_PASSWORD = 'P@ssw0rd';
let confettiAnimation = null;
let yummyOrderAnimation = null;

// ------------------------------------------
// Utility Functions
// ------------------------------------------

function money(value) {
  return `PHP ${Number(value).toFixed(2)}`;
}

function getPaymentMethodLabel(method) {
  const map = {
    cash: 'Cash',
    gcash: 'GCash',
    paymaya: 'PayMaya'
  };
  return map[String(method || '').toLowerCase()] || String(method || '').toUpperCase();
}

function getPaymentMethodIcon(method) {
  const normalized = String(method || '').toLowerCase();
  if (normalized === 'cash') return '/Other/Cash.png';
  if (normalized === 'paymaya') return '/Other/Maya.png';
  return '/Other/GCash.png';
}

function setStatus(text) {
  statusEl.textContent = text;
}

function ensureConfettiAnimation() {
  if (confettiAnimation || !addToCartConfettiEl || !window.lottie) {
    return;
  }

  confettiAnimation = window.lottie.loadAnimation({
    container: addToCartConfettiEl,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/assets/confetti'
  });
}

function loadYummyEmoji(container) {
  if (!container || !window.lottie) return null;
  return window.lottie.loadAnimation({
    container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '/assets/yummy'
  });
}

function ensureYummyAnimations() {
  if (!yummyOrderAnimation) {
    yummyOrderAnimation = loadYummyEmoji(yummyOrderEmojiEl);
  }
}

function playAddToCartConfetti() {
  ensureConfettiAnimation();
  if (!confettiAnimation) return;
  confettiAnimation.stop();
  confettiAnimation.goToAndPlay(0, true);
}

function setOrderType(type) {
  state.orderType = type;
  state.cashPromptActive = false;
  if (cashPaymentBtn) cashPaymentBtn.disabled = false;
  if (ePaymentBtn) ePaymentBtn.disabled = false;
  if (amountTenderedEl) amountTenderedEl.value = '';
  setPaymentMethod('cash');
  setStatus(`${getOrderTypeLabel(type)} selected. Choose Cash or E-Payment.`);
}

function getOrderTypeLabel(type) {
  return type === 'take-out' ? 'Take Out' : 'Dine In';
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

function getDiscountAmount() {
  const subtotal = getCartTotal();
  const discount = Number(state.discountAmount || 0);
  if (!Number.isFinite(discount) || discount <= 0) return 0;
  return Math.min(discount, subtotal);
}

function getTotalDue() {
  const subtotal = getCartTotal();
  return Math.max(0, subtotal - getDiscountAmount());
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

// ------------------------------------------
// Tab Navigation
// ------------------------------------------

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

function openAdminLogin() {
  if (!adminLoginModalEl) return;
  document.body.classList.add('admin-login-open');
  if (adminUsernameEl) adminUsernameEl.value = ADMIN_DEFAULT_USERNAME;
  if (adminPasswordEl) adminPasswordEl.value = ADMIN_DEFAULT_PASSWORD;
  if (adminLoginErrorEl) adminLoginErrorEl.textContent = '';
  if (adminUsernameEl) adminUsernameEl.focus();
}

function closeAdminLogin() {
  document.body.classList.remove('admin-login-open');
}

async function openAdminDashboard() {
  document.body.classList.add('admin-open');
  await refreshAdminTransactions();
  await refreshSalesReport(activeSalesRange);
}

function closeAdminDashboard() {
  document.body.classList.remove('admin-open');
}

async function submitAdminLogin() {
  const username = (adminUsernameEl?.value || '').trim();
  const password = adminPasswordEl?.value || '';

  if (username !== ADMIN_DEFAULT_USERNAME || password !== ADMIN_DEFAULT_PASSWORD) {
    if (adminLoginErrorEl) adminLoginErrorEl.textContent = 'Invalid username or password.';
    return;
  }

  closeAdminLogin();
  await openAdminDashboard();
}

// ------------------------------------------
// POS Terminal Functions
// ------------------------------------------

function getCategoryName(category) {
  const categoryNames = {
    'main-dish': 'Main Dish',
    'rice': 'Rice',
    'burger': 'Burger',
    'drinks': 'Drinks',
    'fries': 'Fries',
    'dessert': 'Dessert',
    'sauces': 'Sauces'
  };
  return categoryNames[category] || category;
}

function renderProducts() {
  productsEl.innerHTML = '';
  
  // Filter products by active category
  const filteredProducts = state.products.filter(
    (p) => (p.category || '').toLowerCase() === state.activeCategory
  );

  if (filteredProducts.length === 0) {
    productsEl.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No products in this category.</p>';
    return;
  }

  filteredProducts.forEach((p) => {
    const row = document.createElement('div');
    row.className = 'product-row';
    row.innerHTML = `
      <img class="product-image" src="${p.image || '/Business Logo/Ruels Logo for business.png'}" alt="${p.name}" />
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${money(p.price)}</div>
      </div>
      <button data-add="${p.id}">Add to Order</button>
    `;
    productsEl.appendChild(row);
  });
}

function setPaymentMethod(method) {
  paymentMethodEl.value = method;
  onPaymentMethodChange();
  cashPaymentBtn?.classList.toggle('active', method === 'cash');
  ePaymentBtn?.classList.toggle('active', method !== 'cash');
}

function switchCategory(category) {
  state.activeCategory = category;
  
  // Update active state on category buttons
  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });
  
  // Update category title
  categoryTitleEl.textContent = getCategoryName(category);
  
  // Re-render products
  renderProducts();
}

function renderCart() {
  cartEl.innerHTML = '';

  const items = getCartItems();
  if (!items.length) {
    cartEl.innerHTML = '<p>No Orders Yet</p>'; 
  } else {
    const byId = Object.fromEntries(state.products.map((p) => [p.id, p]));
    items.forEach(({ productId, qty }) => {
      const p = byId[productId];
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div class="cart-item-name">${p.name} x ${qty}</div>
        <div class="cart-item-price">
          ${money(p.price * qty)}
          <button class="secondary" data-remove="${p.id}">-1</button>
        </div>
      `;
      cartEl.appendChild(row);
    });
  }

  const subtotal = getCartTotal();
  const discount = getDiscountAmount();
  const totalDue = getTotalDue();
  if (subtotalValueEl) subtotalValueEl.textContent = money(subtotal);
  if (totalDueValueEl) totalDueValueEl.textContent = money(totalDue);
  if (discountInputEl) {
    discountInputEl.value = discount ? discount.toFixed(2) : '0';
  }
}

function onProductClick(e) {
  const addId = e.target.getAttribute('data-add');
  const removeId = e.target.getAttribute('data-remove');

  if (addId) {
    state.cart[addId] = (state.cart[addId] || 0) + 1;
    renderCart();
    playAddToCartConfetti();
  }

  if (removeId) {
    state.cart[removeId] = Math.max(0, (state.cart[removeId] || 0) - 1);
    renderCart();
  }
}

function resetAfterSale() {
  state.cart = {};
  state.activeInvoice = null;
  state.discountAmount = 0;
  gcashInfoEl.innerHTML = '';
  if (state.poller) {
    clearInterval(state.poller);
    state.poller = null;
  }
  // Clear customer info fields
  if (customerNameEl) customerNameEl.value = '';
  if (customerEmailEl) customerEmailEl.value = '';
  if (customerPhoneEl) customerPhoneEl.value = '';
  if (discountInputEl) discountInputEl.value = '0';
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
      `Order: ${getOrderTypeLabel(state.orderType)}`,
      `Payment: ${getPaymentMethodLabel(invoice.paymentMethod)}`,
      `Result: ${successText}`,
      '',
      lines,
      '',
      `Subtotal: ${money(invoice.subtotal ?? invoice.total)}`,
      `Discount: ${money(invoice.discount || 0)}`,
      `Total Due: ${money(invoice.total)}`,
      `Paid: ${money(invoice.payment.amountPaid)}`,
      `Change: ${money(invoice.payment.change || 0)}`,
      invoice.paymentMethod !== 'cash' ? `Recipient ${getPaymentMethodLabel(invoice.paymentMethod)}: ${invoice.payment.recipientGcashNumber || 'via PayMongo'}` : '',
      `Paid At: ${invoice.payment.paidAt}`
    ].filter(Boolean).join('\n')
  );
}

function renderPaymentReceiptModal(invoice) {
  const orderLabel = getOrderTypeLabel(state.orderType);
  const paymentLabel = getPaymentMethodLabel(invoice.paymentMethod);
  const paidAt = invoice?.payment?.paidAt || new Date().toISOString();
  const itemRows = (invoice.lineItems || [])
    .map((item) => `
      <div class="receipt-item-row">
        <span>${escapeHtml(item.name)} x ${item.qty}</span>
        <strong>${money(item.subtotal)}</strong>
      </div>
    `)
    .join('');

  if (receiptRefEl) receiptRefEl.textContent = invoice.reference;
  if (receiptDateEl) receiptDateEl.textContent = formatDate(paidAt);
  if (receiptOrderTypeEl) receiptOrderTypeEl.textContent = orderLabel;
  if (receiptPaymentMethodEl) receiptPaymentMethodEl.textContent = paymentLabel;
  if (receiptItemsEl) receiptItemsEl.innerHTML = itemRows;
  if (receiptSubtotalEl) receiptSubtotalEl.textContent = money(invoice.subtotal ?? invoice.total);
  if (receiptDiscountEl) receiptDiscountEl.textContent = money(invoice.discount || 0);
  if (receiptTotalDueEl) receiptTotalDueEl.textContent = money(invoice.total || 0);
  if (receiptAmountPaidEl) receiptAmountPaidEl.textContent = money(invoice?.payment?.amountPaid || invoice.total || 0);
  if (receiptChangeEl) receiptChangeEl.textContent = money(invoice?.payment?.change || 0);
}

function renderAdminReceiptModal(invoice) {
  const paidAt = invoice?.payment?.paidAt || invoice?.updatedAt || invoice?.createdAt || new Date().toISOString();
  const orderLabel = invoice?.orderType ? getOrderTypeLabel(invoice.orderType) : 'N/A';
  const paymentLabel = getPaymentMethodLabel(invoice.paymentMethod);
  const itemRows = (invoice.lineItems || [])
    .map((item) => `
      <div class="receipt-item-row">
        <span>${escapeHtml(item.name)} x ${item.qty}</span>
        <strong>${money(item.subtotal)}</strong>
      </div>
    `)
    .join('');

  if (adminReceiptRefEl) adminReceiptRefEl.textContent = invoice.reference || '-';
  if (adminReceiptDateEl) adminReceiptDateEl.textContent = formatDate(paidAt);
  if (adminReceiptOrderTypeEl) adminReceiptOrderTypeEl.textContent = orderLabel;
  if (adminReceiptPaymentMethodEl) adminReceiptPaymentMethodEl.textContent = paymentLabel;
  if (adminReceiptItemsEl) adminReceiptItemsEl.innerHTML = itemRows || '<div class="receipt-item-row"><span>No items found</span><strong>-</strong></div>';
  if (adminReceiptSubtotalEl) adminReceiptSubtotalEl.textContent = money(invoice.subtotal ?? invoice.total ?? 0);
  if (adminReceiptDiscountEl) adminReceiptDiscountEl.textContent = money(invoice.discount || 0);
  if (adminReceiptTotalDueEl) adminReceiptTotalDueEl.textContent = money(invoice.total || 0);
  if (adminReceiptAmountPaidEl) adminReceiptAmountPaidEl.textContent = money(invoice?.payment?.amountPaid || invoice.total || 0);
  if (adminReceiptChangeEl) adminReceiptChangeEl.textContent = money(invoice?.payment?.change || 0);
}

function finalizeSuccessfulPayment(invoice, modeLabel) {
  renderPaymentReceiptModal(invoice, modeLabel);
  if (paymentSuccessModalEl) paymentSuccessModalEl.classList.add('open');
}

function closePaymentSuccessModal() {
  if (paymentSuccessModalEl) paymentSuccessModalEl.classList.remove('open');
  resetAfterSale();
  state.cashPromptActive = false;
  if (amountTenderedEl) amountTenderedEl.value = '';
  setStatus('Payment completed. Ready for next order.');
}

function printReceiptContent(printAreaEl) {
  if (!printAreaEl) return;
  const printWindow = window.open('', '_blank', 'width=420,height=780');
  if (!printWindow) {
    setStatus('Pop-up blocked. Please allow pop-ups to print receipt.');
    return;
  }

  const receiptHtml = printAreaEl.innerHTML;
  const printStyles = `
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 8px; color: #2d1b12; }
      .receipt-print-area { width: 80mm; margin: 0 auto; }
      .receipt-header { text-align: center; border-bottom: 1px dashed #c8a88f; padding-bottom: 10px; margin-bottom: 10px; }
      .receipt-logo { width: 110px; height: auto; object-fit: contain; margin-bottom: 6px; }
      .receipt-header h3 { margin: 0; font-size: 24px; font-weight: 800; }
      .receipt-header p { margin: 2px 0; font-size: 12px; }
      .receipt-meta { display: grid; gap: 4px; margin-bottom: 10px; font-size: 12px; }
      .receipt-meta div { display: flex; justify-content: space-between; border-bottom: 1px dotted #e6d3c3; padding-bottom: 2px; }
      .receipt-items { border-top: 1px dashed #c8a88f; border-bottom: 1px dashed #c8a88f; padding: 8px 0; margin: 10px 0; }
      .receipt-item-row { display: flex; justify-content: space-between; font-size: 13px; margin: 4px 0; gap: 8px; }
      .receipt-item-row strong { white-space: nowrap; }
      .receipt-totals { display: grid; gap: 4px; }
      .receipt-totals div { display: flex; justify-content: space-between; font-size: 13px; }
      .receipt-totals .total-due { margin-top: 4px; padding-top: 6px; border-top: 1px solid #cfb29b; font-size: 16px; font-weight: 800; }
      .receipt-footer { margin-top: 12px; text-align: center; font-size: 12px; font-weight: 700; }
    </style>
  `;

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head><meta charset="utf-8" /><title>Receipt</title>${printStyles}</head>
      <body><div class="receipt-print-area">${receiptHtml}</div></body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    setTimeout(() => printWindow.close(), 200);
  }, 120);
}

function printReceiptFromModal() {
  printReceiptContent(receiptPrintAreaEl);
}

function printAdminReceiptFromModal() {
  printReceiptContent(adminReceiptPrintAreaEl);
}

function openAdminReceiptModal() {
  if (adminReceiptModalEl) adminReceiptModalEl.classList.add('open');
}

function closeAdminReceiptModal() {
  if (adminReceiptModalEl) adminReceiptModalEl.classList.remove('open');
}

function openEwalletModal() {
  if (!eWalletModalEl) return;
  eWalletModalEl.classList.add('open');
}

function closeEwalletModal() {
  if (!eWalletModalEl) return;
  eWalletModalEl.classList.remove('open');
}

function renderSalesReport(report) {
  salesSummaryEl.textContent = [
    `Range: ${report.range.label.toUpperCase()}`,
    `Total Sales: ${money(report.totalSales)}`,
    `Transactions: ${report.totalTransactions}`,
    `Average Ticket: ${money(report.averageTicket)}`,
    `Cash: ${money(report.byMethod?.cash || 0)}`,
    `E-Wallet: ${money((report.byMethod?.gcash || 0) + (report.byMethod?.paymaya || 0))}`
  ].join('\n');

  const rows = (report.transactions || []).slice(0, 10);
  if (!rows.length) {
    salesListEl.innerHTML = '<p>No sales found for this range.</p>';
    return;
  }

  salesListEl.innerHTML = rows
    .map(
      (x) => `
      <div class="sales-row sales-row-clickable" data-receipt="${x.invoiceId || ''}">
        <span class="sales-ref">${x.reference}</span>
        <span class="method-chip">
          <img class="payment-method-icon" src="${getPaymentMethodIcon(x.method)}" alt="${getPaymentMethodLabel(x.method)}" />
          ${getPaymentMethodLabel(x.method)}
        </span>
        <span class="sales-amount">${money(x.amountPaid)}</span>
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
          const verifyResult = await api(`/api/payments/ewallet/verify/${invoiceId}`, {
            method: 'POST'
          });
          if (verifyResult.verified || verifyResult.alreadyPaid) {
            clearInterval(state.poller);
            state.poller = null;
            const inv = verifyResult.invoice;
            renderReceipt(inv);
            await refreshSalesReport(activeSalesRange);
            finalizeSuccessfulPayment(inv, 'E-Payment');
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
        finalizeSuccessfulPayment(invoice, 'E-Payment');
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
    const discountAmount = getDiscountAmount();

    const { invoice } = await api('/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ items, paymentMethod, discountAmount })
    });

    state.activeInvoice = invoice;

    if (paymentMethod === 'cash') {
      const tendered = Number(amountTenderedEl?.value || 0);
      if (tendered <= 0) {
        setStatus('Enter customer cash tendered amount.');
        if (amountTenderedEl) amountTenderedEl.focus();
        return;
      }
      const paid = await api('/api/payments/cash', {
        method: 'POST',
        body: JSON.stringify({ invoiceId: invoice.id, amountTendered: tendered })
      });
      renderReceipt(paid.invoice);
      await refreshSalesReport(activeSalesRange);
      finalizeSuccessfulPayment(paid.invoice, 'Cash');
      return;
    }

    // Collect customer info from the form
    const customerInfo = {};
    const cName = (customerNameEl?.value || '').trim();
    const cEmail = (customerEmailEl?.value || '').trim();
    const cPhone = (customerPhoneEl?.value || '').trim();
    if (cName) customerInfo.name = cName;
    if (cEmail) customerInfo.email = cEmail;
    if (cPhone) customerInfo.phone = cPhone;

    const eWalletMethod = String(paymentMethod).toLowerCase();
    const eWalletLabel = getPaymentMethodLabel(eWalletMethod);
    const { checkout } = await api('/api/payments/ewallet/checkout', {
      method: 'POST',
      body: JSON.stringify({ invoiceId: invoice.id, customerInfo })
    });

    const qrMarkup = checkout.qrDataUrl
      ? `<img class="qr" alt="GCash QR" src="${checkout.qrDataUrl}" />`
      : '<div>No direct QR in POS for this provider. Continue in hosted checkout.</div>';

    gcashInfoEl.innerHTML = `
      <h3>${eWalletLabel} Checkout</h3>
      <div>Gateway: <strong>${String(checkout.provider || '').toUpperCase()}</strong></div>
      <div>Method: <strong>${eWalletLabel}</strong></div>
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
    setStatus(`${eWalletLabel} checkout created via ${String(checkout.provider || '').toUpperCase()}. Waiting for payment...\nReference: ${checkout.reference}\n\nPayment will be auto-verified every 10 seconds.`);

    await pollInvoice(invoice.id);
  } catch (error) {
    setStatus(`Checkout error: ${error.message}`);
  }
}

function onPaymentMethodChange() {
  const isCash = paymentMethodEl.value === 'cash';
  if (cashRowEl) {
    cashRowEl.style.display = (isCash && state.cashPromptActive) ? 'flex' : 'none';
  }
}

// ------------------------------------------
// Admin / Transactions Functions
// ------------------------------------------

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
    .filter((t) => t.paymentMethod === 'gcash' || t.paymentMethod === 'paymaya')
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
    const methodClass = t.paymentMethod === 'cash' ? 'badge-cash' : 'badge-gcash';

    const verifyBtn = (t.status === 'PENDING' && t.paymentMethod !== 'cash')
      ? `<button class="verify-btn small" data-verify="${t.id}">Verify</button>`
      : '';
    const receiptBtn = (t.status === 'PAID')
      ? `<button class="secondary small" data-receipt="${t.id}">Receipt</button>`
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
            ${name ? `<div class="txn-customer-field"><span class="field-icon">??</span> ${escapeHtml(name)}</div>` : ''}
            ${email ? `<div class="txn-customer-field"><span class="field-icon">??</span> ${escapeHtml(email)}</div>` : ''}
            ${phone ? `<div class="txn-customer-field"><span class="field-icon">??</span> ${escapeHtml(phone)}</div>` : ''}
          </div>
        `;
      }
    }

    return `
      <div class="txn-row">
        <div class="txn-main">
          <button class="txn-ref receipt-link" data-receipt="${t.id}">${t.reference}</button>
          <div class="txn-badges">
            <span class="badge ${statusClass}">${t.status}</span>
            <span class="badge ${methodClass} method-badge">
              <img class="payment-method-icon" src="${getPaymentMethodIcon(t.paymentMethod)}" alt="${getPaymentMethodLabel(t.paymentMethod)}" />
              ${getPaymentMethodLabel(t.paymentMethod)}
            </span>
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
          ${receiptBtn}
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

    const result = await api(`/api/payments/ewallet/verify/${invoiceId}`, {
      method: 'POST'
    });

    if (result.verified || result.alreadyPaid) {
      alert(`? Payment verified! Invoice ${result.invoice.reference} is now PAID.`);
    } else {
      alert(`? Payment not yet completed.\nStatus: ${result.sessionStatus || 'unknown'}\n${result.message}`);
    }

    await refreshAdminTransactions();
    await refreshSalesReport(activeSalesRange);
  } catch (error) {
    alert(`? Verification failed: ${error.message}`);
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
    const gcashPending = transactions.filter((t) => t.paymentMethod !== 'cash');

    if (!gcashPending.length) {
      alert('No pending E-Payment transactions to verify.');
      adminVerifyAllBtn.textContent = 'Verify All Pending';
      adminVerifyAllBtn.disabled = false;
      return;
    }

    let verified = 0;
    let failed = 0;

    for (const t of gcashPending) {
      try {
        const result = await api(`/api/payments/ewallet/verify/${t.id}`, { method: 'POST' });
        if (result.verified || result.alreadyPaid) {
          verified++;
        }
      } catch (err) {
        failed++;
      }
    }

    alert(`Verification complete!\n? Verified: ${verified}\n? Still pending: ${gcashPending.length - verified - failed}\n? Errors: ${failed}`);

    await refreshAdminTransactions();
    await refreshSalesReport(activeSalesRange);
  } catch (error) {
    alert(`Verification error: ${error.message}`);
  } finally {
    adminVerifyAllBtn.textContent = 'Verify All Pending';
    adminVerifyAllBtn.disabled = false;
  }
}

async function viewReceipt(invoiceId) {
  try {
    const { invoice } = await api(`/api/invoices/${invoiceId}`);
    if (!invoice) {
      alert('Receipt not found.');
      return;
    }
    renderAdminReceiptModal(invoice);
    openAdminReceiptModal();
  } catch (error) {
    alert(`Unable to load receipt: ${error.message}`);
  }
}

// ------------------------------------------
// Event Listeners & Init
// ------------------------------------------

function setupEventListeners() {
  // Tab navigation
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  // Category buttons
  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      switchCategory(category);
    });
  });

  // POS events
  productsEl.addEventListener('click', onProductClick);
  cartEl.addEventListener('click', onProductClick);
  paymentMethodEl.addEventListener('change', onPaymentMethodChange);
  if (dineInCheckoutBtn) {
    dineInCheckoutBtn.addEventListener('click', () => {
      setOrderType('dine-in');
    });
  }
  if (takeOutCheckoutBtn) {
    takeOutCheckoutBtn.addEventListener('click', () => {
      setOrderType('take-out');
    });
  }
  if (cashPaymentBtn) {
    cashPaymentBtn.addEventListener('click', () => {
      if (!state.orderType) {
        setStatus('Select order type first: Dine In or Take Out.');
        return;
      }
      state.cashPromptActive = true;
      setPaymentMethod('cash');
      setStatus('Enter cash tendered amount, then click Pay.');
      if (amountTenderedEl) amountTenderedEl.focus();
    });
  }
  if (cashPayBtn) {
    cashPayBtn.addEventListener('click', async () => {
      if (!state.orderType) {
        setStatus('Select order type first: Dine In or Take Out.');
        return;
      }
      if (!amountTenderedEl?.value) {
        setStatus('Enter customer cash tendered amount.');
        if (amountTenderedEl) amountTenderedEl.focus();
        return;
      }
      setPaymentMethod('cash');
      await handleCheckout();
    });
  }
  if (ePaymentBtn) {
    ePaymentBtn.addEventListener('click', async () => {
      if (!state.orderType) {
        setStatus('Select order type first: Dine In or Take Out.');
        return;
      }
      if (!getCartItems().length) {
        setStatus('Add at least one item first.');
        return;
      }
      openEwalletModal();
    });
  }
  if (chooseGcashBtn) {
    chooseGcashBtn.addEventListener('click', async () => {
      closeEwalletModal();
      setPaymentMethod('gcash');
      await handleCheckout();
    });
  }
  if (choosePaymayaBtn) {
    choosePaymayaBtn.addEventListener('click', async () => {
      closeEwalletModal();
      setPaymentMethod('paymaya');
      await handleCheckout();
    });
  }
  if (cancelEwalletBtn) {
    cancelEwalletBtn.addEventListener('click', closeEwalletModal);
  }
  if (discountInputEl) {
    discountInputEl.addEventListener('input', () => {
      const raw = Number(discountInputEl.value || 0);
      const subtotal = getCartTotal();
      if (!Number.isFinite(raw) || raw <= 0) {
        state.discountAmount = 0;
      } else {
        state.discountAmount = Math.min(raw, subtotal);
      }
      renderCart();
    });
  }
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
  salesListEl.addEventListener('click', (e) => {
    const receiptId = e.target.closest('[data-receipt]')?.getAttribute('data-receipt');
    if (receiptId) {
      viewReceipt(receiptId);
    }
  });

  // Delegate verify button clicks in admin transactions list
  adminTransactionsEl.addEventListener('click', (e) => {
    const verifyId = e.target.closest('[data-verify]')?.getAttribute('data-verify');
    if (verifyId) {
      verifyPayment(verifyId);
      return;
    }
    const receiptId = e.target.closest('[data-receipt]')?.getAttribute('data-receipt');
    if (receiptId) {
      viewReceipt(receiptId);
    }
  });

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
      submitAdminLogin();
    });
  }

  if (adminCancelBtn) {
    adminCancelBtn.addEventListener('click', closeAdminLogin);
  }

  if (adminCloseBtn) {
    adminCloseBtn.addEventListener('click', closeAdminDashboard);
  }

  if (paymentSuccessDoneBtn) {
    paymentSuccessDoneBtn.addEventListener('click', closePaymentSuccessModal);
  }
  if (receiptPrintBtn) {
    receiptPrintBtn.addEventListener('click', printReceiptFromModal);
  }
  if (adminReceiptPrintBtn) {
    adminReceiptPrintBtn.addEventListener('click', printAdminReceiptFromModal);
  }
  if (adminReceiptCloseBtn) {
    adminReceiptCloseBtn.addEventListener('click', closeAdminReceiptModal);
  }

  if (adminPasswordEl) {
    adminPasswordEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitAdminLogin();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      openAdminLogin();
      return;
    }

    if (e.key === 'Escape') {
      closeEwalletModal();
      if (paymentSuccessModalEl?.classList.contains('open')) {
        closePaymentSuccessModal();
      }
      closeAdminReceiptModal();
      closeAdminLogin();
      closeAdminDashboard();
    }
  });
}

async function init() {
  const [{ products }] = await Promise.all([api('/api/products'), api('/api/config')]);
  state.products = products;
  ensureConfettiAnimation();
  ensureYummyAnimations();
  renderProducts();
  renderCart();

  setupEventListeners();
  if (cashPaymentBtn) cashPaymentBtn.disabled = true;
  if (ePaymentBtn) ePaymentBtn.disabled = true;
  setPaymentMethod('cash');
  setStatus('Select order type first: Dine In or Take Out.');
  await refreshSalesReport('daily');
}

init().catch((error) => {
  setStatus(`Startup error: ${error.message}`);
});








