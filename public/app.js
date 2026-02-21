const state = {
  products: [],
  cart: {},
  activeInvoice: null,
  lastPaidInvoice: null,
  scanQrContext: null,
  poller: null,
  activeCategory: 'main-dish',
  orderType: null,
  cashPromptActive: false,
  discountAmount: 0,
  productsRendered: false,
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
const statusReceiptActionsEl = document.getElementById('statusReceiptActions');
const statusPrintReceiptBtn = document.getElementById('statusPrintReceiptBtn');
const salesSummaryEl = document.getElementById('salesSummary');
const salesListEl = document.getElementById('salesList');
const detailDailySalesEl = document.getElementById('detailDailySales');
const detailDailyMetaEl = document.getElementById('detailDailyMeta');
const detailMonthlySalesEl = document.getElementById('detailMonthlySales');
const detailMonthlyMetaEl = document.getElementById('detailMonthlyMeta');
const topProductsListEl = document.getElementById('topProductsList');
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
const receiptMinimizeBtn = document.getElementById('receiptMinimizeBtn');
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
const chooseScanQrBtn = document.getElementById('chooseScanQrBtn');
const cancelEwalletBtn = document.getElementById('cancelEwalletBtn');
const scanQrModalEl = document.getElementById('scanQrModal');
const scanQrContentEl = document.getElementById('scanQrContent');
const scanQrFinishBtn = document.getElementById('scanQrFinishBtn');
const scanQrCancelBtn = document.getElementById('scanQrCancelBtn');
const authGateEl = document.getElementById('authGate');
const showLoginBtn = document.getElementById('showLoginBtn');
const showSignupBtn = document.getElementById('showSignupBtn');
const loginFormEl = document.getElementById('loginForm');
const signupFormEl = document.getElementById('signupForm');
const loginEmailEl = document.getElementById('loginEmail');
const loginPasswordEl = document.getElementById('loginPassword');
const signupNameEl = document.getElementById('signupName');
const signupEmailEl = document.getElementById('signupEmail');
const signupRoleEl = document.getElementById('signupRole');
const signupPasswordEl = document.getElementById('signupPassword');
const authMessageEl = document.getElementById('authMessage');
const authLogoVideoEl = document.getElementById('authLogoVideo');
const authLogoCanvasEl = document.getElementById('authLogoCanvas');
const welcomeBannerEl = document.getElementById('welcomeBanner');
const settingsToggleBtn = document.getElementById('settingsToggleBtn');
const settingsMenuEl = document.getElementById('settingsMenu');
const settingsAdminDashboardBtn = document.getElementById('settingsAdminDashboardBtn');
const logoutBtn = document.getElementById('logoutBtn');
const phDateTimeEl = document.getElementById('phDateTime');
const welcomeRoleIconEl = document.getElementById('welcomeRoleIcon');
const welcomeTextEl = document.getElementById('welcomeText');
const globalToastEl = document.getElementById('globalToast');
const globalToastTitleEl = document.getElementById('globalToastTitle');
const globalToastMessageEl = document.getElementById('globalToastMessage');

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
const adminNavOverviewBtn = document.getElementById('adminNavOverviewBtn');
const adminNavInventoryBtn = document.getElementById('adminNavInventoryBtn');
const adminNavKitSpecBtn = document.getElementById('adminNavKitSpecBtn');
const adminPanelOverviewEl = document.getElementById('adminPanelOverview');
const adminPanelInventoryEl = document.getElementById('adminPanelInventory');
const adminPanelKitSpecEl = document.getElementById('adminPanelKitSpec');
const inventoryIngredientFormEl = document.getElementById('inventoryIngredientForm');
const ingredientNameInputEl = document.getElementById('ingredientNameInput');
const ingredientQtyInputEl = document.getElementById('ingredientQtyInput');
const ingredientPriceInputEl = document.getElementById('ingredientPriceInput');
const ingredientUnitInputEl = document.getElementById('ingredientUnitInput');
const ingredientAddBtn = document.getElementById('ingredientAddBtn');
const inventoryAdminNoteEl = document.getElementById('inventoryAdminNote');
const inventorySummaryEl = document.getElementById('inventorySummary');
const inventoryTableWrapEl = document.getElementById('inventoryTableWrap');

// -- Tab Elements --
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let activeSalesRange = 'daily';
const ADMIN_DEFAULT_USERNAME = 'admin';
const ADMIN_DEFAULT_PASSWORD = 'P@ssw0rd';
const AUTH_SESSION_KEY = 'pos_active_user_v1';
const AUTH_TOKEN_KEY = 'pos_auth_token_v1';
const UI_STATE_KEY_PREFIX = 'pos_ui_state_v1_';
let confettiAnimation = null;
let yummyOrderAnimation = null;
let appInitialized = false;
let authLogoRenderStarted = false;
let activeAuthSession = null;
let phClockInterval = null;
let toastTimer = null;

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
  statusEl.classList.remove('invoice-status');
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
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(path, {
    ...options,
    headers: mergedHeaders
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function readActiveSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.email) return null;
    return parsed;
  } catch (_error) {
    return null;
  }
}

function writeActiveSession(user) {
  const sessionUser = {
    name: user.name,
    email: user.email,
    role: user.role || 'encharge',
    userId: user.userId || null
  };
  activeAuthSession = sessionUser;
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
}

function clearActiveSession() {
  activeAuthSession = null;
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function writeAccessToken(token) {
  if (!token) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function readAccessToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

function getUserUiStateKey() {
  const userKey = activeAuthSession?.userId || activeAuthSession?.email || 'guest';
  return `${UI_STATE_KEY_PREFIX}${userKey}`;
}

function readUserUiState() {
  try {
    const raw = localStorage.getItem(getUserUiStateKey());
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function saveUserUiState(patch) {
  try {
    const current = readUserUiState();
    const next = { ...current, ...patch };
    localStorage.setItem(getUserUiStateKey(), JSON.stringify(next));
  } catch (_error) {
    // Ignore local storage errors.
  }
}

function canAccessAdminFeatures() {
  const role = String(activeAuthSession?.role || '').toLowerCase();
  return role === 'administrations' || role === 'supervisor';
}

function canManageInventory() {
  const role = String(activeAuthSession?.role || '').toLowerCase();
  return role === 'administrations';
}

function updateSettingsRoleItems() {
  if (!settingsAdminDashboardBtn) return;
  settingsAdminDashboardBtn.style.display = canAccessAdminFeatures() ? 'block' : 'none';
}

function fireAudit(eventType, metadata = {}) {
  if (!activeAuthSession?.email) return;
  api('/api/auth/audit', {
    method: 'POST',
    body: JSON.stringify({
      eventType,
      userId: activeAuthSession.userId || null,
      email: activeAuthSession.email,
      metadata
    })
  }).catch(() => {});
}

function showConfirmationToast({ title, message, tone = 'success', duration = 2600 }) {
  if (!globalToastEl) return;
  if (globalToastTitleEl) globalToastTitleEl.textContent = title || 'Success';
  if (globalToastMessageEl) globalToastMessageEl.textContent = message || '';
  globalToastEl.classList.remove('success');
  globalToastEl.classList.add(tone);
  globalToastEl.setAttribute('aria-hidden', 'false');
  globalToastEl.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    globalToastEl.classList.remove('show');
    globalToastEl.setAttribute('aria-hidden', 'true');
  }, duration);
}

function updateWelcomeBanner() {
  if (!welcomeBannerEl) return;
  const rawName = String(activeAuthSession?.name || '').trim();
  const firstName = rawName ? rawName.split(/\s+/)[0] : 'User';
  const role = String(activeAuthSession?.role || 'encharge').toLowerCase();
  const roleIconMap = {
    administrations: '/User Role/administrator.png',
    supervisor: '/User Role/Supervisor.png',
    encharge: '/User Role/Encharge.png'
  };
  if (welcomeRoleIconEl) {
    welcomeRoleIconEl.src = roleIconMap[role] || roleIconMap.encharge;
    welcomeRoleIconEl.alt = `${role} role icon`;
  }
  if (welcomeTextEl) {
    welcomeTextEl.textContent = `Welcome ${firstName}, have a nice day.`;
    updateSettingsRoleItems();
    return;
  }
  welcomeBannerEl.textContent = `Welcome ${firstName}, have a nice day.`;
  updateSettingsRoleItems();
}

function updatePhilippineDateTime() {
  if (!phDateTimeEl) return;
  const now = new Date();
  const dateText = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now);
  const timeText = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(now);
  phDateTimeEl.textContent = `${dateText} | ${timeText} (Philippines)`;
}

function startPhilippineClock() {
  updatePhilippineDateTime();
  if (phClockInterval) return;
  phClockInterval = setInterval(updatePhilippineDateTime, 1000);
}

function closeSettingsMenu() {
  if (!settingsMenuEl) return;
  settingsMenuEl.classList.remove('open');
  settingsMenuEl.setAttribute('aria-hidden', 'true');
  if (settingsToggleBtn) settingsToggleBtn.setAttribute('aria-expanded', 'false');
}

function toggleSettingsMenu() {
  if (!settingsMenuEl) return;
  const willOpen = !settingsMenuEl.classList.contains('open');
  settingsMenuEl.classList.toggle('open', willOpen);
  settingsMenuEl.setAttribute('aria-hidden', String(!willOpen));
  if (settingsToggleBtn) settingsToggleBtn.setAttribute('aria-expanded', String(willOpen));
}

async function handleLogout() {
  const displayName = String(activeAuthSession?.name || 'User').trim() || 'User';
  try {
    await api('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({
        userId: activeAuthSession?.userId || null,
        email: activeAuthSession?.email || null
      })
    });
  } catch (_error) {
    // Continue logout locally even if network call fails
  }

  closeSettingsMenu();
  closeAdminLogin();
  closeAdminDashboard();
  closeAdminReceiptModal();
  closeEwalletModal();
  clearActiveSession();
  lockDashboard();
  setAuthMode('login');
  showConfirmationToast({
    title: 'Logged out successfully',
    message: `See you next time, ${displayName}.`,
    tone: 'success'
  });
  if (loginEmailEl) loginEmailEl.focus();
}

function setAuthMessage(message, isSuccess = false) {
  if (!authMessageEl) return;
  authMessageEl.textContent = message || '';
  authMessageEl.classList.toggle('success', Boolean(isSuccess));
}

function setAuthMode(mode) {
  const showLogin = mode !== 'signup';
  if (loginFormEl) loginFormEl.classList.toggle('hidden', !showLogin);
  if (signupFormEl) signupFormEl.classList.toggle('hidden', showLogin);
  if (showLoginBtn) {
    showLoginBtn.classList.toggle('active', showLogin);
    showLoginBtn.setAttribute('aria-selected', String(showLogin));
  }
  if (showSignupBtn) {
    showSignupBtn.classList.toggle('active', !showLogin);
    showSignupBtn.setAttribute('aria-selected', String(!showLogin));
  }
  setAuthMessage('');
  updateSettingsRoleItems();
}

function unlockDashboard() {
  document.body.classList.remove('auth-locked');
  if (authGateEl) authGateEl.setAttribute('aria-hidden', 'true');
  updateWelcomeBanner();
}

function lockDashboard() {
  document.body.classList.add('auth-locked');
  if (authGateEl) authGateEl.setAttribute('aria-hidden', 'false');
}

function startAppOnce() {
  if (appInitialized) return;
  appInitialized = true;
  init().catch((error) => {
    setStatus(`Startup error: ${error.message}`);
  });
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = normalizeEmail(loginEmailEl?.value);
  const password = String(loginPasswordEl?.value || '');

  if (!email || !password) {
    setAuthMessage('Enter your email and password.');
    return;
  }

  try {
    const result = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    writeActiveSession({
      name: result.user.fullName,
      email: result.user.email,
      role: result.user.role,
      userId: result.user.id
    });
    writeAccessToken(result.session?.accessToken || '');
    setAuthMessage('');
    showConfirmationToast({
      title: 'Login successful',
      message: `Welcome ${result.user.fullName}. Have a nice day.`,
      tone: 'success'
    });
    unlockDashboard();
    startAppOnce();
  } catch (error) {
    clearActiveSession();
    setAuthMessage(`Login failed: ${error.message}`);
  }
}

async function handleSignupSubmit(event) {
  event.preventDefault();
  const name = String(signupNameEl?.value || '').trim();
  const email = normalizeEmail(signupEmailEl?.value);
  const role = String(signupRoleEl?.value || '').trim().toLowerCase();
  const password = String(signupPasswordEl?.value || '');

  if (!name || !email || !password || !role) {
    setAuthMessage('Complete all fields to create an account.');
    return;
  }
  if (password.length < 6) {
    setAuthMessage('Password must be at least 6 characters.');
    return;
  }
  if (!['administrations', 'supervisor', 'encharge'].includes(role)) {
    setAuthMessage('Select a valid role.');
    return;
  }

  try {
    await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        fullName: name,
        email,
        role,
        password
      })
    });

    const loginResult = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    writeActiveSession({
      name: loginResult.user.fullName,
      email: loginResult.user.email,
      role: loginResult.user.role,
      userId: loginResult.user.id
    });
    writeAccessToken(loginResult.session?.accessToken || '');
    setAuthMessage('Sign up successful. Redirecting to dashboard...', true);
    showConfirmationToast({
      title: 'Signup successful',
      message: `Welcome ${loginResult.user.fullName}. Your account is ready.`,
      tone: 'success'
    });
    unlockDashboard();
    startAppOnce();
  } catch (error) {
    const errorText = String(error.message || '');
    const isExisting = /already|exists|registered/i.test(errorText);
    if (isExisting) {
      setAuthMessage('This email is already registered. Please login instead.');
      showConfirmationToast({
        title: 'Signup blocked',
        message: 'Email already exists. Use Login.',
        tone: 'warning',
        duration: 2200
      });
      setAuthMode('login');
      if (loginEmailEl) loginEmailEl.value = email;
      if (loginEmailEl) loginEmailEl.focus();
      return;
    }
    setAuthMessage(`Sign up failed: ${error.message}`);
  }
}

function setupAuth() {
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => setAuthMode('login'));
  }
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', () => setAuthMode('signup'));
  }
  if (loginFormEl) {
    loginFormEl.addEventListener('submit', handleLoginSubmit);
  }
  if (signupFormEl) {
    signupFormEl.addEventListener('submit', handleSignupSubmit);
  }
  if (settingsToggleBtn) {
    settingsToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettingsMenu();
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  if (settingsAdminDashboardBtn) {
    settingsAdminDashboardBtn.addEventListener('click', async () => {
      closeSettingsMenu();
      await openAdminLogin();
    });
  }
  document.addEventListener('click', (e) => {
    if (!settingsMenuEl?.classList.contains('open')) return;
    if (e.target?.closest('.settings-menu-wrap')) return;
    closeSettingsMenu();
  });
  startPhilippineClock();
  setAuthMode('login');
}

function startAuthLogoRender() {
  if (authLogoRenderStarted || !authLogoVideoEl || !authLogoCanvasEl) return;
  authLogoRenderStarted = true;

  const context = authLogoCanvasEl.getContext('2d', { willReadFrequently: true });
  if (!context) return;
  let hasStartedRender = false;

  function fitCanvas() {
    const width = Math.max(1, authLogoVideoEl.videoWidth || 720);
    const height = Math.max(1, authLogoVideoEl.videoHeight || 720);
    authLogoCanvasEl.width = width;
    authLogoCanvasEl.height = height;
  }

  function renderFrame() {
    if (!authLogoVideoEl.videoWidth || !authLogoVideoEl.videoHeight) {
      requestAnimationFrame(renderFrame);
      return;
    }

    fitCanvas();
    context.drawImage(authLogoVideoEl, 0, 0, authLogoCanvasEl.width, authLogoCanvasEl.height);

    const frame = context.getImageData(0, 0, authLogoCanvasEl.width, authLogoCanvasEl.height);
    const pixels = frame.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const isWhite = r > 220 && g > 220 && b > 220;
      if (isWhite) {
        pixels[i + 3] = 0;
      } else if (r > 190 && g > 185 && b > 180) {
        pixels[i + 3] = Math.max(0, pixels[i + 3] - 120);
      }
    }

    context.putImageData(frame, 0, 0);
    requestAnimationFrame(renderFrame);
  }

  function ensurePlayback() {
    authLogoVideoEl.muted = true;
    authLogoVideoEl.loop = true;
    authLogoVideoEl.playsInline = true;
    const playPromise = authLogoVideoEl.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }

  function startRenderIfReady() {
    if (hasStartedRender) return;
    if (authLogoVideoEl.readyState < 2) return;
    hasStartedRender = true;
    fitCanvas();
    renderFrame();
  }

  authLogoVideoEl.addEventListener('loadedmetadata', () => {
    ensurePlayback();
    startRenderIfReady();
  });
  authLogoVideoEl.addEventListener('loadeddata', () => {
    ensurePlayback();
    startRenderIfReady();
  });
  authLogoVideoEl.addEventListener('canplay', () => {
    ensurePlayback();
    startRenderIfReady();
  });
  authLogoVideoEl.addEventListener('pause', ensurePlayback);
  authLogoVideoEl.addEventListener('ended', ensurePlayback);
  authLogoVideoEl.addEventListener('stalled', ensurePlayback);

  ensurePlayback();
  if (authLogoVideoEl.readyState >= 2) {
    startRenderIfReady();
  }
}

async function bootstrap() {
  setupAuth();
  startAuthLogoRender();
  document.body.classList.add('auth-checking');
  const activeUser = readActiveSession();
  const token = readAccessToken();

  if (activeUser?.email && token) {
    activeAuthSession = {
      name: activeUser.name || 'User',
      email: activeUser.email,
      role: activeUser.role || 'encharge',
      userId: activeUser.userId || null
    };
    unlockDashboard();
    startAppOnce();

    try {
      const sessionResult = await api('/api/auth/session', {
        method: 'POST',
        body: JSON.stringify({ accessToken: token })
      });
      activeAuthSession = {
        name: sessionResult.user.fullName,
        email: sessionResult.user.email,
        role: sessionResult.user.role || 'encharge',
        userId: sessionResult.user.id
      };
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(activeAuthSession));
      unlockDashboard();
    } catch (_error) {
      clearActiveSession();
      lockDashboard();
      if (loginEmailEl) loginEmailEl.focus();
    } finally {
      document.body.classList.remove('auth-checking');
    }
    return;
  }
  clearActiveSession();
  lockDashboard();
  document.body.classList.remove('auth-checking');
  if (loginEmailEl) loginEmailEl.focus();
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

function switchAdminPanel(panelName) {
  const isOverview = panelName === 'overview';
  const isInventory = panelName === 'inventory';
  const isKit = panelName === 'kit-spec';

  if (adminPanelOverviewEl) adminPanelOverviewEl.classList.toggle('active', isOverview);
  if (adminPanelInventoryEl) adminPanelInventoryEl.classList.toggle('active', isInventory);
  if (adminPanelKitSpecEl) adminPanelKitSpecEl.classList.toggle('active', isKit);

  if (adminNavOverviewBtn) adminNavOverviewBtn.classList.toggle('active', isOverview);
  if (adminNavInventoryBtn) adminNavInventoryBtn.classList.toggle('active', isInventory);
  if (adminNavKitSpecBtn) adminNavKitSpecBtn.classList.toggle('active', isKit);

  if (isInventory) {
    refreshInventoryModule();
  }
}

function openAdminLogin() {
  if (!canAccessAdminFeatures()) {
    fireAudit('admin_access_denied', { reason: 'role_blocked', role: activeAuthSession?.role || 'unknown' });
    setStatus('Admin dashboard access is allowed only for Administrations and Supervisor roles.');
    return;
  }
  fireAudit('admin_access_allowed', { role: activeAuthSession?.role || 'unknown' });
  if (!adminLoginModalEl) return;
  document.body.classList.add('admin-login-open');
  if (adminUsernameEl) adminUsernameEl.value = ADMIN_DEFAULT_USERNAME;
  if (adminPasswordEl) adminPasswordEl.value = '';
  if (adminLoginErrorEl) adminLoginErrorEl.textContent = '';
  if (adminUsernameEl) adminUsernameEl.focus();
}

function closeAdminLogin() {
  document.body.classList.remove('admin-login-open');
}

async function openAdminDashboard() {
  document.body.classList.add('admin-open');
  saveUserUiState({ adminOpen: true });
  switchAdminPanel('overview');
  await refreshAdminTransactions();
  await refreshSalesReport(activeSalesRange);
}

function closeAdminDashboard() {
  document.body.classList.remove('admin-open');
  saveUserUiState({ adminOpen: false });
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

function preloadProductImages(products) {
  const uniqueImages = Array.from(
    new Set(
      (products || [])
        .map((p) => String(p?.image || '').trim())
        .filter(Boolean)
    )
  );

  uniqueImages.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  });
}

function updateVisibleProducts() {
  const activeCategory = String(state.activeCategory || '').toLowerCase();
  let visibleCount = 0;

  productsEl.querySelectorAll('.product-row').forEach((row) => {
    const rowCategory = String(row.getAttribute('data-category') || '').toLowerCase();
    const isVisible = rowCategory === activeCategory;
    row.style.display = isVisible ? '' : 'none';
    if (isVisible) visibleCount += 1;
  });

  const noProductsNotice = productsEl.querySelector('.no-products-message');
  if (noProductsNotice) {
    noProductsNotice.style.display = visibleCount ? 'none' : '';
  }
}

function renderProducts() {
  if (!state.productsRendered) {
    productsEl.innerHTML = '';

    if (!state.products.length) {
      productsEl.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No products available.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    state.products.forEach((p) => {
      const row = document.createElement('div');
      row.className = 'product-row';
      row.setAttribute('data-category', String(p.category || '').toLowerCase());
      row.innerHTML = `
        <img class="product-image" src="${p.image || '/Business Logo/Ruels Logo for business.png'}" alt="${p.name}" loading="lazy" decoding="async" />
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">${money(p.price)}</div>
        </div>
        <button data-add="${p.id}">Add to Order</button>
      `;
      fragment.appendChild(row);
    });

    const noProductsNotice = document.createElement('p');
    noProductsNotice.className = 'no-products-message';
    noProductsNotice.style.textAlign = 'center';
    noProductsNotice.style.color = '#6b7280';
    noProductsNotice.style.padding = '20px';
    noProductsNotice.textContent = 'No products in this category.';
    fragment.appendChild(noProductsNotice);

    productsEl.appendChild(fragment);
    state.productsRendered = true;
  }

  updateVisibleProducts();
}

function setPaymentMethod(method) {
  paymentMethodEl.value = method;
  onPaymentMethodChange();
  cashPaymentBtn?.classList.toggle('active', method === 'cash');
  ePaymentBtn?.classList.toggle('active', method !== 'cash');
}

function switchCategory(category) {
  state.activeCategory = category;
  saveUserUiState({ activeCategory: category });
  
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
  const displayItems = [...items].reverse();
  if (!items.length) {
    cartEl.innerHTML = '<p>No Orders Yet</p>'; 
  } else {
    const byId = Object.fromEntries(state.products.map((p) => [p.id, p]));
    displayItems.forEach(({ productId, qty }) => {
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

function updateReceiptActionVisibility() {
  const hasReceipt = Boolean(state.lastPaidInvoice);
  if (statusReceiptActionsEl) {
    statusReceiptActionsEl.style.display = hasReceipt ? 'flex' : 'none';
  }
  if (statusPrintReceiptBtn) {
    statusPrintReceiptBtn.disabled = !hasReceipt;
  }
}

function renderReceipt(invoice) {
  const successText = invoice?.payment?.successMessage || (invoice.status === 'PAID' ? 'Payment Successful' : 'Payment Pending');
  const itemRows = (invoice.lineItems || [])
    .map((item) => `
      <div class="status-item-row">
        <span>${escapeHtml(item.name)} x ${item.qty}</span>
        <strong>${money(item.subtotal)}</strong>
      </div>
    `)
    .join('');
  const orderLabel = invoice?.orderType ? getOrderTypeLabel(invoice.orderType) : getOrderTypeLabel(state.orderType);
  const paidAtText = formatDate(invoice?.payment?.paidAt || invoice?.updatedAt || invoice?.createdAt || new Date().toISOString());

  statusEl.classList.add('invoice-status');
  statusEl.innerHTML = `
    <div class="status-head">
      <div class="status-ref">Invoice: ${escapeHtml(invoice.reference || '-')}</div>
      <div class="status-badge ${String(invoice.status || '').toLowerCase() === 'paid' ? 'paid' : ''}">${escapeHtml(invoice.status || '-')}</div>
    </div>
    <div class="status-grid">
      <div class="status-grid-row"><span>Order</span><strong>${escapeHtml(orderLabel)}</strong></div>
      <div class="status-grid-row"><span>Payment</span><strong>${escapeHtml(getPaymentMethodLabel(invoice.paymentMethod))}</strong></div>
      <div class="status-grid-row"><span>Result</span><strong>${escapeHtml(successText)}</strong></div>
    </div>
    <div class="status-items">${itemRows || '<div class="status-item-row"><span>No items</span><strong>-</strong></div>'}</div>
    <div class="status-totals">
      <div class="status-total-row"><span>Subtotal</span><strong>${money(invoice.subtotal ?? invoice.total)}</strong></div>
      <div class="status-total-row"><span>Discount</span><strong>${money(invoice.discount || 0)}</strong></div>
      <div class="status-total-row grand"><span>Total Due</span><strong>${money(invoice.total)}</strong></div>
      <div class="status-total-row"><span>Paid</span><strong>${money(invoice?.payment?.amountPaid || invoice.total || 0)}</strong></div>
      <div class="status-total-row"><span>Change</span><strong>${money(invoice?.payment?.change || 0)}</strong></div>
    </div>
    <div class="status-paid-at">Paid At: ${escapeHtml(paidAtText)}</div>
  `;
}

function renderPaymentReceiptModal(invoice) {
  const orderLabel = invoice?.orderType
    ? getOrderTypeLabel(invoice.orderType)
    : getOrderTypeLabel(state.orderType);
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
  state.lastPaidInvoice = invoice;
  updateReceiptActionVisibility();
  state.cashPromptActive = false;
  if (amountTenderedEl) amountTenderedEl.value = '';
  resetAfterSale();
}

function closePaymentSuccessModal() {
  if (paymentSuccessModalEl) paymentSuccessModalEl.classList.remove('open');
  const receiptCardEl = paymentSuccessModalEl?.querySelector('.payment-success-card');
  if (receiptCardEl) receiptCardEl.classList.remove('collapsed');
  if (receiptCardEl) receiptCardEl.classList.remove('minimizing');
  if (receiptCardEl) receiptCardEl.style.transform = '';
  if (receiptCardEl) receiptCardEl.style.opacity = '';
  if (receiptMinimizeBtn) receiptMinimizeBtn.textContent = 'Minimize';
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

function openLatestReceiptPreview() {
  if (!state.lastPaidInvoice) {
    setStatus('No paid transaction yet to preview receipt.');
    return;
  }
  renderPaymentReceiptModal(state.lastPaidInvoice);
  if (paymentSuccessModalEl) paymentSuccessModalEl.classList.add('open');
}

function togglePaymentReceiptCollapse() {
  const receiptCardEl = paymentSuccessModalEl?.querySelector('.payment-success-card');
  const targetBtn = statusPrintReceiptBtn;
  if (!receiptCardEl || !receiptMinimizeBtn) return;

  if (receiptMinimizeBtn.textContent === 'Minimize' && paymentSuccessModalEl?.classList.contains('open')) {
    if (!targetBtn) return;
    const cardRect = receiptCardEl.getBoundingClientRect();
    const targetRect = targetBtn.getBoundingClientRect();
    const dx = (targetRect.left + (targetRect.width / 2)) - (cardRect.left + (cardRect.width / 2));
    const dy = (targetRect.top + (targetRect.height / 2)) - (cardRect.top + (cardRect.height / 2));

    receiptCardEl.classList.add('minimizing');
    receiptCardEl.style.transform = `translate(${dx}px, ${dy}px) scale(0.2)`;
    receiptCardEl.style.opacity = '0.15';
    receiptMinimizeBtn.textContent = 'Expand';

    setTimeout(() => {
      if (paymentSuccessModalEl) paymentSuccessModalEl.classList.remove('open');
      receiptCardEl.classList.remove('minimizing');
      receiptCardEl.style.transform = '';
      receiptCardEl.style.opacity = '';
      if (receiptMinimizeBtn) receiptMinimizeBtn.textContent = 'Minimize';
    }, 360);
    return;
  }

  const collapsed = !receiptCardEl.classList.contains('collapsed');
  receiptCardEl.classList.toggle('collapsed', collapsed);
  receiptMinimizeBtn.textContent = collapsed ? 'Expand' : 'Minimize';
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

function openScanQrModal() {
  if (!scanQrModalEl) return;
  scanQrModalEl.classList.add('open');
}

function closeScanQrModal() {
  if (!scanQrModalEl) return;
  scanQrModalEl.classList.remove('open');
}

function renderScanQrContent({ checkout, invoice, notice = 'Waiting for payment confirmation...' }) {
  if (!scanQrContentEl) return;
  const sampleQrDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
      <rect width="220" height="220" fill="white"/>
      <rect x="12" y="12" width="56" height="56" fill="black"/>
      <rect x="20" y="20" width="40" height="40" fill="white"/>
      <rect x="28" y="28" width="24" height="24" fill="black"/>
      <rect x="152" y="12" width="56" height="56" fill="black"/>
      <rect x="160" y="20" width="40" height="40" fill="white"/>
      <rect x="168" y="28" width="24" height="24" fill="black"/>
      <rect x="12" y="152" width="56" height="56" fill="black"/>
      <rect x="20" y="160" width="40" height="40" fill="white"/>
      <rect x="28" y="168" width="24" height="24" fill="black"/>
      <rect x="84" y="84" width="8" height="8" fill="black"/>
      <rect x="100" y="84" width="8" height="8" fill="black"/>
      <rect x="116" y="84" width="8" height="8" fill="black"/>
      <rect x="132" y="84" width="8" height="8" fill="black"/>
      <rect x="84" y="100" width="8" height="8" fill="black"/>
      <rect x="116" y="100" width="8" height="8" fill="black"/>
      <rect x="132" y="100" width="8" height="8" fill="black"/>
      <rect x="84" y="116" width="8" height="8" fill="black"/>
      <rect x="100" y="116" width="8" height="8" fill="black"/>
      <rect x="132" y="116" width="8" height="8" fill="black"/>
      <rect x="84" y="132" width="8" height="8" fill="black"/>
      <rect x="100" y="132" width="8" height="8" fill="black"/>
      <rect x="116" y="132" width="8" height="8" fill="black"/>
      <rect x="132" y="132" width="8" height="8" fill="black"/>
      <text x="110" y="212" text-anchor="middle" font-size="11" font-family="Arial" fill="#5a3521">Sample QR for Scan-to-Pay</text>
    </svg>
  `)}`;
  const qrMarkup = `<img class="qr" alt="Sample Payment QR Code" src="${sampleQrDataUrl}" />`;

  scanQrContentEl.innerHTML = `
    <div class="scan-qr-meta">
      <div><strong>Reference:</strong> ${escapeHtml(checkout?.reference || invoice?.reference || '-')}</div>
      <div><strong>Amount:</strong> ${money(invoice?.total || checkout?.amount || 0)}</div>
      <div><strong>Method:</strong> ${escapeHtml(getPaymentMethodLabel(invoice?.paymentMethod || checkout?.method || 'gcash'))}</div>
      <div><strong>Status:</strong> ${escapeHtml(notice)}</div>
    </div>
    ${qrMarkup}
  `;
}

async function startScanQrPaymentFlow() {
  try {
    const items = getCartItems();
    if (!items.length) {
      setStatus('Add at least one item first.');
      return;
    }

    const { invoice } = await api('/api/invoices', {
      method: 'POST',
      body: JSON.stringify({
        items,
        paymentMethod: 'gcash',
        discountAmount: getDiscountAmount(),
        orderType: state.orderType
      })
    });

    state.activeInvoice = invoice;

    const customerInfo = {};
    const cName = (customerNameEl?.value || '').trim();
    const cEmail = (customerEmailEl?.value || '').trim();
    const cPhone = (customerPhoneEl?.value || '').trim();
    if (cName) customerInfo.name = cName;
    if (cEmail) customerInfo.email = cEmail;
    if (cPhone) customerInfo.phone = cPhone;

    const { checkout } = await api('/api/payments/ewallet/checkout', {
      method: 'POST',
      body: JSON.stringify({ invoiceId: invoice.id, customerInfo })
    });

    state.scanQrContext = {
      invoiceId: invoice.id,
      invoice,
      checkout
    };

    renderScanQrContent({ checkout, invoice, notice: 'Waiting for customer proof of payment...' });
    if (scanQrFinishBtn) scanQrFinishBtn.disabled = false;
    openScanQrModal();
    setStatus('Sample QR is ready. Ask customer to scan and pay, then confirm proof and click Finish.');
  } catch (error) {
    setStatus(`QR checkout error: ${error.message}`);
  }
}

async function finishScanQrPayment() {
  if (!state.scanQrContext?.invoiceId) {
    setStatus('No active QR payment session.');
    return;
  }

  let paidInvoice = null;
  try {
    const completeResult = await api(`/api/payments/ewallet/manual-complete/${state.scanQrContext.invoiceId}`, {
      method: 'POST'
    });
    paidInvoice = completeResult?.invoice || null;
  } catch (error) {
    setStatus(`Cannot complete payment: ${error.message}`);
    return;
  }
  if (!paidInvoice) return;

  closeScanQrModal();
  renderReceipt(paidInvoice);
  await refreshSalesReport(activeSalesRange);
  finalizeSuccessfulPayment(paidInvoice, 'E-Payment');
  state.scanQrContext = null;
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

function renderDetailedSalesReport(report) {
  if (detailDailySalesEl) detailDailySalesEl.textContent = money(report?.dailySales?.totalSales || 0);
  if (detailDailyMetaEl) {
    detailDailyMetaEl.textContent = `${Number(report?.dailySales?.totalTransactions || 0)} transactions | Avg ${money(report?.dailySales?.averageTicket || 0)}`;
  }
  if (detailMonthlySalesEl) detailMonthlySalesEl.textContent = money(report?.monthlySales?.totalSales || 0);
  if (detailMonthlyMetaEl) {
    detailMonthlyMetaEl.textContent = `${Number(report?.monthlySales?.totalTransactions || 0)} transactions | Avg ${money(report?.monthlySales?.averageTicket || 0)}`;
  }

  if (!topProductsListEl) return;
  const rows = Array.isArray(report?.topSalesPerProduct) ? report.topSalesPerProduct : [];
  if (!rows.length) {
    topProductsListEl.innerHTML = '<p>No product sales yet.</p>';
    return;
  }

  topProductsListEl.innerHTML = rows
    .map((item) => `
      <div class="top-product-row">
        <span class="top-product-name">${escapeHtml(item.productName || 'Unknown Product')}</span>
        <span class="top-product-qty">${Number(item.qtySold || 0)} sold</span>
        <span class="top-product-sales">${money(item.totalSales || 0)}</span>
      </div>
    `)
    .join('');
}

async function refreshDetailedSalesReport() {
  try {
    const report = await api('/api/reports/sales/detailed');
    renderDetailedSalesReport(report);
  } catch (error) {
    if (topProductsListEl) {
      topProductsListEl.innerHTML = `<p class="error">Detailed sales error: ${escapeHtml(error.message)}</p>`;
    }
  }
}

function renderInventoryReport(report) {
  function formatQty(value) {
    return Number(value || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatInventoryMoney(value) {
    return `PHP ${Number(value || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  const totals = report?.totals || {};
  const ingredients = Array.isArray(report?.ingredients) ? report.ingredients : [];

  if (inventorySummaryEl) {
    inventorySummaryEl.textContent = [
      `Total Ingredients: ${Number(totals.totalIngredients || 0)}`,
      `Total Inventory Value: ${formatInventoryMoney(totals.totalInventoryValue || 0)}`,
      `Low Stock Items: ${Number(totals.lowStockCount || 0)}`
    ].join('\n');
  }

  if (!inventoryTableWrapEl) return;
  if (!ingredients.length) {
    inventoryTableWrapEl.innerHTML = '<p>No ingredients yet. Add your first ingredient above.</p>';
    return;
  }

  const rows = ingredients.map((x) => {
    const usageRows = (x.usageByProduct || [])
      .slice(0, 3)
      .map((u) => `<li>${escapeHtml(u.productName)}: used ${formatQty(u.estimatedUsedQty || 0)} ${escapeHtml(x.unit || 'pcs')}</li>`)
      .join('');

    return `
      <tr>
        <td><strong>${escapeHtml(x.name)}</strong></td>
        <td>${formatQty(x.qtyOnHand || 0)} ${escapeHtml(x.unit || 'pcs')}</td>
        <td>${formatInventoryMoney(x.unitPrice || 0)}</td>
        <td>${formatInventoryMoney(x.inventoryValue || 0)}</td>
        <td>${formatQty(x.estimatedUsedQty || 0)} ${escapeHtml(x.unit || 'pcs')}</td>
        <td>${formatQty(x.estimatedRemainingQty || 0)} ${escapeHtml(x.unit || 'pcs')}</td>
        <td>${x.lowStock ? '<span class="low-stock-badge">Low Stock</span>' : 'OK'}</td>
        <td>${usageRows ? `<ul class="usage-list">${usageRows}</ul>` : 'No recipe mapping yet'}</td>
      </tr>
    `;
  }).join('');

  inventoryTableWrapEl.innerHTML = `
    <table class="inventory-table">
      <thead>
        <tr>
          <th>Ingredient</th>
          <th>Qty On Hand</th>
          <th>Unit Price</th>
          <th>Inventory Value</th>
          <th>Estimated Used</th>
          <th>Estimated Remaining</th>
          <th>Status</th>
          <th>Used in Products</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function refreshInventoryModule() {
  const isAdmin = canManageInventory();
  if (inventoryIngredientFormEl) {
    inventoryIngredientFormEl.style.display = isAdmin ? 'flex' : 'none';
  }
  if (inventoryAdminNoteEl) {
    inventoryAdminNoteEl.style.display = isAdmin ? 'none' : 'block';
  }

  if (inventorySummaryEl) inventorySummaryEl.textContent = 'Loading inventory summary...';
  if (inventoryTableWrapEl) inventoryTableWrapEl.innerHTML = '<p>Loading ingredients...</p>';

  try {
    const report = await api('/api/admin/inventory/report');
    renderInventoryReport(report);
  } catch (error) {
    if (inventorySummaryEl) inventorySummaryEl.textContent = `Inventory error: ${error.message}`;
    if (inventoryTableWrapEl) inventoryTableWrapEl.innerHTML = '';
  }
}

async function handleIngredientSubmit(event) {
  event.preventDefault();
  if (!canManageInventory()) {
    setStatus('Only Administrations role can add ingredients.');
    return;
  }

  const name = String(ingredientNameInputEl?.value || '').trim();
  const qtyOnHand = Number(ingredientQtyInputEl?.value || 0);
  const unitPrice = Number(ingredientPriceInputEl?.value || 0);
  const unit = String(ingredientUnitInputEl?.value || '').trim() || 'pcs';

  if (!name) {
    setStatus('Ingredient name is required.');
    return;
  }
  if (!Number.isFinite(qtyOnHand) || qtyOnHand < 0) {
    setStatus('Quantity must be a valid number >= 0.');
    return;
  }
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    setStatus('Unit price must be a valid number >= 0.');
    return;
  }

  try {
    if (ingredientAddBtn) {
      ingredientAddBtn.disabled = true;
      ingredientAddBtn.textContent = 'Adding...';
    }

    await api('/api/admin/inventory/ingredients', {
      method: 'POST',
      headers: {
        'x-user-role': String(activeAuthSession?.role || '')
      },
      body: JSON.stringify({ name, qtyOnHand, unitPrice, unit })
    });

    if (ingredientNameInputEl) ingredientNameInputEl.value = '';
    if (ingredientQtyInputEl) ingredientQtyInputEl.value = '';
    if (ingredientPriceInputEl) ingredientPriceInputEl.value = '';
    if (ingredientUnitInputEl) ingredientUnitInputEl.value = 'pcs';
    await refreshInventoryModule();
    setStatus(`Ingredient "${name}" added successfully.`);
  } catch (error) {
    setStatus(`Add ingredient failed: ${error.message}`);
  } finally {
    if (ingredientAddBtn) {
      ingredientAddBtn.disabled = false;
      ingredientAddBtn.textContent = 'Add Ingredient';
    }
  }
}

async function refreshSalesReport(range = activeSalesRange) {
  try {
    activeSalesRange = range;
    saveUserUiState({ salesRange: activeSalesRange });
    const report = await api(`/api/reports/sales?range=${encodeURIComponent(range)}`);
    renderSalesReport(report);
    await refreshDetailedSalesReport();
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
      body: JSON.stringify({ items, paymentMethod, discountAmount, orderType: state.orderType })
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
  if (chooseScanQrBtn) {
    chooseScanQrBtn.addEventListener('click', async () => {
      closeEwalletModal();
      setPaymentMethod('gcash');
      await startScanQrPaymentFlow();
    });
  }
  if (cancelEwalletBtn) {
    cancelEwalletBtn.addEventListener('click', closeEwalletModal);
  }
  if (scanQrFinishBtn) {
    scanQrFinishBtn.addEventListener('click', finishScanQrPayment);
  }
  if (scanQrCancelBtn) {
    scanQrCancelBtn.addEventListener('click', closeScanQrModal);
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
  if (adminNavOverviewBtn) {
    adminNavOverviewBtn.addEventListener('click', () => switchAdminPanel('overview'));
  }
  if (adminNavInventoryBtn) {
    adminNavInventoryBtn.addEventListener('click', () => switchAdminPanel('inventory'));
  }
  if (adminNavKitSpecBtn) {
    adminNavKitSpecBtn.addEventListener('click', () => switchAdminPanel('kit-spec'));
  }
  if (inventoryIngredientFormEl) {
    inventoryIngredientFormEl.addEventListener('submit', handleIngredientSubmit);
  }
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
  if (receiptMinimizeBtn) {
    receiptMinimizeBtn.addEventListener('click', togglePaymentReceiptCollapse);
  }
  if (receiptPrintBtn) {
    receiptPrintBtn.addEventListener('click', printReceiptFromModal);
  }
  if (statusPrintReceiptBtn) {
    statusPrintReceiptBtn.addEventListener('click', openLatestReceiptPreview);
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
      closeSettingsMenu();
      closeEwalletModal();
      closeScanQrModal();
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
  const persistedUiState = readUserUiState();
  const persistedCategory = String(persistedUiState.activeCategory || '').trim().toLowerCase();
  const allowedCategories = new Set(['main-dish', 'rice', 'burger', 'drinks', 'fries', 'dessert', 'sauces']);
  if (allowedCategories.has(persistedCategory)) {
    state.activeCategory = persistedCategory;
  }
  if (persistedUiState.salesRange === 'daily' || persistedUiState.salesRange === 'weekly') {
    activeSalesRange = persistedUiState.salesRange;
  }

  const [{ products }] = await Promise.all([api('/api/products'), api('/api/config')]);
  state.products = products;
  ensureConfettiAnimation();
  ensureYummyAnimations();
  renderProducts();
  switchCategory(state.activeCategory);
  preloadProductImages(state.products);
  renderCart();

  setupEventListeners();
  updateReceiptActionVisibility();
  if (cashPaymentBtn) cashPaymentBtn.disabled = true;
  if (ePaymentBtn) ePaymentBtn.disabled = true;
  setPaymentMethod('cash');
  setStatus('Select order type first: Dine In or Take Out.');
  await refreshSalesReport(activeSalesRange);

  if (persistedUiState.adminOpen && canAccessAdminFeatures()) {
    await openAdminDashboard();
  }
}

bootstrap().catch((error) => {
  setAuthMessage(`Authentication startup error: ${error.message}`);
});








