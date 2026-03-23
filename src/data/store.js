const fs = require('fs');
const path = require('path');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');
const { getSupabase, isSupabaseEnabled } = require('./supabaseClient');
const offlineQueue = require('./offlineQueue');
const { db } = require('./localDb');

const DEFAULT_PRODUCTS = [
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

const DEFAULT_MENU_CATEGORIES = [
  { key: 'main-dish', name: 'Main Dish', image: '/Menu/Main Dish.png', sortOrder: 10 },
  { key: 'rice', name: 'Rice', image: '/Menu/Rice.png', sortOrder: 20 },
  { key: 'burger', name: 'Burger', image: '/Menu/Burger.png', sortOrder: 30 },
  { key: 'drinks', name: 'Drinks', image: '/Menu/Drinks.png', sortOrder: 40 },
  { key: 'fries', name: 'Fries', image: '/Menu/Fries.png', sortOrder: 50 },
  { key: 'dessert', name: 'Dessert', image: '/Menu/Dessert.png', sortOrder: 60 },
  { key: 'sauces', name: 'Sauces', image: '/Menu/Sauce.png', sortOrder: 70 }
];

// NOTE: Runtime state still uses in-memory maps. When SQLite is unavailable,
// selected modules persist through JSON fallbacks so admin settings and
// monthly expense data survive reloads.
const invoices = new Map();
const gcashSessions = new Map();
const invoiceAdjustmentLogs = new Map();
const inventoryIngredients = new Map();
const inventoryMovements = new Map();
const productRecipes = new Map();
const menuCategories = new Map(DEFAULT_MENU_CATEGORIES.map((x) => [x.key, x]));
const cashierShifts = new Map();
const cashDrawers = new Map();
const cashDrawerMovements = new Map();
const expenseEntries = new Map();
const monthlyClosingSnapshots = new Map();
const supabase = getSupabase();
const PG_INT_MAX = 2147483647;
const LINE_ITEM_UUID_NAMESPACE = '44f6ebf6-8e53-48a7-bf63-853f4ea6848b';
const ORDER_SLIP_PREFIX = 'OR-';
const ORDER_SLIP_DIGITS = 13;
const ORDER_SLIP_REGEX = /^OR-(\d{13})$/;
const INVOICE_STATUSES = new Set(['PENDING', 'PAID', 'HOLD_FOR_VOID', 'CANCELLED', 'VOIDED']);
const APP_CONFIG_KEY = 'app_config';
const APP_SETTINGS_TABLE = 'app_settings';
const DISCOUNT_PROFILES_TABLE = 'discount_profiles';
const INVOICE_ADJUSTMENTS_TABLE = 'pos_invoice_adjustments';
const APP_CONFIG_SYNC_TTL_MS = 15 * 1000;
const DISCOUNT_PROFILE_SYNC_TTL_MS = 15 * 1000;
const APP_CONFIG_FALLBACK_FILE = process.env.POS_APP_CONFIG_FILE
  ? path.resolve(process.env.POS_APP_CONFIG_FILE)
  : path.join(__dirname, '../../pos-app-config.json');
const EXPENSES_FALLBACK_FILE = process.env.POS_EXPENSES_FILE
  ? path.resolve(process.env.POS_EXPENSES_FILE)
  : path.join(__dirname, '../../pos-expenses.json');
const MONTHLY_CLOSING_SNAPSHOTS_FALLBACK_FILE = process.env.POS_MONTHLY_CLOSING_SNAPSHOTS_FILE
  ? path.resolve(process.env.POS_MONTHLY_CLOSING_SNAPSHOTS_FILE)
  : path.join(__dirname, '../../pos-monthly-closing-snapshots.json');
const DEFAULT_DISCOUNT_PROFILES = Object.freeze([
  { id: 'student', name: 'Students', type: 'percent', amount: 10 },
  { id: 'senior', name: 'Seniors', type: 'percent', amount: 20 },
  { id: 'pwd', name: 'PWD', type: 'percent', amount: 20 }
]);
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
    'shift_monitor_access',
    'invoice_action_access'
  ])
});
const DEFAULT_EPAYMENT_SETTINGS = Object.freeze({
  gcash: Object.freeze({ enabled: true, disabledReason: '', qrImageUrl: '' }),
  paymaya: Object.freeze({ enabled: true, disabledReason: '', qrImageUrl: '' }),
  scanQr: Object.freeze({ enabled: true, disabledReason: '', qrImageUrl: '' })
});
const DEFAULT_RECEIPT_WORKFLOW = Object.freeze({
  autoOpenAfterPayment: false
});
const DEFAULT_APP_CONFIG = Object.freeze({
  enforceKitSpec: true,
  discountProfiles: DEFAULT_DISCOUNT_PROFILES,
  roleAccess: DEFAULT_ROLE_ACCESS,
  ePaymentSettings: DEFAULT_EPAYMENT_SETTINGS,
  receiptWorkflow: DEFAULT_RECEIPT_WORKFLOW
});
const DEFAULT_RECEIPT_TEMPLATE_ID = 'classic-roast-beef';
const DEFAULT_RECEIPT_TEMPLATE_SETTINGS = Object.freeze({
  paperWidthMm: 80,
  paddingPx: 12,
  borderRadiusPx: 12,
  fontFamily: "'Trebuchet MS', 'Arial', sans-serif",
  baseFontSizePx: 13,
  titleFontSizePx: 24,
  metaFontSizePx: 12,
  totalFontSizePx: 16,
  sectionGapPx: 10,
  logoUrl: '/Business Logo/Ruels Logo for business.png',
  showLogo: true,
  logoWidthPx: 78,
  headerAlign: 'center',
  footerAlign: 'center',
  backgroundColor: '#ffffff',
  textColor: '#432716',
  accentColor: '#5a3521',
  mutedColor: '#7b5a47',
  borderColor: '#c8a88f',
  borderStyle: 'dashed',
  dividerStyle: 'dashed',
  orderSlipTitle: 'Order Slip',
  storeName: "Ruel's Roast Beef",
  storeAddress: 'Location : Tres Martires, City of Baybay, 6521 Leyte',
  taxLine: 'Vat Registered TIN 342-231-312-00000',
  showDiscountProfileType: true,
  discountProfileLabel: 'Customer Discount Type',
  footerMessage: 'Thank you for dining with us!',
  extraMessage: '',
  extraMessageAlign: 'center',
  extraMessageStyle: 'dashed',
  footerFontSizePx: 12,
  footerTopSpacingPx: 12,
  headerTopPaddingPx: 0,
  headerOffsetX: 0,
  headerOffsetY: 0,
  metaOffsetX: 0,
  metaOffsetY: 0,
  itemsOffsetX: 0,
  itemsOffsetY: 0,
  totalsOffsetX: 0,
  totalsOffsetY: 0,
  footerOffsetX: 0,
  footerOffsetY: 0,
  extraMessageOffsetX: 0,
  extraMessageOffsetY: 0
});
const SUPABASE_READ_COOLDOWN_MS = 2 * 60 * 1000;
let supabaseReadCircuitUntil = 0;
let lastSupabaseReadFailureLog = '';

function sanitizeSupabaseErrorMessage(error) {
  const raw = String(error?.message || error || '').trim();
  if (!raw) return 'Unknown Supabase error';
  if (/<html[\s>]/i.test(raw) || /<!DOCTYPE html>/i.test(raw)) {
    if (/502/i.test(raw) || /bad gateway/i.test(raw)) return 'Supabase gateway returned HTTP 502 Bad Gateway';
    if (/503/i.test(raw) || /service unavailable/i.test(raw)) return 'Supabase gateway returned HTTP 503 Service Unavailable';
    if (/504/i.test(raw) || /gateway timeout/i.test(raw)) return 'Supabase gateway returned HTTP 504 Gateway Timeout';
    return 'Supabase returned an HTML error page instead of JSON';
  }
  return raw.replace(/\s+/g, ' ').slice(0, 240);
}

function canAttemptSupabaseRead() {
  return isSupabaseEnabled() && Date.now() >= supabaseReadCircuitUntil;
}

function markSupabaseReadHealthy() {
  supabaseReadCircuitUntil = 0;
  lastSupabaseReadFailureLog = '';
}

function markSupabaseReadFailure(context, error) {
  const message = sanitizeSupabaseErrorMessage(error);
  supabaseReadCircuitUntil = Date.now() + SUPABASE_READ_COOLDOWN_MS;
  const nextLogLine = `${context}:${message}`;
  if (lastSupabaseReadFailureLog !== nextLogLine) {
    console.warn(`[Offline] ${context} Supabase failed, using in-memory for ${Math.round(SUPABASE_READ_COOLDOWN_MS / 1000)}s: ${message}`);
    lastSupabaseReadFailureLog = nextLogLine;
  }
}

function isMissingSupabaseTableError(error, tableName) {
  const message = sanitizeSupabaseErrorMessage(error).toLowerCase();
  const safeTableName = String(tableName || '').trim().toLowerCase();
  if (!safeTableName) return false;
  return (
    message.includes(`public.${safeTableName}`) &&
    (message.includes('schema cache') || message.includes('could not find the table'))
  ) || (
    message.includes(safeTableName) &&
    (message.includes('does not exist') || message.includes('42p01'))
  );
}

let appConfigMemory = { ...DEFAULT_APP_CONFIG };
let getAppConfigStmt = null;
let upsertAppConfigStmt = null;
let appConfigLoadedFromLocal = false;
let appConfigSyncPromise = null;
let appConfigLastSyncedAt = 0;
let appConfigSupabaseTableMissing = false;
let appConfigSupabaseMissingLogged = false;
let discountProfilesSyncPromise = null;
let discountProfilesLastSyncedAt = 0;
let discountProfilesSupabaseTableMissing = false;
let discountProfilesSupabaseMissingLogged = false;
const receiptTemplates = new Map();
let listReceiptTemplatesStmt = null;
let getReceiptTemplateStmt = null;
let upsertReceiptTemplateStmt = null;
let activateReceiptTemplateStmt = null;
let deleteReceiptTemplateStmt = null;
let nextOrderSlipSequence = null;
let initOrderSlipSequencePromise = null;
let expenseFallbackLoaded = false;
let monthlyClosingSnapshotsFallbackLoaded = false;
let monthlyClosingSnapshotsSupabaseUnavailable = false;
let monthlyClosingSnapshotsSupabaseFallbackLogged = false;

function readJsonFallbackFile(filePath, fallbackValue) {
  try {
    if (!fs.existsSync(filePath)) return fallbackValue;
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) return fallbackValue;
    return JSON.parse(raw);
  } catch (_error) {
    return fallbackValue;
  }
}

function writeJsonFallbackFile(filePath, value, errorLabel) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
  } catch (error) {
    console.warn(`${errorLabel}: ${error.message}`);
  }
}

if (db) {
  getAppConfigStmt = db.prepare(`
    SELECT value_json
    FROM app_settings
    WHERE key = ?
    LIMIT 1
  `);

  upsertAppConfigStmt = db.prepare(`
    INSERT INTO app_settings (key, value_json, updated_at)
    VALUES (@key, @valueJson, @updatedAt)
    ON CONFLICT(key) DO UPDATE SET
      value_json = excluded.value_json,
      updated_at = excluded.updated_at
  `);

  listReceiptTemplatesStmt = db.prepare(`
    SELECT id, name, settings_json, is_active, created_at, updated_at
    FROM receipt_templates
    ORDER BY is_active DESC, updated_at DESC, name ASC
  `);

  getReceiptTemplateStmt = db.prepare(`
    SELECT id, name, settings_json, is_active, created_at, updated_at
    FROM receipt_templates
    WHERE id = ?
    LIMIT 1
  `);

  upsertReceiptTemplateStmt = db.prepare(`
    INSERT INTO receipt_templates (id, name, settings_json, is_active, created_at, updated_at)
    VALUES (@id, @name, @settingsJson, @isActive, @createdAt, @updatedAt)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      settings_json = excluded.settings_json,
      is_active = excluded.is_active,
      updated_at = excluded.updated_at
  `);

  activateReceiptTemplateStmt = db.prepare(`
    UPDATE receipt_templates
    SET is_active = CASE WHEN id = @id THEN 1 ELSE 0 END
  `);

  deleteReceiptTemplateStmt = db.prepare(`
    DELETE FROM receipt_templates
    WHERE id = ?
  `);
}

function normalizeMenuCategoryKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function getDefaultCategoryByKey(key) {
  const normalized = normalizeMenuCategoryKey(key);
  return DEFAULT_MENU_CATEGORIES.find((x) => x.key === normalized) || null;
}

function ensureMenuCategoryDefaultsFallback() {
  if (menuCategories.size) return;
  DEFAULT_MENU_CATEGORIES.forEach((x) => {
    menuCategories.set(x.key, { ...x });
  });
}

function listMenuCategoriesFallback() {
  ensureMenuCategoryDefaultsFallback();
  return Array.from(menuCategories.values())
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    .map((x) => ({ ...x }));
}

function listProductsFallback() {
  return DEFAULT_PRODUCTS.map((p) => ({ ...p }));
}

function normalizeDiscountProfileId(value, fallback = 'discount') {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || fallback;
}

function toMoney(value, fallback = 0) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.round(numeric * 100) / 100;
}

function normalizeDiscountProfile(profile = {}, index = 0) {
  const name = String(profile?.name || '').trim().slice(0, 60) || `Discount ${index + 1}`;
  const type = String(profile?.type || '').trim().toLowerCase() === 'fixed' ? 'fixed' : 'percent';
  const legacyPercent = Number(profile?.percent);
  const rawAmount = profile?.amount !== undefined ? Number(profile.amount) : legacyPercent;
  return {
    id: normalizeDiscountProfileId(profile?.id || name, `discount-${index + 1}`),
    name,
    type,
    amount: type === 'percent'
      ? clampNumber(rawAmount, 0, 100, 0)
      : clampNumber(rawAmount, 0, 999999, 0)
  };
}

function normalizeInvoiceDiscountProfile(profile = null) {
  if (!profile || typeof profile !== 'object') return null;
  const normalized = normalizeDiscountProfile(profile);
  if (!normalized.name) return null;
  if (!Number.isFinite(Number(normalized.amount || 0)) || Number(normalized.amount || 0) <= 0) return null;
  return normalized;
}

function parseStoredDiscountProfile(rawValue) {
  if (!rawValue) return null;
  let value = rawValue;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (_error) {
      return null;
    }
  }
  return normalizeInvoiceDiscountProfile(value);
}

function inferDiscountProfileFromTotals({ subtotal = 0, total = 0, discount = null, explicitProfile = null } = {}) {
  const normalizedExplicit = normalizeInvoiceDiscountProfile(explicitProfile);
  if (normalizedExplicit) return normalizedExplicit;

  const normalizedSubtotal = Number(subtotal || 0);
  const normalizedTotal = Number(total || 0);
  const discountValue = Number.isFinite(Number(discount))
    ? Number(discount)
    : toMoney(normalizedSubtotal - normalizedTotal);

  if (!Number.isFinite(discountValue) || discountValue <= 0 || normalizedSubtotal <= 0) {
    return null;
  }

  const profiles = getCachedDiscountProfiles();
  let bestMatch = null;

  profiles.forEach((profile) => {
    const expectedDiscount = profile.type === 'fixed'
      ? toMoney(profile.amount)
      : toMoney(normalizedSubtotal * (Number(profile.amount || 0) / 100));
    const diff = Math.abs(expectedDiscount - discountValue);
    if (diff > 0.05) return;
    if (!bestMatch || diff < bestMatch.diff) {
      bestMatch = {
        diff,
        profile
      };
    }
  });

  return bestMatch?.profile || null;
}

function normalizeDiscountProfiles(profiles = []) {
  const source = Array.isArray(profiles)
    ? profiles
    : DEFAULT_DISCOUNT_PROFILES;
  const seenIds = new Set();
  return source.reduce((rows, profile, index) => {
    const normalized = normalizeDiscountProfile(profile, index);
    let nextId = normalized.id;
    let suffix = 2;
    while (seenIds.has(nextId)) {
      nextId = `${normalized.id}-${suffix}`;
      suffix += 1;
    }
    seenIds.add(nextId);
    rows.push({
      ...normalized,
      id: nextId
    });
    return rows;
  }, []);
}

function getCachedDiscountProfiles() {
  return normalizeDiscountProfiles(appConfigMemory?.discountProfiles);
}

function persistDiscountProfilesLocally(profiles = []) {
  const nextProfiles = normalizeDiscountProfiles(profiles);
  persistAppConfigLocally({
    ...appConfigMemory,
    discountProfiles: nextProfiles
  });
  return nextProfiles;
}

function toAppDiscountProfile(row = {}, index = 0) {
  return normalizeDiscountProfile({
    id: row?.id,
    name: row?.name,
    type: row?.type,
    amount: row?.amount
  }, index);
}

function buildDiscountProfileSupabasePayload(profile = {}, createdAt = null) {
  const normalized = normalizeDiscountProfile(profile);
  const now = new Date().toISOString();
  return {
    id: normalized.id,
    name: normalized.name,
    type: normalized.type,
    amount: normalized.amount,
    created_at: createdAt || now,
    updated_at: now
  };
}

function markDiscountProfilesTableMissing() {
  discountProfilesSupabaseTableMissing = true;
  if (!discountProfilesSupabaseMissingLogged) {
    console.warn('[DiscountProfiles] Supabase discount_profiles table is missing. Falling back to local discount storage.');
    discountProfilesSupabaseMissingLogged = true;
  }
}

function getDiscountProfilesTableMissingMessage() {
  return 'Supabase discount_profiles table is missing. Apply the latest Supabase migration to store discount types in Supabase.';
}

function normalizeRoleAccessEntries(entries = [], fallback = []) {
  const source = Array.isArray(entries) ? entries : fallback;
  const seenKeys = new Set();
  return source.reduce((rows, entry) => {
    const key = String(entry || '').trim().toLowerCase();
    if (!ROLE_ACCESS_KEYS.includes(key) || seenKeys.has(key)) return rows;
    seenKeys.add(key);
    rows.push(key);
    return rows;
  }, []);
}

function ensureRequiredRoleAccessEntries(entries = [], requiredEntries = []) {
  const rows = Array.isArray(entries) ? [...entries] : [];
  requiredEntries.forEach((entry) => {
    const key = String(entry || '').trim().toLowerCase();
    if (ROLE_ACCESS_KEYS.includes(key) && !rows.includes(key)) {
      rows.push(key);
    }
  });
  return rows;
}

function normalizeRoleAccessConfig(roleAccess = {}) {
  const source = roleAccess && typeof roleAccess === 'object' ? roleAccess : {};
  const encharge = ensureRequiredRoleAccessEntries(
    normalizeRoleAccessEntries(source?.encharge, DEFAULT_ROLE_ACCESS.encharge),
    ['shift_session_access', 'shift_monitor_access']
  );
  const supervisor = ensureRequiredRoleAccessEntries(
    normalizeRoleAccessEntries(source?.supervisor, DEFAULT_ROLE_ACCESS.supervisor),
    ['shift_session_access', 'shift_monitor_access']
  );
  return {
    encharge: encharge.length ? encharge : [...DEFAULT_ROLE_ACCESS.encharge],
    supervisor: supervisor.length ? supervisor : [...DEFAULT_ROLE_ACCESS.supervisor]
  };
}

function normalizeEPaymentDisabledReason(reason) {
  return String(reason || '').trim().replace(/\s+/g, ' ').slice(0, 160);
}

function normalizeEPaymentImageUrl(value, fallback = '') {
  const imageUrl = String(value || fallback || '').trim();
  if (!imageUrl) return '';
  if (imageUrl.length > 3_000_000) return '';
  if (/^data:image\//i.test(imageUrl)) return imageUrl;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/')) return imageUrl;
  return '';
}

function normalizeEPaymentMethodConfig(entry = {}, fallback = DEFAULT_EPAYMENT_SETTINGS.gcash) {
  const enabled = entry?.enabled !== false;
  const disabledReason = enabled
    ? ''
    : normalizeEPaymentDisabledReason(entry?.disabledReason || entry?.reason || fallback?.disabledReason || '');
  return {
    enabled,
    disabledReason,
    qrImageUrl: normalizeEPaymentImageUrl(entry?.qrImageUrl || entry?.imageUrl || fallback?.qrImageUrl || '')
  };
}

function normalizeEPaymentSettings(settings = {}) {
  const source = settings && typeof settings === 'object' ? settings : {};
  return {
    gcash: normalizeEPaymentMethodConfig(source?.gcash, DEFAULT_EPAYMENT_SETTINGS.gcash),
    paymaya: normalizeEPaymentMethodConfig(source?.paymaya || source?.maya, DEFAULT_EPAYMENT_SETTINGS.paymaya),
    scanQr: normalizeEPaymentMethodConfig(source?.scanQr || source?.scanqr || source?.qr, DEFAULT_EPAYMENT_SETTINGS.scanQr)
  };
}

function normalizeAppConfig(config = {}) {
  return {
    enforceKitSpec: config?.enforceKitSpec !== false,
    discountProfiles: normalizeDiscountProfiles(config?.discountProfiles),
    roleAccess: normalizeRoleAccessConfig(config?.roleAccess),
    ePaymentSettings: normalizeEPaymentSettings(config?.ePaymentSettings),
    receiptWorkflow: {
      autoOpenAfterPayment: config?.receiptWorkflow?.autoOpenAfterPayment === true
    }
  };
}

function readAppConfigFallback() {
  return normalizeAppConfig(readJsonFallbackFile(APP_CONFIG_FALLBACK_FILE, DEFAULT_APP_CONFIG));
}

function writeAppConfigFallback(config = {}) {
  writeJsonFallbackFile(
    APP_CONFIG_FALLBACK_FILE,
    normalizeAppConfig(config),
    '[Store] Failed to persist app config fallback'
  );
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

function normalizeTemplateName(name) {
  return String(name || '').trim().slice(0, 80);
}

function normalizeTemplateText(value, fallback, maxLength = 180) {
  const text = String(value || '').trim();
  return text ? text.slice(0, maxLength) : fallback;
}

function normalizeTemplateColor(value, fallback) {
  const color = String(value || '').trim();
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : fallback;
}

function normalizeTemplateAlign(value, fallback = 'center') {
  const align = String(value || '').trim().toLowerCase();
  return ['left', 'center', 'right'].includes(align) ? align : fallback;
}

function normalizeTemplateBorderStyle(value, fallback = 'dashed') {
  const style = String(value || '').trim().toLowerCase();
  return ['solid', 'dashed', 'dotted', 'none'].includes(style) ? style : fallback;
}

function normalizeTemplateFontFamily(value, fallback = DEFAULT_RECEIPT_TEMPLATE_SETTINGS.fontFamily) {
  const fontFamily = String(value || '').trim().slice(0, 120);
  return fontFamily || fallback;
}

function normalizeReceiptTemplateSettings(settings = {}) {
  return {
    paperWidthMm: clampNumber(settings?.paperWidthMm, 58, 100, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.paperWidthMm),
    paddingPx: clampNumber(settings?.paddingPx, 0, 32, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.paddingPx),
    borderRadiusPx: clampNumber(settings?.borderRadiusPx, 0, 32, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.borderRadiusPx),
    fontFamily: normalizeTemplateFontFamily(settings?.fontFamily),
    baseFontSizePx: clampNumber(settings?.baseFontSizePx, 10, 20, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.baseFontSizePx),
    titleFontSizePx: clampNumber(settings?.titleFontSizePx, 14, 36, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.titleFontSizePx),
    metaFontSizePx: clampNumber(settings?.metaFontSizePx, 10, 18, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.metaFontSizePx),
    totalFontSizePx: clampNumber(settings?.totalFontSizePx, 12, 28, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.totalFontSizePx),
    sectionGapPx: clampNumber(settings?.sectionGapPx, 4, 24, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.sectionGapPx),
    logoUrl: normalizeTemplateText(settings?.logoUrl, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.logoUrl, 240),
    showLogo: settings?.showLogo !== false,
    logoWidthPx: clampNumber(settings?.logoWidthPx, 32, 180, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.logoWidthPx),
    headerAlign: normalizeTemplateAlign(settings?.headerAlign, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.headerAlign),
    footerAlign: normalizeTemplateAlign(settings?.footerAlign, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.footerAlign),
    backgroundColor: normalizeTemplateColor(settings?.backgroundColor, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.backgroundColor),
    textColor: normalizeTemplateColor(settings?.textColor, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.textColor),
    accentColor: normalizeTemplateColor(settings?.accentColor, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.accentColor),
    mutedColor: normalizeTemplateColor(settings?.mutedColor, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.mutedColor),
    borderColor: normalizeTemplateColor(settings?.borderColor, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.borderColor),
    borderStyle: normalizeTemplateBorderStyle(settings?.borderStyle, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.borderStyle),
    dividerStyle: normalizeTemplateBorderStyle(settings?.dividerStyle, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.dividerStyle),
    orderSlipTitle: normalizeTemplateText(settings?.orderSlipTitle, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.orderSlipTitle, 60),
    storeName: normalizeTemplateText(settings?.storeName, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.storeName, 80),
    storeAddress: normalizeTemplateText(settings?.storeAddress, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.storeAddress, 180),
    taxLine: normalizeTemplateText(settings?.taxLine, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.taxLine, 180),
    showDiscountProfileType: settings?.showDiscountProfileType !== false,
    discountProfileLabel: normalizeTemplateText(settings?.discountProfileLabel, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.discountProfileLabel, 80),
    footerMessage: normalizeTemplateText(settings?.footerMessage, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.footerMessage, 220),
    extraMessage: normalizeTemplateText(settings?.extraMessage, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.extraMessage, 360),
    extraMessageAlign: normalizeTemplateAlign(settings?.extraMessageAlign, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.extraMessageAlign),
    extraMessageStyle: normalizeTemplateBorderStyle(settings?.extraMessageStyle, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.extraMessageStyle),
    footerFontSizePx: clampNumber(settings?.footerFontSizePx, 10, 24, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.footerFontSizePx || 12),
    footerTopSpacingPx: clampNumber(settings?.footerTopSpacingPx, 0, 48, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.footerTopSpacingPx || 12),
    headerTopPaddingPx: clampNumber(settings?.headerTopPaddingPx, 0, 48, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.headerTopPaddingPx || 0),
    headerOffsetX: clampNumber(settings?.headerOffsetX, -120, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.headerOffsetX || 0),
    headerOffsetY: clampNumber(settings?.headerOffsetY, -80, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.headerOffsetY || 0),
    metaOffsetX: clampNumber(settings?.metaOffsetX, -120, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.metaOffsetX || 0),
    metaOffsetY: clampNumber(settings?.metaOffsetY, -80, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.metaOffsetY || 0),
    itemsOffsetX: clampNumber(settings?.itemsOffsetX, -120, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.itemsOffsetX || 0),
    itemsOffsetY: clampNumber(settings?.itemsOffsetY, -80, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.itemsOffsetY || 0),
    totalsOffsetX: clampNumber(settings?.totalsOffsetX, -120, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.totalsOffsetX || 0),
    totalsOffsetY: clampNumber(settings?.totalsOffsetY, -80, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.totalsOffsetY || 0),
    footerOffsetX: clampNumber(settings?.footerOffsetX, -120, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.footerOffsetX || 0),
    footerOffsetY: clampNumber(settings?.footerOffsetY, -80, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.footerOffsetY || 0),
    extraMessageOffsetX: clampNumber(settings?.extraMessageOffsetX, -120, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.extraMessageOffsetX || 0),
    extraMessageOffsetY: clampNumber(settings?.extraMessageOffsetY, -80, 120, DEFAULT_RECEIPT_TEMPLATE_SETTINGS.extraMessageOffsetY || 0)
  };
}

function createDefaultReceiptTemplate() {
  const now = new Date().toISOString();
  return {
    id: DEFAULT_RECEIPT_TEMPLATE_ID,
    name: 'Classic Official',
    settings: normalizeReceiptTemplateSettings(DEFAULT_RECEIPT_TEMPLATE_SETTINGS),
    isActive: true,
    createdAt: now,
    updatedAt: now
  };
}

function normalizeReceiptTemplateRecord(record = {}) {
  const base = createDefaultReceiptTemplate();
  return {
    id: String(record?.id || base.id).trim() || base.id,
    name: normalizeTemplateName(record?.name || base.name) || base.name,
    settings: normalizeReceiptTemplateSettings(record?.settings || record?.config || record?.template || {}),
    isActive: Boolean(record?.isActive),
    createdAt: String(record?.createdAt || base.createdAt),
    updatedAt: String(record?.updatedAt || base.updatedAt)
  };
}

function toAppReceiptTemplate(row) {
  let settings = row?.config_json ?? row?.settings_json;
  if (typeof settings === 'string') {
    try {
      settings = JSON.parse(settings);
    } catch (_error) {
      settings = {};
    }
  }
  return normalizeReceiptTemplateRecord({
    id: row?.id,
    name: row?.name,
    settings,
    isActive: row?.is_active,
    createdAt: row?.created_at,
    updatedAt: row?.updated_at
  });
}

function parseStoredAppConfigValue(rawValue) {
  if (!rawValue) return null;
  let value = rawValue;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (_error) {
      return null;
    }
  }
  return value && typeof value === 'object' ? value : null;
}

function persistAppConfigLocally(config = {}) {
  const nextConfig = normalizeAppConfig(config);
  appConfigMemory = { ...nextConfig };
  appConfigLoadedFromLocal = true;

  if (upsertAppConfigStmt) {
    try {
      upsertAppConfigStmt.run({
        key: APP_CONFIG_KEY,
        valueJson: JSON.stringify(nextConfig),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.warn('[Store] Failed to persist app config to SQLite:', error.message);
    }
  } else {
    writeAppConfigFallback(nextConfig);
  }

  return { ...nextConfig };
}

function loadAppConfigFromLocalCache() {
  if (getAppConfigStmt) {
    try {
      const row = getAppConfigStmt.get(APP_CONFIG_KEY);
      if (row?.value_json) {
        const parsedValue = parseStoredAppConfigValue(row.value_json);
        if (parsedValue) {
          appConfigMemory = normalizeAppConfig(parsedValue);
        }
      }
    } catch (error) {
      console.warn('[Store] Failed to read app config from SQLite:', error.message);
    }
  } else {
    appConfigMemory = readAppConfigFallback();
  }

  appConfigLoadedFromLocal = true;
  return { ...appConfigMemory };
}

async function writeAppConfigToSupabase(config = {}) {
  if (!isSupabaseEnabled() || !supabase || appConfigSupabaseTableMissing) {
    return false;
  }

  const nextConfig = normalizeAppConfig(config);
  const { error } = await supabase
    .from(APP_SETTINGS_TABLE)
    .upsert({
      key: APP_CONFIG_KEY,
      value_json: nextConfig,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'key'
    });

  if (error) {
    if (isMissingSupabaseTableError(error, APP_SETTINGS_TABLE)) {
      appConfigSupabaseTableMissing = true;
      if (!appConfigSupabaseMissingLogged) {
        console.warn('[AppConfig] Supabase app_settings table is missing. Falling back to local app config storage.');
        appConfigSupabaseMissingLogged = true;
      }
      return false;
    }
    throw error;
  }

  markSupabaseReadHealthy();
  appConfigLastSyncedAt = Date.now();
  return true;
}

async function ensureAppConfigLoaded({ force = false } = {}) {
  if (!appConfigLoadedFromLocal) {
    loadAppConfigFromLocalCache();
  }

  if (!isSupabaseEnabled() || !supabase || appConfigSupabaseTableMissing) {
    return { ...appConfigMemory };
  }

  if (!force && appConfigLastSyncedAt && (Date.now() - appConfigLastSyncedAt) < APP_CONFIG_SYNC_TTL_MS) {
    return { ...appConfigMemory };
  }

  if (appConfigSyncPromise) {
    return appConfigSyncPromise;
  }

  appConfigSyncPromise = (async () => {
    if (!canAttemptSupabaseRead()) {
      return { ...appConfigMemory };
    }

    try {
      const { data, error } = await supabase
        .from(APP_SETTINGS_TABLE)
        .select('value_json,updated_at')
        .eq('key', APP_CONFIG_KEY)
        .maybeSingle();
      if (error) {
        throw error;
      }

      if (!data?.value_json) {
        await writeAppConfigToSupabase(appConfigMemory);
        return { ...appConfigMemory };
      }

      const parsedValue = parseStoredAppConfigValue(data.value_json) || DEFAULT_APP_CONFIG;
      const nextConfig = normalizeAppConfig(parsedValue);
      persistAppConfigLocally(nextConfig);
      markSupabaseReadHealthy();
      appConfigLastSyncedAt = Date.now();
      return { ...nextConfig };
    } catch (error) {
      if (isMissingSupabaseTableError(error, APP_SETTINGS_TABLE)) {
        appConfigSupabaseTableMissing = true;
        if (!appConfigSupabaseMissingLogged) {
          console.warn('[AppConfig] Supabase app_settings table is missing. Falling back to local app config storage.');
          appConfigSupabaseMissingLogged = true;
        }
        return { ...appConfigMemory };
      }
      markSupabaseReadFailure('app config sync', error);
      return { ...appConfigMemory };
    } finally {
      appConfigSyncPromise = null;
    }
  })();

  return appConfigSyncPromise;
}

function buildAppConfigSnapshot(config = appConfigMemory, discountProfiles = getCachedDiscountProfiles()) {
  return normalizeAppConfig({
    ...(config && typeof config === 'object' ? config : {}),
    discountProfiles
  });
}

function getAppConfig() {
  if (!appConfigLoadedFromLocal) {
    loadAppConfigFromLocalCache();
  }
  return buildAppConfigSnapshot(appConfigMemory);
}

function validateDiscountProfileInput({ name, type, amount } = {}) {
  const nextName = String(name || '').trim().slice(0, 60);
  const nextType = String(type || '').trim().toLowerCase() === 'fixed' ? 'fixed' : 'percent';
  const nextAmount = Number(amount);

  if (!nextName) {
    throw new Error('Discount name is required.');
  }

  if (!Number.isFinite(nextAmount) || nextAmount < 0 || (nextType === 'percent' && nextAmount > 100)) {
    throw new Error(nextType === 'fixed'
      ? 'Minus discount amount must be 0 or more.'
      : 'Discount percent must be between 0 and 100.');
  }

  return {
    name: nextName,
    type: nextType,
    amount: nextAmount
  };
}

async function seedDiscountProfilesInSupabase(profiles = getCachedDiscountProfiles()) {
  const seedProfiles = normalizeDiscountProfiles(profiles);
  const payload = seedProfiles.map((profile) => buildDiscountProfileSupabasePayload(profile));
  if (payload.length) {
    const { error } = await supabase
      .from(DISCOUNT_PROFILES_TABLE)
      .upsert(payload, { onConflict: 'id' });
    if (error) {
      throw error;
    }
  }
  persistDiscountProfilesLocally(seedProfiles);
  markSupabaseReadHealthy();
  discountProfilesLastSyncedAt = Date.now();
  return seedProfiles;
}

async function ensureDiscountProfilesLoaded({ force = false } = {}) {
  if (!appConfigLoadedFromLocal) {
    loadAppConfigFromLocalCache();
  }

  if (!isSupabaseEnabled() || !supabase || discountProfilesSupabaseTableMissing) {
    return getCachedDiscountProfiles();
  }

  if (!force && discountProfilesLastSyncedAt && (Date.now() - discountProfilesLastSyncedAt) < DISCOUNT_PROFILE_SYNC_TTL_MS) {
    return getCachedDiscountProfiles();
  }

  if (discountProfilesSyncPromise) {
    return discountProfilesSyncPromise;
  }

  discountProfilesSyncPromise = (async () => {
    if (!canAttemptSupabaseRead()) {
      return getCachedDiscountProfiles();
    }

    try {
      const { data, error } = await supabase
        .from(DISCOUNT_PROFILES_TABLE)
        .select('id,name,type,amount,created_at,updated_at')
        .order('created_at', { ascending: true })
        .order('name', { ascending: true });
      if (error) {
        throw error;
      }

      if (!Array.isArray(data) || !data.length) {
        return seedDiscountProfilesInSupabase(getCachedDiscountProfiles());
      }

      const profiles = normalizeDiscountProfiles((data || []).map((row, index) => toAppDiscountProfile(row, index)));
      persistDiscountProfilesLocally(profiles);
      markSupabaseReadHealthy();
      discountProfilesLastSyncedAt = Date.now();
      return profiles;
    } catch (error) {
      if (isMissingSupabaseTableError(error, DISCOUNT_PROFILES_TABLE)) {
        markDiscountProfilesTableMissing();
        return getCachedDiscountProfiles();
      }
      markSupabaseReadFailure('discount profiles sync', error);
      return getCachedDiscountProfiles();
    } finally {
      discountProfilesSyncPromise = null;
    }
  })();

  return discountProfilesSyncPromise;
}

async function replaceDiscountProfiles(profiles = []) {
  const nextProfiles = normalizeDiscountProfiles(profiles);

  if (!isSupabaseEnabled() || !supabase) {
    persistDiscountProfilesLocally(nextProfiles);
    return nextProfiles;
  }

  if (discountProfilesSupabaseTableMissing) {
    throw new Error(getDiscountProfilesTableMissingMessage());
  }

  try {
    const { data: existingRows, error: existingError } = await supabase
      .from(DISCOUNT_PROFILES_TABLE)
      .select('id');
    if (existingError) {
      throw existingError;
    }

    const payload = nextProfiles.map((profile) => buildDiscountProfileSupabasePayload(profile));
    if (payload.length) {
      const { error: upsertError } = await supabase
        .from(DISCOUNT_PROFILES_TABLE)
        .upsert(payload, { onConflict: 'id' });
      if (upsertError) {
        throw upsertError;
      }
    }

    const existingIds = new Set((existingRows || []).map((row) => String(row?.id || '').trim()).filter(Boolean));
    const nextIds = new Set(nextProfiles.map((profile) => profile.id));
    const idsToDelete = Array.from(existingIds).filter((id) => !nextIds.has(id));
    if (idsToDelete.length) {
      const { error: deleteError } = await supabase
        .from(DISCOUNT_PROFILES_TABLE)
        .delete()
        .in('id', idsToDelete);
      if (deleteError) {
        throw deleteError;
      }
    }

    persistDiscountProfilesLocally(nextProfiles);
    markSupabaseReadHealthy();
    discountProfilesLastSyncedAt = Date.now();
    return nextProfiles;
  } catch (error) {
    if (isMissingSupabaseTableError(error, DISCOUNT_PROFILES_TABLE)) {
      markDiscountProfilesTableMissing();
      throw new Error(getDiscountProfilesTableMissingMessage());
    }
    throw error;
  }
}

async function updateAppConfig(patch = {}, { ensureFresh = true } = {}) {
  if (ensureFresh) {
    await ensureAppConfigLoaded({ force: true });
  }

  const safePatch = patch && typeof patch === 'object' ? { ...patch } : {};
  const requestedDiscountProfiles = safePatch.discountProfiles !== undefined
    ? normalizeDiscountProfiles(safePatch.discountProfiles)
    : null;
  delete safePatch.discountProfiles;

  const activeDiscountProfiles = requestedDiscountProfiles || await ensureDiscountProfilesLoaded({ force: ensureFresh });
  const nextConfig = buildAppConfigSnapshot({
    ...appConfigMemory,
    ...safePatch
  }, activeDiscountProfiles);

  persistAppConfigLocally(nextConfig);

  if (isSupabaseEnabled() && !appConfigSupabaseTableMissing) {
    try {
      await writeAppConfigToSupabase(nextConfig);
    } catch (error) {
      throw new Error(`Supabase app config update failed: ${sanitizeSupabaseErrorMessage(error)}`);
    }
  }

  if (requestedDiscountProfiles) {
    try {
      await replaceDiscountProfiles(requestedDiscountProfiles);
    } catch (error) {
      throw new Error(`Supabase discount profile update failed: ${sanitizeSupabaseErrorMessage(error)}`);
    }
  }

  return getAppConfig();
}

function buildDiscountProfileUsageMap(rows = []) {
  const usageById = new Map();
  const trackedStatuses = new Set(['PAID', 'HOLD_FOR_VOID', 'VOIDED']);

  (rows || []).forEach((row) => {
    const normalizedStatus = normalizeInvoiceStatus(row?.status);
    if (!trackedStatuses.has(normalizedStatus)) return;

    const profile = parseStoredDiscountProfile(
      row?.discount_profile_json
      ?? row?.discountProfile
      ?? row?.discount_profile
      ?? null
    ) || normalizeInvoiceDiscountProfile(row?.discountProfile);
    if (!profile?.id) return;

    const usage = usageById.get(profile.id) || {
      usageCount: 0,
      lastUsedAt: null
    };
    usage.usageCount += 1;

    const usedAt = row?.created_at || row?.createdAt || row?.updated_at || row?.updatedAt || null;
    if (usedAt && (!usage.lastUsedAt || new Date(usedAt) > new Date(usage.lastUsedAt))) {
      usage.lastUsedAt = usedAt;
    }

    usageById.set(profile.id, usage);
  });

  return usageById;
}

async function getDiscountProfileUsageMap() {
  if (canAttemptSupabaseRead()) {
    try {
      const { data, error } = await supabase
        .from('pos_invoices')
        .select('status,created_at,updated_at,discount_profile_json');
      if (error) {
        throw error;
      }
      return buildDiscountProfileUsageMap(data || []);
    } catch (error) {
      console.warn('[DiscountProfiles] Supabase usage lookup failed, using in-memory fallback:', error.message);
    }
  }

  return buildDiscountProfileUsageMap(Array.from(invoices.values()));
}

async function listDiscountManagerProfiles() {
  const profiles = await ensureDiscountProfilesLoaded();
  const usageById = await getDiscountProfileUsageMap();

  return profiles.map((profile) => {
    const usage = usageById.get(profile.id);
    const usageCount = Number(usage?.usageCount || 0);
    return {
      ...profile,
      usageCount,
      lastUsedAt: usage?.lastUsedAt || null,
      canDelete: usageCount === 0
    };
  });
}

async function createDiscountProfile({ name, type, amount }) {
  await ensureAppConfigLoaded({ force: true });
  const profiles = await ensureDiscountProfilesLoaded({ force: true });
  const input = validateDiscountProfileInput({ name, type, amount });
  const profile = normalizeDiscountProfile({
    id: `${normalizeDiscountProfileId(input.name)}-${Date.now()}`,
    ...input
  }, profiles.length);
  let savedProfile = profile;

  if (isSupabaseEnabled() && supabase && !discountProfilesSupabaseTableMissing) {
    try {
      const { data, error } = await supabase
        .from(DISCOUNT_PROFILES_TABLE)
        .insert(buildDiscountProfileSupabasePayload(profile))
        .select('id,name,type,amount,created_at,updated_at')
        .single();
      if (error) {
        throw error;
      }
      savedProfile = toAppDiscountProfile(data, profiles.length);
      persistDiscountProfilesLocally([...profiles, savedProfile]);
      markSupabaseReadHealthy();
      discountProfilesLastSyncedAt = Date.now();
    } catch (error) {
      if (isMissingSupabaseTableError(error, DISCOUNT_PROFILES_TABLE)) {
        markDiscountProfilesTableMissing();
        throw new Error(getDiscountProfilesTableMissingMessage());
      } else {
        throw new Error(`Supabase discount profile create failed: ${sanitizeSupabaseErrorMessage(error)}`);
      }
    }
  } else if (isSupabaseEnabled() && discountProfilesSupabaseTableMissing) {
    throw new Error(getDiscountProfilesTableMissingMessage());
  } else {
    persistDiscountProfilesLocally([...profiles, profile]);
  }

  return {
    profile: savedProfile,
    appConfig: getAppConfig()
  };
}

async function updateDiscountProfile(profileId, { name, type, amount }) {
  const safeProfileId = String(profileId || '').trim();
  if (!safeProfileId) {
    throw new Error('Discount profile id is required.');
  }

  await ensureAppConfigLoaded({ force: true });
  const profiles = await ensureDiscountProfilesLoaded({ force: true });
  const existing = profiles.find((profile) => profile.id === safeProfileId);
  if (!existing) {
    throw new Error('Discount profile not found.');
  }

  const input = validateDiscountProfileInput({ name, type, amount });
  const profile = normalizeDiscountProfile({
    ...existing,
    ...input
  });
  let savedProfile = profile;

  if (isSupabaseEnabled() && supabase && !discountProfilesSupabaseTableMissing) {
    try {
      const { data, error } = await supabase
        .from(DISCOUNT_PROFILES_TABLE)
        .update({
          name: profile.name,
          type: profile.type,
          amount: profile.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', safeProfileId)
        .select('id,name,type,amount,created_at,updated_at')
        .single();
      if (error) {
        throw error;
      }
      savedProfile = toAppDiscountProfile(data, profiles.findIndex((row) => row.id === safeProfileId));
      persistDiscountProfilesLocally(profiles.map((row) => (row.id === safeProfileId ? savedProfile : row)));
      markSupabaseReadHealthy();
      discountProfilesLastSyncedAt = Date.now();
    } catch (error) {
      if (isMissingSupabaseTableError(error, DISCOUNT_PROFILES_TABLE)) {
        markDiscountProfilesTableMissing();
        throw new Error(getDiscountProfilesTableMissingMessage());
      } else {
        throw new Error(`Supabase discount profile update failed: ${sanitizeSupabaseErrorMessage(error)}`);
      }
    }
  } else if (isSupabaseEnabled() && discountProfilesSupabaseTableMissing) {
    throw new Error(getDiscountProfilesTableMissingMessage());
  } else {
    persistDiscountProfilesLocally(profiles.map((row) => (row.id === safeProfileId ? profile : row)));
  }

  return {
    profile: savedProfile,
    appConfig: getAppConfig()
  };
}

async function deleteDiscountProfile(profileId) {
  const safeProfileId = String(profileId || '').trim();
  if (!safeProfileId) {
    throw new Error('Discount profile id is required.');
  }

  await ensureAppConfigLoaded({ force: true });
  const profiles = await ensureDiscountProfilesLoaded({ force: true });
  const existing = profiles.find((profile) => profile.id === safeProfileId);
  if (!existing) {
    throw new Error('Discount profile not found.');
  }

  const usageById = await getDiscountProfileUsageMap();
  const usage = usageById.get(safeProfileId);
  if (Number(usage?.usageCount || 0) > 0) {
    throw new Error('This discount type cannot be deleted because it is already used in transaction history.');
  }

  if (isSupabaseEnabled() && supabase && !discountProfilesSupabaseTableMissing) {
    try {
      const { error } = await supabase
        .from(DISCOUNT_PROFILES_TABLE)
        .delete()
        .eq('id', safeProfileId);
      if (error) {
        throw error;
      }
      markSupabaseReadHealthy();
      discountProfilesLastSyncedAt = Date.now();
    } catch (error) {
      if (isMissingSupabaseTableError(error, DISCOUNT_PROFILES_TABLE)) {
        markDiscountProfilesTableMissing();
        throw new Error(getDiscountProfilesTableMissingMessage());
      } else {
        throw new Error(`Supabase discount profile delete failed: ${sanitizeSupabaseErrorMessage(error)}`);
      }
    }
  } else if (isSupabaseEnabled() && discountProfilesSupabaseTableMissing) {
    throw new Error(getDiscountProfilesTableMissingMessage());
  }

  persistDiscountProfilesLocally(profiles.filter((profile) => profile.id !== safeProfileId));

  return {
    profile: existing,
    appConfig: getAppConfig()
  };
}

async function ensureReceiptTemplateDefaults() {
  const defaultTemplate = createDefaultReceiptTemplate();

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('receipt_templates')
      .select('*')
      .order('is_active', { ascending: false })
      .order('updated_at', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Supabase receipt template lookup failed: ${error.message}`);
    }

    if (!Array.isArray(data) || !data.length) {
      const payload = {
        id: defaultTemplate.id,
        name: defaultTemplate.name,
        config_json: defaultTemplate.settings,
        is_active: true,
        created_at: defaultTemplate.createdAt,
        updated_at: defaultTemplate.updatedAt
      };
      const { error: insertError } = await supabase
        .from('receipt_templates')
        .insert(payload);
      if (insertError) {
        throw new Error(`Supabase receipt template seed failed: ${insertError.message}`);
      }
      return;
    }

    if (!data.some((row) => Boolean(row?.is_active))) {
      const firstTemplateId = String(data[0]?.id || '').trim();
      if (firstTemplateId) {
        const { error: clearError } = await supabase
          .from('receipt_templates')
          .update({ is_active: false })
          .neq('id', '');
        if (clearError) {
          throw new Error(`Supabase receipt template reset failed: ${clearError.message}`);
        }
        const { error: activateError } = await supabase
          .from('receipt_templates')
          .update({ is_active: true })
          .eq('id', firstTemplateId);
        if (activateError) {
          throw new Error(`Supabase receipt template activation failed: ${activateError.message}`);
        }
      }
    }

    return;
  }

  if (listReceiptTemplatesStmt && upsertReceiptTemplateStmt) {
    const rows = listReceiptTemplatesStmt.all();
    if (!rows.length) {
      upsertReceiptTemplateStmt.run({
        id: defaultTemplate.id,
        name: defaultTemplate.name,
        settingsJson: JSON.stringify(defaultTemplate.settings),
        isActive: 1,
        createdAt: defaultTemplate.createdAt,
        updatedAt: defaultTemplate.updatedAt
      });
      return;
    }

    if (!rows.some((row) => Number(row?.is_active || 0) === 1) && activateReceiptTemplateStmt) {
      activateReceiptTemplateStmt.run({ id: String(rows[0].id || '') });
    }
    return;
  }

  if (!receiptTemplates.size) {
    receiptTemplates.set(defaultTemplate.id, defaultTemplate);
    return;
  }

  if (!Array.from(receiptTemplates.values()).some((row) => row.isActive)) {
    const firstTemplate = Array.from(receiptTemplates.values())[0];
    receiptTemplates.set(firstTemplate.id, { ...firstTemplate, isActive: true });
  }
}

async function listReceiptTemplates() {
  await ensureReceiptTemplateDefaults();

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('receipt_templates')
      .select('*')
      .order('is_active', { ascending: false })
      .order('updated_at', { ascending: false })
      .order('name', { ascending: true });
    if (error) {
      throw new Error(`Supabase receipt templates fetch failed: ${error.message}`);
    }
    return (data || []).map(toAppReceiptTemplate);
  }

  if (listReceiptTemplatesStmt) {
    return listReceiptTemplatesStmt.all().map(toAppReceiptTemplate);
  }

  return Array.from(receiptTemplates.values())
    .sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    })
    .map((row) => normalizeReceiptTemplateRecord(row));
}

async function getReceiptTemplateById(templateId) {
  const safeTemplateId = String(templateId || '').trim();
  if (!safeTemplateId) return null;

  if (isSupabaseEnabled()) {
    await ensureReceiptTemplateDefaults();
    const { data, error } = await supabase
      .from('receipt_templates')
      .select('*')
      .eq('id', safeTemplateId)
      .maybeSingle();
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase receipt template fetch failed: ${error.message}`);
    }
    return data ? toAppReceiptTemplate(data) : null;
  }

  if (getReceiptTemplateStmt) {
    const row = getReceiptTemplateStmt.get(safeTemplateId);
    return row ? toAppReceiptTemplate(row) : null;
  }

  return receiptTemplates.has(safeTemplateId)
    ? normalizeReceiptTemplateRecord(receiptTemplates.get(safeTemplateId))
    : null;
}

async function getActiveReceiptTemplate() {
  const templates = await listReceiptTemplates();
  return templates.find((template) => template.isActive) || templates[0] || createDefaultReceiptTemplate();
}

async function createReceiptTemplate({ name, settings }) {
  const safeName = normalizeTemplateName(name);
  if (!safeName) throw new Error('Template name is required.');

  const template = normalizeReceiptTemplateRecord({
    id: uuidv4(),
    name: safeName,
    settings,
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('receipt_templates')
      .insert({
        id: template.id,
        name: template.name,
        config_json: template.settings,
        is_active: false,
        created_at: template.createdAt,
        updated_at: template.updatedAt
      })
      .select('*')
      .single();
    if (error) {
      throw new Error(`Supabase receipt template create failed: ${error.message}`);
    }
    return toAppReceiptTemplate(data);
  }

  if (upsertReceiptTemplateStmt) {
    try {
      upsertReceiptTemplateStmt.run({
        id: template.id,
        name: template.name,
        settingsJson: JSON.stringify(template.settings),
        isActive: 0,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
      });
    } catch (error) {
      throw new Error(`SQLite receipt template create failed: ${error.message}`);
    }
    return template;
  }

  const duplicate = Array.from(receiptTemplates.values()).some((row) => String(row.name || '').toLowerCase() === template.name.toLowerCase());
  if (duplicate) throw new Error('Template name already exists.');
  receiptTemplates.set(template.id, template);
  return { ...template };
}

async function updateReceiptTemplate(templateId, { name, settings }) {
  const existing = await getReceiptTemplateById(templateId);
  if (!existing) throw new Error('Receipt template not found.');

  const safeName = normalizeTemplateName(name || existing.name);
  if (!safeName) throw new Error('Template name is required.');

  const template = normalizeReceiptTemplateRecord({
    ...existing,
    name: safeName,
    settings: {
      ...existing.settings,
      ...(settings && typeof settings === 'object' ? settings : {})
    },
    isActive: existing.isActive,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString()
  });

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('receipt_templates')
      .update({
        name: template.name,
        config_json: template.settings,
        updated_at: template.updatedAt
      })
      .eq('id', template.id)
      .select('*')
      .single();
    if (error) {
      throw new Error(`Supabase receipt template update failed: ${error.message}`);
    }
    return toAppReceiptTemplate(data);
  }

  if (upsertReceiptTemplateStmt) {
    try {
      upsertReceiptTemplateStmt.run({
        id: template.id,
        name: template.name,
        settingsJson: JSON.stringify(template.settings),
        isActive: template.isActive ? 1 : 0,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
      });
    } catch (error) {
      throw new Error(`SQLite receipt template update failed: ${error.message}`);
    }
    return template;
  }

  const duplicate = Array.from(receiptTemplates.values()).some((row) => String(row.id || '') !== template.id && String(row.name || '').toLowerCase() === template.name.toLowerCase());
  if (duplicate) throw new Error('Template name already exists.');
  receiptTemplates.set(template.id, template);
  return { ...template };
}

async function activateReceiptTemplate(templateId) {
  const existing = await getReceiptTemplateById(templateId);
  if (!existing) throw new Error('Receipt template not found.');

  if (isSupabaseEnabled()) {
    const { error: clearError } = await supabase
      .from('receipt_templates')
      .update({ is_active: false })
      .neq('id', '');
    if (clearError) {
      throw new Error(`Supabase receipt template reset failed: ${clearError.message}`);
    }
    const { data, error } = await supabase
      .from('receipt_templates')
      .update({ is_active: true })
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) {
      throw new Error(`Supabase receipt template activation failed: ${error.message}`);
    }
    return toAppReceiptTemplate(data);
  }

  if (activateReceiptTemplateStmt) {
    activateReceiptTemplateStmt.run({ id: existing.id });
    return getReceiptTemplateById(existing.id);
  }

  Array.from(receiptTemplates.values()).forEach((row) => {
    receiptTemplates.set(row.id, { ...row, isActive: row.id === existing.id });
  });
  return { ...receiptTemplates.get(existing.id) };
}

async function deleteReceiptTemplate(templateId) {
  const existing = await getReceiptTemplateById(templateId);
  if (!existing) throw new Error('Receipt template not found.');
  if (existing.isActive) {
    throw new Error('Activate another receipt template before deleting the current active template.');
  }

  const templates = await listReceiptTemplates();
  if (templates.length <= 1) {
    throw new Error('At least one receipt template must remain.');
  }

  if (isSupabaseEnabled()) {
    const { error } = await supabase
      .from('receipt_templates')
      .delete()
      .eq('id', existing.id);
    if (error) {
      throw new Error(`Supabase receipt template delete failed: ${error.message}`);
    }
    return existing;
  }

  if (deleteReceiptTemplateStmt) {
    deleteReceiptTemplateStmt.run(existing.id);
    return existing;
  }

  receiptTemplates.delete(existing.id);
  return existing;
}

function normalizeInvoiceStatus(status) {
  const normalized = String(status || '').trim().toUpperCase();
  return INVOICE_STATUSES.has(normalized) ? normalized : 'PENDING';
}

function hasRecordedInvoicePayment(payment) {
  if (!payment || typeof payment !== 'object') return false;
  if (String(payment.paidAt || '').trim()) return true;

  const amountPaid = Number(payment.amountPaid);
  if (Number.isFinite(amountPaid) && amountPaid > 0) return true;

  return Boolean(payment.providerReference || payment.success);
}

function resolveInvoiceStatus(status, payment) {
  const normalized = normalizeInvoiceStatus(status);
  if (normalized === 'PENDING' && hasRecordedInvoicePayment(payment)) {
    return 'PAID';
  }
  return normalized;
}

function isInvoiceTerminalStatus(status) {
  const normalized = normalizeInvoiceStatus(status);
  return normalized === 'PAID' || normalized === 'HOLD_FOR_VOID' || normalized === 'CANCELLED' || normalized === 'VOIDED';
}

function assertInvoiceStatusTransition(currentStatus, nextStatus) {
  const current = normalizeInvoiceStatus(currentStatus);
  const next = normalizeInvoiceStatus(nextStatus);

  if (current === next) return;

  if (next === 'CANCELLED') {
    if (current !== 'PENDING') {
      throw new Error('Only pending invoices can be cancelled.');
    }
    return;
  }

  if (next === 'VOIDED') {
    if (current !== 'PAID' && current !== 'HOLD_FOR_VOID') {
      throw new Error('Only paid invoices or hold-for-void invoices can be voided.');
    }
    return;
  }

  if (next === 'HOLD_FOR_VOID') {
    if (current !== 'PAID') {
      throw new Error('Only paid invoices can be placed on hold for void.');
    }
    return;
  }

  if (next === 'PAID') {
    if (current === 'PAID') return;
    if (current !== 'PENDING') {
      throw new Error(`Invoice cannot be marked paid from status ${current}.`);
    }
    return;
  }

  throw new Error(`Unsupported invoice status transition to ${next}.`);
}

function normalizeSortOrder(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n);
  return Math.max(0, Math.min(PG_INT_MAX, rounded));
}

async function getNextCategorySortOrder() {
  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: false })
      .limit(1);
    if (error) throw new Error(`Supabase category sort lookup failed: ${error.message}`);
    const currentMax = Number(data?.[0]?.sort_order || 0);
    return Math.min(PG_INT_MAX, currentMax + 10);
  }

  const currentMax = Math.max(0, ...Array.from(menuCategories.values()).map((x) => Number(x.sortOrder || 0)));
  return Math.min(PG_INT_MAX, currentMax + 10);
}

async function getNextProductSortOrder(categoryKey = null) {
  if (isSupabaseEnabled()) {
    if (categoryKey) {
      const { data: categoryData, error: categoryErr } = await supabase
        .from('menu_categories')
        .select('id')
        .eq('category_key', categoryKey)
        .eq('is_active', true)
        .maybeSingle();
      if (categoryErr) throw new Error(`Supabase category sort lookup failed: ${categoryErr.message}`);
      if (!categoryData) return 10;

      const { data, error } = await supabase
        .from('menu_products')
        .select('sort_order')
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: false })
        .limit(1);
      if (error) throw new Error(`Supabase product sort lookup failed: ${error.message}`);
      const currentMax = Number(data?.[0]?.sort_order || 0);
      return Math.min(PG_INT_MAX, currentMax + 10);
    }

    const { data, error } = await supabase
      .from('menu_products')
      .select('sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: false })
      .limit(1);
    if (error) throw new Error(`Supabase product sort lookup failed: ${error.message}`);
    const currentMax = Number(data?.[0]?.sort_order || 0);
    return Math.min(PG_INT_MAX, currentMax + 10);
  }

  const products = categoryKey
    ? DEFAULT_PRODUCTS.filter((x) => String(x.category || '').toLowerCase() === String(categoryKey || '').toLowerCase())
    : DEFAULT_PRODUCTS;
  const currentMax = Math.max(0, products.length * 10);
  return Math.min(PG_INT_MAX, currentMax + 10);
}

async function seedMenuCatalogIfEmpty() {
  if (!isSupabaseEnabled()) return;

  const [{ count: categoryCount, error: categoryCountErr }, { count: productCount, error: productCountErr }] = await Promise.all([
    supabase.from('menu_categories').select('id', { count: 'exact', head: true }),
    supabase.from('menu_products').select('id', { count: 'exact', head: true })
  ]);

  if (categoryCountErr) throw new Error(`Supabase menu category count failed: ${categoryCountErr.message}`);
  if (productCountErr) throw new Error(`Supabase menu product count failed: ${productCountErr.message}`);

  if ((categoryCount || 0) > 0 || (productCount || 0) > 0) {
    return;
  }

  const now = new Date().toISOString();
  const categoryRows = DEFAULT_MENU_CATEGORIES.map((x) => ({
    id: uuidv4(),
    category_key: x.key,
    category_name: x.name,
    image_url: x.image,
    sort_order: x.sortOrder,
    is_active: true,
    created_at: now,
    updated_at: now
  }));

  const { data: insertedCategories, error: categoryInsertErr } = await supabase
    .from('menu_categories')
    .insert(categoryRows)
    .select('id,category_key');

  if (categoryInsertErr) throw new Error(`Supabase menu category seed failed: ${categoryInsertErr.message}`);

  const categoryIdByKey = new Map((insertedCategories || []).map((x) => [x.category_key, x.id]));
  const productRows = DEFAULT_PRODUCTS
    .map((p, idx) => {
      const categoryId = categoryIdByKey.get(p.category);
      if (!categoryId) return null;
      return {
        id: p.id,
        category_id: categoryId,
        name: p.name,
        price: Number(p.price || 0),
        image_url: p.image || null,
        sort_order: (idx + 1) * 10,
        is_active: true,
        created_at: now,
        updated_at: now
      };
    })
    .filter(Boolean);

  if (!productRows.length) return;
  const { error: productInsertErr } = await supabase.from('menu_products').insert(productRows);
  if (productInsertErr) throw new Error(`Supabase menu product seed failed: ${productInsertErr.message}`);
}

async function listMenuCategories() {
  if (!canAttemptSupabaseRead()) {
    return listMenuCategoriesFallback();
  }

  try {
    await seedMenuCatalogIfEmpty();

    const { data, error } = await supabase
      .from('menu_categories')
      .select('category_key,category_name,image_url,sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('category_name', { ascending: true });

    if (error) throw new Error(`Supabase menu categories fetch failed: ${error.message}`);
    markSupabaseReadHealthy();
    return (data || []).map((x) => ({
      key: x.category_key,
      name: x.category_name,
      image: x.image_url || getDefaultCategoryByKey(x.category_key)?.image || '',
      sortOrder: Number(x.sort_order || 0)
    }));
  } catch (error) {
    markSupabaseReadFailure('listMenuCategories', error);
    return listMenuCategoriesFallback();
  }
}

async function listProducts() {
  if (!canAttemptSupabaseRead()) {
    return listProductsFallback();
  }

  try {
    await seedMenuCatalogIfEmpty();

    const { data, error } = await supabase
      .from('menu_products')
      .select(`
        id,
        name,
        price,
        image_url,
        sort_order,
        menu_categories!inner(category_key)
      `)
      .eq('is_active', true)
      .eq('menu_categories.is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw new Error(`Supabase products fetch failed: ${error.message}`);
    markSupabaseReadHealthy();

    return (data || []).map((x) => ({
      id: x.id,
      name: x.name,
      price: Number(x.price || 0),
      category: x.menu_categories?.category_key || 'main-dish',
      image: x.image_url || '/Business Logo/Ruels Logo for business.png'
    }));
  } catch (error) {
    markSupabaseReadFailure('listProducts', error);
    return listProductsFallback();
  }
}

async function createMenuCategory({ name, key, image, sortOrder }) {
  const categoryName = String(name || '').trim();
  if (!categoryName) {
    throw new Error('Category name is required');
  }

  const categoryKey = normalizeMenuCategoryKey(key || categoryName);
  if (!categoryKey) {
    throw new Error('Category key is invalid');
  }

  const imageUrl = String(image || '').trim() || getDefaultCategoryByKey(categoryKey)?.image || null;
  const safeSortOrder = normalizeSortOrder(sortOrder) ?? await getNextCategorySortOrder();

  if (isSupabaseEnabled()) {
    await seedMenuCatalogIfEmpty();

    const now = new Date().toISOString();
    const payload = {
      id: uuidv4(),
      category_key: categoryKey,
      category_name: categoryName,
      image_url: imageUrl,
      sort_order: safeSortOrder,
      is_active: true,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('menu_categories')
      .insert(payload)
      .select('category_key,category_name,image_url,sort_order')
      .single();

    if (error) {
      if (String(error.message || '').toLowerCase().includes('duplicate')) {
        throw new Error('Category key already exists');
      }
      throw new Error(`Supabase create category failed: ${error.message}`);
    }

    return {
      key: data.category_key,
      name: data.category_name,
      image: data.image_url || imageUrl || '',
      sortOrder: Number(data.sort_order || 0)
    };
  }

  ensureMenuCategoryDefaultsFallback();
  if (menuCategories.has(categoryKey)) {
    throw new Error('Category key already exists');
  }

  const category = { key: categoryKey, name: categoryName, image: imageUrl || '', sortOrder: safeSortOrder };
  menuCategories.set(categoryKey, category);
  return category;
}

async function updateMenuCategory(categoryKeyOrId, { name, image, sortOrder }) {
  const key = normalizeMenuCategoryKey(categoryKeyOrId);
  if (!key) throw new Error('Category key is required');

  const patch = {};
  if (name !== undefined) {
    const nextName = String(name || '').trim();
    if (!nextName) throw new Error('Category name cannot be empty');
    patch.category_name = nextName;
  }
  if (image !== undefined) {
    patch.image_url = String(image || '').trim() || null;
  }
  if (sortOrder !== undefined && sortOrder !== null) {
    const v = normalizeSortOrder(sortOrder);
    if (v === null) throw new Error('sortOrder must be a valid number');
    patch.sort_order = v;
  }

  if (!Object.keys(patch).length) {
    throw new Error('No category changes were provided');
  }

  if (isSupabaseEnabled()) {
    await seedMenuCatalogIfEmpty();
    const { data, error } = await supabase
      .from('menu_categories')
      .update(patch)
      .eq('category_key', key)
      .eq('is_active', true)
      .select('category_key,category_name,image_url,sort_order')
      .maybeSingle();

    if (error) throw new Error(`Supabase update category failed: ${error.message}`);
    if (!data) throw new Error('Category not found');

    return {
      key: data.category_key,
      name: data.category_name,
      image: data.image_url || '',
      sortOrder: Number(data.sort_order || 0)
    };
  }

  ensureMenuCategoryDefaultsFallback();
  const existing = menuCategories.get(key);
  if (!existing) throw new Error('Category not found');
  const next = { ...existing };
  if (patch.category_name !== undefined) next.name = patch.category_name;
  if (patch.image_url !== undefined) next.image = patch.image_url || '';
  if (patch.sort_order !== undefined) next.sortOrder = patch.sort_order;
  menuCategories.set(key, next);
  return next;
}

async function deleteMenuCategory(categoryKeyOrId) {
  const key = normalizeMenuCategoryKey(categoryKeyOrId);
  if (!key) throw new Error('Category key is required');

  if (isSupabaseEnabled()) {
    await seedMenuCatalogIfEmpty();

    const { data: categoryRow, error: categoryFindErr } = await supabase
      .from('menu_categories')
      .select('id,category_key,category_name')
      .eq('category_key', key)
      .eq('is_active', true)
      .maybeSingle();
    if (categoryFindErr) throw new Error(`Supabase category lookup failed: ${categoryFindErr.message}`);
    if (!categoryRow) throw new Error('Category not found');

    const { error: productDeactivateErr } = await supabase
      .from('menu_products')
      .update({ is_active: false })
      .eq('category_id', categoryRow.id)
      .eq('is_active', true);
    if (productDeactivateErr) throw new Error(`Supabase category products delete failed: ${productDeactivateErr.message}`);

    const { error: categoryDeactivateErr } = await supabase
      .from('menu_categories')
      .update({ is_active: false })
      .eq('id', categoryRow.id)
      .eq('is_active', true);
    if (categoryDeactivateErr) throw new Error(`Supabase category delete failed: ${categoryDeactivateErr.message}`);

    return {
      key: categoryRow.category_key,
      name: categoryRow.category_name
    };
  }

  ensureMenuCategoryDefaultsFallback();
  const existing = menuCategories.get(key);
  if (!existing) throw new Error('Category not found');

  menuCategories.delete(key);
  for (let i = DEFAULT_PRODUCTS.length - 1; i >= 0; i -= 1) {
    if (String(DEFAULT_PRODUCTS[i].category || '').toLowerCase() === key) {
      DEFAULT_PRODUCTS.splice(i, 1);
    }
  }

  return {
    key: existing.key,
    name: existing.name
  };
}

async function createMenuProduct({ name, price, category, image, sortOrder }) {
  const productName = String(name || '').trim();
  if (!productName) {
    throw new Error('Product name is required');
  }

  const productPrice = Number(price);
  if (!Number.isFinite(productPrice) || productPrice < 0) {
    throw new Error('Product price must be a number >= 0');
  }

  const categoryKey = normalizeMenuCategoryKey(category);
  if (!categoryKey) {
    throw new Error('Product category is required');
  }

  const imageUrl = String(image || '').trim() || '/Business Logo/Ruels Logo for business.png';
  const safeSortOrder = normalizeSortOrder(sortOrder) ?? await getNextProductSortOrder(categoryKey);

  if (isSupabaseEnabled()) {
    await seedMenuCatalogIfEmpty();

    const { data: dbCategory, error: categoryErr } = await supabase
      .from('menu_categories')
      .select('id,category_key')
      .eq('category_key', categoryKey)
      .eq('is_active', true)
      .maybeSingle();

    if (categoryErr) throw new Error(`Supabase category lookup failed: ${categoryErr.message}`);
    if (!dbCategory) throw new Error('Category not found');

    const now = new Date().toISOString();
    const payload = {
      id: uuidv4(),
      category_id: dbCategory.id,
      name: productName,
      price: productPrice,
      image_url: imageUrl,
      sort_order: safeSortOrder,
      is_active: true,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('menu_products')
      .insert(payload)
      .select(`
        id,
        name,
        price,
        image_url,
        menu_categories!inner(category_key)
      `)
      .single();

    if (error) throw new Error(`Supabase create product failed: ${error.message}`);

    return {
      id: data.id,
      name: data.name,
      price: Number(data.price || 0),
      category: data.menu_categories?.category_key || categoryKey,
      image: data.image_url || imageUrl
    };
  }

  const categories = listMenuCategoriesFallback();
  if (!categories.some((x) => x.key === categoryKey)) {
    throw new Error('Category not found');
  }

  const newProduct = {
    id: uuidv4(),
    name: productName,
    price: productPrice,
    category: categoryKey,
    image: imageUrl
  };
  DEFAULT_PRODUCTS.push(newProduct);
  return newProduct;
}

async function updateMenuProduct(productId, { name, price, image, category, sortOrder }) {
  const id = String(productId || '').trim();
  if (!id) throw new Error('Product id is required');

  const patch = {};
  if (name !== undefined) {
    const v = String(name || '').trim();
    if (!v) throw new Error('Product name cannot be empty');
    patch.name = v;
  }
  if (price !== undefined) {
    const v = Number(price);
    if (!Number.isFinite(v) || v < 0) throw new Error('Product price must be a number >= 0');
    patch.price = v;
  }
  if (image !== undefined) {
    patch.image_url = String(image || '').trim() || '/Business Logo/Ruels Logo for business.png';
  }
  if (sortOrder !== undefined && sortOrder !== null) {
    const v = normalizeSortOrder(sortOrder);
    if (v === null) throw new Error('sortOrder must be a valid number');
    patch.sort_order = v;
  }

  const categoryKey = category !== undefined ? normalizeMenuCategoryKey(category) : null;

  if (isSupabaseEnabled()) {
    await seedMenuCatalogIfEmpty();

    if (category !== undefined) {
      if (!categoryKey) throw new Error('Category is invalid');
      const { data: dbCategory, error: categoryErr } = await supabase
        .from('menu_categories')
        .select('id')
        .eq('category_key', categoryKey)
        .eq('is_active', true)
        .maybeSingle();
      if (categoryErr) throw new Error(`Supabase category lookup failed: ${categoryErr.message}`);
      if (!dbCategory) throw new Error('Category not found');
      patch.category_id = dbCategory.id;
    }

    if (!Object.keys(patch).length) {
      throw new Error('No product changes were provided');
    }

    const { data, error } = await supabase
      .from('menu_products')
      .update(patch)
      .eq('id', id)
      .eq('is_active', true)
      .select(`
        id,
        name,
        price,
        image_url,
        menu_categories!inner(category_key)
      `)
      .maybeSingle();

    if (error) throw new Error(`Supabase update product failed: ${error.message}`);
    if (!data) throw new Error('Product not found');

    return {
      id: data.id,
      name: data.name,
      price: Number(data.price || 0),
      category: data.menu_categories?.category_key || categoryKey || 'main-dish',
      image: data.image_url || '/Business Logo/Ruels Logo for business.png'
    };
  }

  const idx = DEFAULT_PRODUCTS.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Product not found');
  if (category !== undefined) {
    const categories = listMenuCategoriesFallback();
    if (!categories.some((x) => x.key === categoryKey)) {
      throw new Error('Category not found');
    }
  }

  const next = { ...DEFAULT_PRODUCTS[idx] };
  if (patch.name !== undefined) next.name = patch.name;
  if (patch.price !== undefined) next.price = patch.price;
  if (patch.image_url !== undefined) next.image = patch.image_url;
  if (category !== undefined) next.category = categoryKey;
  DEFAULT_PRODUCTS[idx] = next;
  return next;
}

async function deleteMenuProduct(productId) {
  const id = String(productId || '').trim();
  if (!id) throw new Error('Product id is required');

  if (isSupabaseEnabled()) {
    await seedMenuCatalogIfEmpty();

    const { data: existing, error: findErr } = await supabase
      .from('menu_products')
      .select('id,name')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();
    if (findErr) throw new Error(`Supabase product lookup failed: ${findErr.message}`);
    if (!existing) throw new Error('Product not found');

    const { error } = await supabase
      .from('menu_products')
      .update({ is_active: false })
      .eq('id', id)
      .eq('is_active', true);
    if (error) throw new Error(`Supabase delete product failed: ${error.message}`);

    return { id: existing.id, name: existing.name };
  }

  const idx = DEFAULT_PRODUCTS.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Product not found');
  const removed = DEFAULT_PRODUCTS[idx];
  DEFAULT_PRODUCTS.splice(idx, 1);
  return { id: removed.id, name: removed.name };
}

function toDbInvoice(invoice) {
  return {
    id: invoice.id,
    reference: invoice.reference,
    status: normalizeInvoiceStatus(invoice.status),
    status_reason: invoice.statusReason || null,
    status_changed_at: invoice.statusChangedAt || null,
    status_changed_by_user_id: invoice.statusChangedByUserId || null,
    status_changed_by_email: invoice.statusChangedByEmail || null,
    order_type: invoice.orderType || null,
    payment_method: invoice.paymentMethod,
    cashier_user_id: invoice.cashierUserId || null,
    cashier_email: invoice.cashierEmail || null,
    cashier_name: invoice.cashierName || null,
    cashier_role: invoice.cashierRole || null,
    subtotal_amount: toMoney(invoice.subtotal ?? invoice.total),
    discount_amount: toMoney(invoice.discount || 0),
    discount_profile_json: normalizeInvoiceDiscountProfile(invoice.discountProfile),
    total_amount: invoice.total,
    created_at: invoice.createdAt,
    updated_at: invoice.updatedAt
  };
}

function toAppInvoice(dbInvoice, lineItems, payment) {
  const computedSubtotal = lineItems.length
    ? toMoney(lineItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0))
    : Number(dbInvoice.subtotal_amount ?? dbInvoice.total_amount);
  const total = Number(dbInvoice.total_amount);
  const discount = Number(dbInvoice.discount_amount ?? toMoney(computedSubtotal - total));
  const discountProfile = inferDiscountProfileFromTotals({
    subtotal: computedSubtotal,
    total,
    discount,
    explicitProfile: parseStoredDiscountProfile(dbInvoice.discount_profile_json)
  });
  return {
    id: dbInvoice.id,
    reference: dbInvoice.reference,
    createdAt: dbInvoice.created_at,
    updatedAt: dbInvoice.updated_at,
    status: resolveInvoiceStatus(dbInvoice.status, payment),
    statusReason: dbInvoice.status_reason || null,
    statusChangedAt: dbInvoice.status_changed_at || null,
    statusChangedByUserId: dbInvoice.status_changed_by_user_id || null,
    statusChangedByEmail: dbInvoice.status_changed_by_email || null,
    orderType: dbInvoice.order_type || null,
    paymentMethod: dbInvoice.payment_method,
    cashierUserId: dbInvoice.cashier_user_id || null,
    cashierEmail: dbInvoice.cashier_email || null,
    cashierName: dbInvoice.cashier_name || null,
    cashierRole: dbInvoice.cashier_role || null,
    subtotal: computedSubtotal,
    discount,
    discountProfile,
    total,
    lineItems,
    payment
  };
}

function toDbLineItems(invoiceId, lineItems) {
  return lineItems.map((item, index) => ({
    id: item.lineId || uuidv5(`${invoiceId}:${item.productId}:${index}`, LINE_ITEM_UUID_NAMESPACE),
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
    lineId: item.id,
    productId: item.product_id,
    name: item.product_name,
    price: Number(item.unit_price),
    qty: Number(item.qty),
    subtotal: Number(item.subtotal)
  }));
}

function ensureInvoiceLineItemIds(invoice) {
  if (!invoice || !Array.isArray(invoice.lineItems)) return invoice;
  invoice.lineItems = invoice.lineItems.map((item, index) => ({
    ...item,
    lineId: item.lineId || uuidv5(`${invoice.id}:${item.productId}:${index}`, LINE_ITEM_UUID_NAMESPACE)
  }));
  return invoice;
}

function enqueueOfflineOpDeduped(type, payload, isDuplicate) {
  const existing = offlineQueue.getAll().filter((op) => op.type === type && isDuplicate(op));
  existing.forEach((op) => offlineQueue.remove(op.id));
  offlineQueue.enqueue(type, payload);
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

function shouldUseLegacyInvoiceSchema(error) {
  return /status_reason|status_changed_at|status_changed_by_user_id|status_changed_by_email|subtotal_amount|discount_amount|discount_profile_json/i.test(String(error?.message || error || ''));
}

function toDbInvoiceLegacy(invoice) {
  return {
    id: invoice.id,
    reference: invoice.reference,
    status: normalizeInvoiceStatus(invoice.status),
    order_type: invoice.orderType || null,
    payment_method: invoice.paymentMethod,
    cashier_user_id: invoice.cashierUserId || null,
    cashier_email: invoice.cashierEmail || null,
    cashier_name: invoice.cashierName || null,
    cashier_role: invoice.cashierRole || null,
    total_amount: invoice.total,
    created_at: invoice.createdAt,
    updated_at: invoice.updatedAt
  };
}

async function upsertInvoiceToSupabase(invoice) {
  const primaryResult = await supabase
    .from('pos_invoices')
    .upsert(toDbInvoice(invoice), { onConflict: 'id' });
  if (!primaryResult.error) return;
  if (!shouldUseLegacyInvoiceSchema(primaryResult.error)) {
    throw new Error(`Supabase invoice upsert failed: ${primaryResult.error.message}`);
  }

  const legacyResult = await supabase
    .from('pos_invoices')
    .upsert(toDbInvoiceLegacy(invoice), { onConflict: 'id' });
  if (legacyResult.error) {
    throw new Error(`Supabase invoice upsert failed: ${legacyResult.error.message}`);
  }
}

/**
 * Internal: persist invoice to Supabase only. Throws on error.
 * Used by persistInvoice() and syncOfflineQueue().
 */
async function _persistInvoiceToSupabase(invoice) {
  ensureInvoiceLineItemIds(invoice);

  await upsertInvoiceToSupabase(invoice);

  const { error: deleteItemsError } = await supabase
    .from('pos_invoice_items')
    .delete()
    .eq('invoice_id', invoice.id);
  if (deleteItemsError) throw new Error(`Supabase invoice-items cleanup failed: ${deleteItemsError.message}`);

  const dbItems = toDbLineItems(invoice.id, invoice.lineItems);
  const { error: itemsError } = await supabase.from('pos_invoice_items').insert(dbItems);
  if (itemsError) throw new Error(`Supabase invoice-items insert failed: ${itemsError.message}`);
}

/**
 * Persist invoice to Supabase. If Supabase is unreachable, queues for later sync.
 * Never throws — the in-memory invoice is always kept.
 */
async function persistInvoice(invoice) {
  if (!isSupabaseEnabled()) return;
  try {
    await _persistInvoiceToSupabase(invoice);
  } catch (error) {
    console.warn('[Offline] persistInvoice failed, queuing for sync:', error.message);
    enqueueOfflineOpDeduped(
      'persist_invoice',
      { invoice },
      (op) => op?.payload?.invoice?.id === invoice.id
    );
  }
}

function buildProductAvailabilityMap(products = [], ingredients = [], recipes = [], { enforceKitSpec = true } = {}) {
  const productById = new Map((products || []).map((product) => [String(product.id || '').trim(), product]));
  const ingredientById = new Map((ingredients || []).map((ingredient) => [String(ingredient.id || '').trim(), ingredient]));
  const recipesByProductId = new Map();

  (recipes || []).forEach((recipe) => {
    const productId = String(recipe.productId || '').trim();
    if (!productId) return;
    if (!recipesByProductId.has(productId)) recipesByProductId.set(productId, []);
    recipesByProductId.get(productId).push(recipe);
  });

  const availabilityByProductId = new Map();
  productById.forEach((product, productId) => {
    const productRecipes = recipesByProductId.get(productId) || [];
    if (!enforceKitSpec) {
      availabilityByProductId.set(productId, {
        isAvailable: true,
        status: 'available',
        availableUnits: Number.MAX_SAFE_INTEGER,
        reason: ''
      });
      return;
    }

    if (!productRecipes.length) {
      availabilityByProductId.set(productId, {
        isAvailable: false,
        status: 'no-kit-spec',
        availableUnits: 0,
        reason: `${product.name} cannot be ordered yet because no kit specification is assigned.`
      });
      return;
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
        kitIssue = !ingredient
          ? `${product.name} cannot be ordered because ${ingredientName} is missing from Ingredients.`
          : `${product.name} cannot be ordered because its kit specification needs review.`;
        maxUnits = 0;
        return;
      }

      const qtyOnHand = Number(ingredient.qtyOnHand || 0);
      const supportedUnits = Math.floor((qtyOnHand / qtyPerProduct) + 1e-9);
      if (supportedUnits < maxUnits) maxUnits = supportedUnits;
      if (supportedUnits <= 0 && !stockIssue) {
        stockIssue = `${product.name} is out of stock because ${ingredientName} has no remaining quantity.`;
      }
    });

    if (kitIssue) {
      availabilityByProductId.set(productId, {
        isAvailable: false,
        status: 'kit-spec-issue',
        availableUnits: 0,
        reason: kitIssue
      });
      return;
    }

    if (!Number.isFinite(maxUnits) || maxUnits <= 0) {
      availabilityByProductId.set(productId, {
        isAvailable: false,
        status: 'out-of-stock',
        availableUnits: 0,
        reason: stockIssue || `${product.name} is out of stock.`
      });
      return;
    }

    availabilityByProductId.set(productId, {
      isAvailable: true,
      status: 'available',
      availableUnits: maxUnits,
      reason: ''
    });
  });

  return availabilityByProductId;
}

function normalizeInvoiceOrderType(orderType = null) {
  const normalized = String(orderType || '').trim().toLowerCase();
  if (normalized === 'dine-in' || normalized === 'take-out') return normalized;
  return null;
}

async function buildInvoiceLineItemsAndTotals({
  items,
  discountAmount = 0,
  discountProfile = null
}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Invoice must contain at least one item');
  }

  const appConfig = getAppConfig();
  const [productCatalog, ingredients, recipes] = await Promise.all([
    listProducts(),
    listInventoryIngredients(),
    listProductRecipes()
  ]);
  const availabilityByProductId = buildProductAvailabilityMap(productCatalog, ingredients, recipes, {
    enforceKitSpec: appConfig.enforceKitSpec
  });

  const lineItems = items.map((item) => {
    const product = productCatalog.find((row) => row.id === item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }
    const qty = Number(item.qty || 0);
    if (qty <= 0) {
      throw new Error(`Invalid qty for product: ${item.productId}`);
    }
    const availability = availabilityByProductId.get(String(product.id || '').trim());
    if (!availability?.isAvailable) {
      throw new Error(availability?.reason || `${product.name} is not available for ordering right now.`);
    }
    if (appConfig.enforceKitSpec && qty > Number(availability.availableUnits || 0)) {
      throw new Error(`${product.name} only has ${Number(availability.availableUnits || 0)} serving(s) available based on current ingredient stock.`);
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

  return {
    lineItems,
    subtotal,
    discount,
    total,
    discountProfile: normalizeInvoiceDiscountProfile(discountProfile)
  };
}

function buildInvoiceAdjustmentSnapshot(invoice = null) {
  if (!invoice) return null;
  return {
    id: invoice.id,
    reference: invoice.reference,
    status: normalizeInvoiceStatus(invoice.status),
    orderType: invoice.orderType || null,
    paymentMethod: invoice.paymentMethod || null,
    subtotal: Number(invoice.subtotal ?? invoice.total ?? 0),
    discount: Number(invoice.discount || 0),
    discountProfile: normalizeInvoiceDiscountProfile(invoice.discountProfile),
    total: Number(invoice.total || 0),
    lineItems: Array.isArray(invoice.lineItems)
      ? invoice.lineItems.map((item) => ({
        lineId: item.lineId || null,
        productId: item.productId,
        name: item.name,
        price: Number(item.price || 0),
        qty: Number(item.qty || 0),
        subtotal: Number(item.subtotal || 0)
      }))
      : [],
    payment: invoice.payment ? {
      method: invoice.payment.method,
      provider: invoice.payment.provider || null,
      providerReference: invoice.payment.providerReference || null,
      recipientGcashNumber: invoice.payment.recipientGcashNumber || null,
      paidAt: invoice.payment.paidAt || null,
      amountPaid: Number(invoice.payment.amountPaid || 0),
      change: Number(invoice.payment.change || 0),
      success: Boolean(invoice.payment.success),
      successMessage: invoice.payment.successMessage || null,
      customerName: invoice.payment.customerName || null,
      customerEmail: invoice.payment.customerEmail || null,
      customerPhone: invoice.payment.customerPhone || null
    } : null
  };
}

function toDbPayment(invoiceId, paymentData = {}) {
  return {
    invoice_id: invoiceId,
    method: paymentData.method,
    provider: paymentData.provider || null,
    provider_reference: paymentData.providerReference || null,
    recipient_gcash_number: paymentData.recipientGcashNumber || null,
    paid_at: paymentData.paidAt,
    amount_paid: Number(paymentData.amountPaid || 0),
    change_amount: Number(paymentData.change || 0),
    success: Boolean(paymentData.success),
    success_message: paymentData.successMessage || null,
    customer_name: paymentData.customerName || null,
    customer_email: paymentData.customerEmail || null,
    customer_phone: paymentData.customerPhone || null
  };
}

async function createInvoice({
  items,
  paymentMethod,
  discountAmount = 0,
  discountProfile = null,
  orderType = null,
  invoiceId: requestedInvoiceId = null,
  reference: _requestedReference = null,
  cashierUserId = null,
  cashierEmail = null,
  cashierName = null,
  cashierRole = null
}) {
  const {
    lineItems,
    subtotal,
    discount,
    total,
    discountProfile: normalizedDiscountProfile
  } = await buildInvoiceLineItemsAndTotals({
    items,
    discountAmount,
    discountProfile
  });
  const now = new Date().toISOString();
  const providedInvoiceId = String(requestedInvoiceId || '').trim();
  const invoiceId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(providedInvoiceId)
    ? providedInvoiceId
    : uuidv4();
  const invoiceReference = await generateNextOrderSlipReference();
  const invoice = {
    id: invoiceId,
    reference: invoiceReference,
    createdAt: now,
    updatedAt: now,
    status: 'PENDING',
    statusReason: null,
    statusChangedAt: null,
    statusChangedByUserId: null,
    statusChangedByEmail: null,
    orderType: normalizeInvoiceOrderType(orderType),
    paymentMethod,
    cashierUserId: cashierUserId || null,
    cashierEmail: cashierEmail || null,
    cashierName: cashierName || null,
    cashierRole: cashierRole || null,
    subtotal,
    discount,
    discountProfile: normalizedDiscountProfile,
    total,
    lineItems: lineItems.map((item, index) => ({
      ...item,
      lineId: uuidv5(`${invoiceId}:${item.productId}:${index}`, LINE_ITEM_UUID_NAMESPACE)
    })),
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

  if (normalizeInvoiceStatus(invoice.status) === 'PAID') {
    return invoice;
  }

  assertInvoiceStatusTransition(invoice.status, 'PAID');

  invoice.status = 'PAID';
  invoice.statusReason = null;
  invoice.statusChangedAt = paymentData?.paidAt || new Date().toISOString();
  invoice.statusChangedByUserId = null;
  invoice.statusChangedByEmail = null;
  invoice.paymentMethod = String(paymentData?.method || invoice.paymentMethod || '').trim() || invoice.paymentMethod;
  invoice.payment = paymentData;
  invoice.updatedAt = new Date().toISOString();
  invoices.set(invoiceId, invoice);

  if (canAttemptSupabaseRead()) {
    try {
      await upsertInvoiceToSupabase(invoice);

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

      if (paymentError) throw new Error(`Supabase payment upsert failed: ${paymentError.message}`);
    } catch (error) {
      console.warn('[Offline] setInvoicePaid Supabase sync failed, queuing:', error.message);
      enqueueOfflineOpDeduped(
        'set_invoice_paid',
        { invoiceId, invoice, paymentData },
        (op) => op?.payload?.invoiceId === invoiceId
      );
    }
  }

  await applyInventoryUsageForPaidInvoice(invoice);

  return invoice;
}

function parseOrderSlipSequence(reference) {
  const safeReference = String(reference || '').trim().toUpperCase();
  const match = ORDER_SLIP_REGEX.exec(safeReference);
  if (!match) return 0;
  const sequence = Number(match[1]);
  if (!Number.isFinite(sequence) || sequence <= 0) return 0;
  return Math.floor(sequence);
}

function formatOrderSlipReference(sequence) {
  const safeSequence = Math.max(1, Math.floor(Number(sequence) || 1));
  return `${ORDER_SLIP_PREFIX}${String(safeSequence).padStart(ORDER_SLIP_DIGITS, '0')}`;
}

function getMaxOrderSlipSequenceFromInMemoryInvoices() {
  let max = 0;
  invoices.forEach((invoice) => {
    const sequence = parseOrderSlipSequence(invoice?.reference);
    if (sequence > max) max = sequence;
  });
  return max;
}

async function getMaxOrderSlipSequenceFromSupabaseInvoices() {
  if (!isSupabaseEnabled()) return 0;
  const { data, error } = await supabase
    .from('pos_invoices')
    .select('reference')
    .ilike('reference', `${ORDER_SLIP_PREFIX}%`)
    .order('reference', { ascending: false })
    .limit(1);
  if (error) {
    throw new Error(`Supabase order slip sequence lookup failed: ${error.message}`);
  }
  return parseOrderSlipSequence(data?.[0]?.reference);
}

async function ensureOrderSlipSequenceInitialized() {
  if (Number.isFinite(nextOrderSlipSequence) && nextOrderSlipSequence > 0) return;
  if (initOrderSlipSequencePromise) {
    await initOrderSlipSequencePromise;
    return;
  }

  initOrderSlipSequencePromise = (async () => {
    const inMemoryMax = getMaxOrderSlipSequenceFromInMemoryInvoices();
    let supabaseMax = 0;
    try {
      supabaseMax = await getMaxOrderSlipSequenceFromSupabaseInvoices();
    } catch (error) {
      console.warn('[OrderSlip] Falling back to in-memory sequence initialization:', error.message);
    }
    nextOrderSlipSequence = Math.max(inMemoryMax, supabaseMax) + 1;
  })();

  try {
    await initOrderSlipSequencePromise;
  } finally {
    initOrderSlipSequencePromise = null;
  }
}

async function generateNextOrderSlipReference() {
  await ensureOrderSlipSequenceInitialized();
  let attempts = 0;
  while (attempts < 10) {
    const reference = formatOrderSlipReference(nextOrderSlipSequence);
    nextOrderSlipSequence += 1;
    const duplicate = Array.from(invoices.values()).some((invoice) => String(invoice?.reference || '').trim().toUpperCase() === reference);
    if (!duplicate) return reference;
    attempts += 1;
  }
  throw new Error('Unable to allocate unique order slip reference');
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

  try {
    const { error } = await supabase
      .from('pos_gcash_sessions')
      .upsert(toDbSession(session), { onConflict: 'reference' });
    if (error) throw new Error(`Supabase GCash session upsert failed: ${error.message}`);
  } catch (error) {
    console.warn('[Offline] saveGcashSession Supabase sync failed, queuing:', error.message);
    enqueueOfflineOpDeduped(
      'save_gcash_session',
      { session },
      (op) => op?.payload?.session?.reference === session.reference
    );
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

function buildMonthRange(monthValue) {
  const match = String(monthValue || '').trim().match(/^(\d{4})-(\d{2})$/);
  if (!match) throw new Error('month must be in YYYY-MM format');
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) throw new Error('month must be in YYYY-MM format');
  const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const to = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  return {
    month: `${year}-${String(month).padStart(2, '0')}`,
    fromIso: from.toISOString(),
    toIso: to.toISOString()
  };
}

function toAppExpense(row) {
  if (!row) return null;
  return {
    id: row.id,
    expenseDate: row.expense_date || row.expenseDate || null,
    category: row.category || 'Miscellaneous',
    description: row.description || '',
    amount: Number(row.amount || 0),
    note: row.note || null,
    createdByUserId: row.created_by_user_id || row.createdByUserId || null,
    createdByEmail: row.created_by_email || row.createdByEmail || null,
    createdByName: row.created_by_name || row.createdByName || null,
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null
  };
}

function toAppMonthlyClosingSnapshot(row) {
  if (!row) return null;
  let report = row.report_json ?? row.reportJson ?? row.report ?? null;
  if (typeof report === 'string') {
    try {
      report = JSON.parse(report);
    } catch (_error) {
      report = null;
    }
  }

  const rawMonth = String(row.month || report?.month || '').trim();
  if (!rawMonth) return null;

  let month = rawMonth;
  try {
    month = buildMonthRange(rawMonth).month;
  } catch (_error) {
    month = rawMonth;
  }

  return {
    month,
    report: report && typeof report === 'object' ? report : null,
    savedByUserId: row.saved_by_user_id || row.savedByUserId || null,
    savedByEmail: row.saved_by_email || row.savedByEmail || null,
    savedByName: row.saved_by_name || row.savedByName || null,
    savedAt: row.saved_at || row.savedAt || null,
    updatedAt: row.updated_at || row.updatedAt || row.saved_at || row.savedAt || null
  };
}

function hydrateExpenseFallbackEntries() {
  if (db || expenseFallbackLoaded) return;
  expenseFallbackLoaded = true;
  expenseEntries.clear();

  const rows = readJsonFallbackFile(EXPENSES_FALLBACK_FILE, []);
  if (!Array.isArray(rows)) return;

  rows.forEach((row) => {
    const expense = toAppExpense(row);
    if (expense?.id) {
      expenseEntries.set(expense.id, expense);
    }
  });
}

function persistExpenseFallbackEntries() {
  if (db) return;
  writeJsonFallbackFile(
    EXPENSES_FALLBACK_FILE,
    Array.from(expenseEntries.values()),
    '[Expenses] Failed to persist fallback expense entries'
  );
}

function hydrateMonthlyClosingSnapshotsFallback() {
  if (monthlyClosingSnapshotsFallbackLoaded) return;
  monthlyClosingSnapshotsFallbackLoaded = true;
  monthlyClosingSnapshots.clear();

  const rows = readJsonFallbackFile(MONTHLY_CLOSING_SNAPSHOTS_FALLBACK_FILE, []);
  if (!Array.isArray(rows)) return;

  rows.forEach((row) => {
    const snapshot = toAppMonthlyClosingSnapshot(row);
    if (snapshot?.month) {
      monthlyClosingSnapshots.set(snapshot.month, snapshot);
    }
  });
}

function persistMonthlyClosingSnapshotsFallback() {
  const rows = Array.from(monthlyClosingSnapshots.values())
    .sort((a, b) => String(b.month || '').localeCompare(String(a.month || '')));
  writeJsonFallbackFile(
    MONTHLY_CLOSING_SNAPSHOTS_FALLBACK_FILE,
    rows,
    '[MonthlyClosing] Failed to persist fallback monthly closing snapshots'
  );
}

function canUseMonthlyClosingSnapshotsSupabase() {
  return canAttemptSupabaseRead() && !monthlyClosingSnapshotsSupabaseUnavailable;
}

function markMonthlyClosingSnapshotsSupabaseUnavailable(error) {
  monthlyClosingSnapshotsSupabaseUnavailable = true;
  if (monthlyClosingSnapshotsSupabaseFallbackLogged) return;
  monthlyClosingSnapshotsSupabaseFallbackLogged = true;
  console.warn(`[MonthlyClosing] Snapshot table unavailable in Supabase. Using fallback storage for this runtime: ${sanitizeSupabaseErrorMessage(error)}`);
}

function hasMonthlyClosingReportData(report = null) {
  const summary = report?.summary || {};
  return Boolean(
    Number(summary.totalSales || 0)
    || Number(summary.totalExpenses || 0)
    || Number(summary.totalTransactions || 0)
    || Number(summary.drawerWithdrawals || 0)
    || Number(summary.totalDiscrepancy || 0)
    || (Array.isArray(report?.expenses) && report.expenses.length)
    || (Array.isArray(report?.expenseByCategory) && report.expenseByCategory.length)
    || (Array.isArray(report?.topProducts) && report.topProducts.length)
  );
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

function getInvoiceSaleAmount(invoiceLike) {
  return Number(invoiceLike?.total ?? invoiceLike?.total_amount ?? 0);
}

function toAppInventoryIngredient(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    qtyOnHand: Number(row.qty_on_hand ?? row.qtyOnHand ?? 0),
    unitPrice: Number(row.unit_price ?? row.unitPrice ?? 0),
    reorderLevel: Number(row.reorder_level ?? row.reorderLevel ?? 0),
    unit: row.unit || 'pcs',
    isActive: row.is_active === undefined ? true : Boolean(row.is_active ?? row.isActive),
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null
  };
}

function toAppProductRecipe(row, ingredientById = new Map()) {
  if (!row) return null;
  const ingredientId = row.ingredient_id || row.ingredientId || null;
  const ingredient = ingredientById.get(ingredientId) || row.inventory_ingredients || null;
  return {
    id: row.id,
    productId: row.product_id || row.productId || null,
    productName: row.product_name || row.productName || 'Product',
    ingredientId,
    ingredientName: ingredient?.name || row.ingredient_name || row.ingredientName || 'Ingredient',
    ingredientUnit: ingredient?.unit || row.ingredient_unit || row.ingredientUnit || 'pcs',
    qtyPerProduct: Number(row.qty_per_product ?? row.qtyPerProduct ?? 0),
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null
  };
}

function toAppInventoryMovement(row, ingredientById = new Map()) {
  if (!row) return null;
  const ingredientId = row.ingredient_id || row.ingredientId || null;
  const ingredient = ingredientById.get(ingredientId) || null;
  return {
    id: row.id,
    ingredientId,
    ingredientName: ingredient?.name || row.ingredient_name || row.ingredientName || 'Ingredient',
    ingredientUnit: ingredient?.unit || row.ingredient_unit || row.ingredientUnit || 'pcs',
    movementType: String(row.movement_type || row.movementType || 'ADJUST').trim().toUpperCase() || 'ADJUST',
    quantity: Number(row.quantity || 0),
    unitCost: Number(row.unit_cost ?? row.unitCost ?? 0),
    referenceType: row.reference_type || row.referenceType || null,
    referenceId: row.reference_id || row.referenceId || null,
    notes: row.notes || null,
    createdAt: row.created_at || row.createdAt || null
  };
}

async function recordInventoryMovement({
  ingredientId,
  movementType = 'ADJUST',
  quantity,
  unitCost = 0,
  referenceType = null,
  referenceId = null,
  notes = null,
  createdAt = null
}) {
  const safeIngredientId = String(ingredientId || '').trim();
  const safeQuantity = Number(quantity || 0);
  if (!safeIngredientId || !Number.isFinite(safeQuantity) || safeQuantity <= 0) return null;

  const movement = {
    id: uuidv4(),
    ingredient_id: safeIngredientId,
    movement_type: String(movementType || 'ADJUST').trim().toUpperCase() || 'ADJUST',
    quantity: safeQuantity,
    unit_cost: Number(unitCost || 0),
    reference_type: referenceType || null,
    reference_id: referenceId || null,
    notes: notes ? String(notes).trim() : null,
    created_at: createdAt || new Date().toISOString()
  };

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .insert(movement)
      .select('id,ingredient_id,movement_type,quantity,unit_cost,reference_type,reference_id,notes,created_at')
      .single();
    if (error) throw new Error(`Supabase inventory movement create failed: ${error.message}`);
    const ingredients = await listInventoryIngredients();
    const ingredientById = new Map(ingredients.map((row) => [row.id, row]));
    return toAppInventoryMovement(data, ingredientById);
  }

  const ingredient = inventoryIngredients.get(safeIngredientId);
  const appMovement = toAppInventoryMovement({
    ...movement,
    ingredient_name: ingredient?.name || null,
    ingredient_unit: ingredient?.unit || null
  });
  inventoryMovements.set(appMovement.id, appMovement);
  return { ...appMovement };
}

async function listInventoryMovements({ ingredientId = null, referenceType = null, movementType = null, since = null, limit = null } = {}) {
  const safeIngredientId = String(ingredientId || '').trim() || null;
  const safeReferenceType = String(referenceType || '').trim() || null;
  const safeMovementType = String(movementType || '').trim().toUpperCase() || null;
  const safeLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Math.round(Number(limit)) : null;
  const ingredients = await listInventoryIngredients();
  const ingredientById = new Map(ingredients.map((row) => [row.id, row]));

  if (canAttemptSupabaseRead()) {
    try {
      let query = supabase
        .from('inventory_movements')
        .select('id,ingredient_id,movement_type,quantity,unit_cost,reference_type,reference_id,notes,created_at')
        .order('created_at', { ascending: false });
      if (safeIngredientId) query = query.eq('ingredient_id', safeIngredientId);
      if (safeReferenceType) query = query.eq('reference_type', safeReferenceType);
      if (safeMovementType) query = query.eq('movement_type', safeMovementType);
      if (since) query = query.gte('created_at', since);
      if (safeLimit) query = query.limit(safeLimit);
      const { data, error } = await query;
      if (error) throw new Error(`Supabase inventory movement list failed: ${error.message}`);
      markSupabaseReadHealthy();
      return (data || []).map((row) => toAppInventoryMovement(row, ingredientById));
    } catch (error) {
      markSupabaseReadFailure('listInventoryMovements', error);
    }
  }

  let rows = Array.from(inventoryMovements.values()).map((row) => toAppInventoryMovement(row, ingredientById));
  if (safeIngredientId) rows = rows.filter((row) => String(row.ingredientId || '') === safeIngredientId);
  if (safeReferenceType) rows = rows.filter((row) => String(row.referenceType || '') === safeReferenceType);
  if (safeMovementType) rows = rows.filter((row) => String(row.movementType || '').toUpperCase() === safeMovementType);
  if (since) rows = rows.filter((row) => new Date(row.createdAt || 0).getTime() >= new Date(since).getTime());
  rows.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return safeLimit ? rows.slice(0, safeLimit) : rows;
}

async function attachInventoryMovementReferences(movements = []) {
  const invoiceIds = Array.from(new Set(
    (movements || [])
      .filter((row) => String(row.referenceType || '') === 'invoice_payment' && row.referenceId)
      .map((row) => String(row.referenceId))
  ));
  if (!invoiceIds.length) return movements;

  const invoiceRefById = new Map();
  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('pos_invoices')
      .select('id,reference')
      .in('id', invoiceIds);
    if (!error) {
      (data || []).forEach((row) => {
        invoiceRefById.set(String(row.id), row.reference || row.id);
      });
    }
  } else {
    invoiceIds.forEach((invoiceId) => {
      const invoice = invoices.get(invoiceId);
      if (invoice) invoiceRefById.set(invoiceId, invoice.reference || invoice.id);
    });
  }

  return movements.map((row) => ({
    ...row,
    invoiceReference: row.referenceId ? (invoiceRefById.get(String(row.referenceId)) || null) : null
  }));
}

function extractMovementProductSummary(notes = '') {
  const text = String(notes || '').trim();
  const separatorIndex = text.indexOf(':');
  if (separatorIndex === -1) return '';
  return text.slice(separatorIndex + 1).trim();
}

function extractManualStockUpdateRange(notes = '') {
  const match = String(notes || '').match(/:\s*(-?\d+(?:\.\d+)?)\s*->\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  return {
    beforeQty: Number(match[1]),
    afterQty: Number(match[2])
  };
}

function buildInventoryMonitorPayload({ ingredients = [], movements = [] }) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayMs = todayStart.getTime();
  const todayMovements = (movements || []).filter((row) => new Date(row.createdAt || 0).getTime() >= todayMs);
  const salesMovementsToday = todayMovements.filter((row) => String(row.referenceType || '') === 'invoice_payment' && String(row.movementType || '') === 'OUT');
  const affectedIngredientIds = new Set(salesMovementsToday.map((row) => String(row.ingredientId || '')).filter(Boolean));
  const totalSalesDeductedQty = salesMovementsToday.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
  const noStockItems = ingredients.filter((row) => Number(row.qtyOnHand || 0) <= 0);
  const lowStockItems = ingredients.filter((row) => Number(row.qtyOnHand || 0) > 0 && row.lowStock);

  const salesByIngredient = new Map();
  salesMovementsToday.forEach((row) => {
    const key = String(row.ingredientId || '');
    if (!salesByIngredient.has(key)) {
      salesByIngredient.set(key, {
        ingredientId: key,
        ingredientName: row.ingredientName || 'Ingredient',
        ingredientUnit: row.ingredientUnit || 'pcs',
        qtyDeducted: 0,
        movementCount: 0,
        productSummary: new Set()
      });
    }
    const bucket = salesByIngredient.get(key);
    bucket.qtyDeducted += Number(row.quantity || 0);
    bucket.movementCount += 1;
    const summary = extractMovementProductSummary(row.notes || '');
    if (summary) bucket.productSummary.add(summary);
  });

  const topConsumedToday = Array.from(salesByIngredient.values())
    .map((row) => ({
      ...row,
      currentQtyOnHand: Number((ingredients.find((item) => String(item.id || '') === row.ingredientId)?.qtyOnHand) || 0),
      productSummary: Array.from(row.productSummary).slice(0, 2).join(' | ')
    }))
    .sort((a, b) => b.qtyDeducted - a.qtyDeducted)
    .slice(0, 6);

  const alerts = ingredients
    .filter((row) => Number(row.qtyOnHand || 0) <= 0 || row.lowStock)
    .sort((a, b) => {
      const aScore = Number(a.qtyOnHand || 0) <= 0 ? 0 : 1;
      const bScore = Number(b.qtyOnHand || 0) <= 0 ? 0 : 1;
      if (aScore !== bScore) return aScore - bScore;
      return Number(a.qtyOnHand || 0) - Number(b.qtyOnHand || 0);
    })
    .slice(0, 8)
    .map((row) => ({
      ingredientId: row.id,
      ingredientName: row.name,
      ingredientUnit: row.unit || 'pcs',
      qtyOnHand: Number(row.qtyOnHand || 0),
      reorderLevel: Number(row.reorderLevel || 0),
      severity: Number(row.qtyOnHand || 0) <= 0 ? 'critical' : 'warning',
      affectedProducts: (row.usageByProduct || []).slice(0, 3).map((entry) => entry.productName).join(', ')
    }));

  const recentMovements = (movements || []).slice(0, 12).map((row) => {
    const qtyOnHand = Number((ingredients.find((item) => String(item.id || '') === String(row.ingredientId || ''))?.qtyOnHand) || 0);
    return {
      ...row,
      currentQtyOnHand: qtyOnHand,
      referenceLabel: row.invoiceReference
        ? `Invoice ${row.invoiceReference}`
        : String(row.referenceType || '').replace(/_/g, ' ') || 'Manual',
      productSummary: extractMovementProductSummary(row.notes || '')
    };
  });

  return {
    summary: {
      totalSalesDeductionsToday: salesMovementsToday.length,
      totalSalesDeductedQty,
      ingredientsAffectedToday: affectedIngredientIds.size,
      noStockCount: noStockItems.length,
      lowStockCount: lowStockItems.length,
      latestMovementAt: recentMovements[0]?.createdAt || null
    },
    topConsumedToday,
    alerts,
    recentMovements
  };
}

async function listInventoryIngredients() {
  if (canAttemptSupabaseRead()) {
    try {
      const { data, error } = await supabase
        .from('inventory_ingredients')
        .select('id,name,qty_on_hand,unit_price,reorder_level,unit,is_active,created_at,updated_at')
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (error) throw new Error(`Supabase inventory ingredients fetch failed: ${error.message}`);
      markSupabaseReadHealthy();
      return (data || []).map((row) => toAppInventoryIngredient(row));
    } catch (error) {
      markSupabaseReadFailure('listInventoryIngredients', error);
    }
  }

  return Array.from(inventoryIngredients.values())
    .filter((row) => row.isActive !== false)
    .map((row) => toAppInventoryIngredient(row))
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
}

async function listProductRecipes({ productId = null } = {}) {
  const safeProductId = String(productId || '').trim() || null;
  const ingredients = await listInventoryIngredients();
  const ingredientById = new Map(ingredients.map((row) => [row.id, row]));

  if (isSupabaseEnabled()) {
    let query = supabase
      .from('product_recipes')
      .select('id,product_id,product_name,ingredient_id,qty_per_product,created_at,updated_at')
      .order('product_name', { ascending: true })
      .order('created_at', { ascending: true });
    if (safeProductId) query = query.eq('product_id', safeProductId);
    const { data, error } = await query;
    if (error) throw new Error(`Supabase product recipes fetch failed: ${error.message}`);
    return (data || []).map((row) => toAppProductRecipe(row, ingredientById));
  }

  let rows = Array.from(productRecipes.values());
  if (safeProductId) rows = rows.filter((row) => String(row.productId || '') === safeProductId);
  return rows
    .map((row) => toAppProductRecipe(row, ingredientById))
    .sort((a, b) => {
      const byProduct = String(a.productName || '').localeCompare(String(b.productName || ''));
      if (byProduct !== 0) return byProduct;
      return String(a.ingredientName || '').localeCompare(String(b.ingredientName || ''));
    });
}

async function replaceProductRecipes({
  productId,
  productName,
  recipeItems = []
}) {
  const safeProductId = String(productId || '').trim();
  const safeProductName = String(productName || '').trim() || 'Product';
  if (!safeProductId) throw new Error('productId is required');
  if (!Array.isArray(recipeItems)) throw new Error('recipeItems must be an array');

  const normalizedItems = recipeItems.map((item) => ({
    ingredientId: String(item?.ingredientId || '').trim(),
    qtyPerProduct: Number(item?.qtyPerProduct || 0)
  }));

  const seenIngredientIds = new Set();
  normalizedItems.forEach((item) => {
    if (!item.ingredientId) throw new Error('ingredientId is required for each recipe item');
    if (!Number.isFinite(item.qtyPerProduct) || item.qtyPerProduct <= 0) {
      throw new Error('qtyPerProduct must be greater than 0 for each recipe item');
    }
    if (seenIngredientIds.has(item.ingredientId)) {
      throw new Error('Each ingredient can only appear once per product recipe');
    }
    seenIngredientIds.add(item.ingredientId);
  });

  const ingredients = await listInventoryIngredients();
  const ingredientById = new Map(ingredients.map((row) => [row.id, row]));
  normalizedItems.forEach((item) => {
    if (!ingredientById.has(item.ingredientId)) {
      throw new Error('One or more selected ingredients were not found');
    }
  });

  if (isSupabaseEnabled()) {
    const { error: deleteError } = await supabase
      .from('product_recipes')
      .delete()
      .eq('product_id', safeProductId);
    if (deleteError) throw new Error(`Supabase product recipes delete failed: ${deleteError.message}`);

    if (normalizedItems.length) {
      const nowIso = new Date().toISOString();
      const rows = normalizedItems.map((item) => ({
        id: uuidv4(),
        product_id: safeProductId,
        product_name: safeProductName,
        ingredient_id: item.ingredientId,
        qty_per_product: item.qtyPerProduct,
        created_at: nowIso,
        updated_at: nowIso
      }));
      const { error: insertError } = await supabase
        .from('product_recipes')
        .insert(rows);
      if (insertError) throw new Error(`Supabase product recipes save failed: ${insertError.message}`);
    }

    return listProductRecipes({ productId: safeProductId });
  }

  Array.from(productRecipes.entries()).forEach(([id, row]) => {
    if (String(row.productId || '') === safeProductId) {
      productRecipes.delete(id);
    }
  });

  const nowIso = new Date().toISOString();
  normalizedItems.forEach((item) => {
    const ingredient = ingredientById.get(item.ingredientId);
    const recipe = {
      id: uuidv4(),
      productId: safeProductId,
      productName: safeProductName,
      ingredientId: item.ingredientId,
      ingredientName: ingredient?.name || 'Ingredient',
      ingredientUnit: ingredient?.unit || 'pcs',
      qtyPerProduct: item.qtyPerProduct,
      createdAt: nowIso,
      updatedAt: nowIso
    };
    productRecipes.set(recipe.id, recipe);
  });

  return listProductRecipes({ productId: safeProductId });
}

async function applyInventoryUsageForPaidInvoice(invoice) {
  const safeInvoiceId = String(invoice?.id || '').trim();
  if (!safeInvoiceId || !Array.isArray(invoice?.lineItems) || !invoice.lineItems.length) return [];

  const appConfig = getAppConfig();
  if (!appConfig.enforceKitSpec) {
    return [];
  }

  if (isSupabaseEnabled()) {
    const { data: existingMovements, error: existingError } = await supabase
      .from('inventory_movements')
      .select('id')
      .eq('reference_type', 'invoice_payment')
      .eq('reference_id', safeInvoiceId)
      .limit(1);
    if (existingError) throw new Error(`Supabase inventory movement lookup failed: ${existingError.message}`);
    if (existingMovements?.length) return [];
  } else if (invoice.inventoryDeductedAt) {
    return [];
  }

  const recipes = await listProductRecipes();
  if (!recipes.length) {
    if (!isSupabaseEnabled()) {
      invoice.inventoryDeductedAt = new Date().toISOString();
      invoices.set(safeInvoiceId, invoice);
    }
    return [];
  }

  const recipesByProductId = new Map();
  recipes.forEach((recipe) => {
    const key = String(recipe.productId || '');
    if (!recipesByProductId.has(key)) recipesByProductId.set(key, []);
    recipesByProductId.get(key).push(recipe);
  });

  const usageByIngredientId = new Map();
  (invoice.lineItems || []).forEach((item) => {
    const productId = String(item?.productId || '').trim();
    const qtySold = Number(item?.qty || 0);
    if (!productId || !Number.isFinite(qtySold) || qtySold <= 0) return;
    const productRecipesRows = recipesByProductId.get(productId) || [];
    productRecipesRows.forEach((recipe) => {
      const usageQty = qtySold * Number(recipe.qtyPerProduct || 0);
      if (!usageByIngredientId.has(recipe.ingredientId)) {
        usageByIngredientId.set(recipe.ingredientId, {
          ingredientId: recipe.ingredientId,
          ingredientName: recipe.ingredientName || 'Ingredient',
          ingredientUnit: recipe.ingredientUnit || 'pcs',
          quantity: 0,
          sourceProducts: []
        });
      }
      const bucket = usageByIngredientId.get(recipe.ingredientId);
      bucket.quantity += usageQty;
      bucket.sourceProducts.push(`${recipe.productName} x${qtySold}`);
    });
  });

  if (!usageByIngredientId.size) {
    if (!isSupabaseEnabled()) {
      invoice.inventoryDeductedAt = new Date().toISOString();
      invoices.set(safeInvoiceId, invoice);
    }
    return [];
  }

  const ingredients = await listInventoryIngredients();
  const ingredientById = new Map(ingredients.map((row) => [row.id, row]));
  const applied = [];

  if (isSupabaseEnabled()) {
    const movementRows = [];
    for (const usage of usageByIngredientId.values()) {
      const ingredient = ingredientById.get(usage.ingredientId);
      if (!ingredient) continue;
      const nextQtyOnHand = Number(ingredient.qtyOnHand || 0) - Number(usage.quantity || 0);
      const { error: updateError } = await supabase
        .from('inventory_ingredients')
        .update({ qty_on_hand: nextQtyOnHand })
        .eq('id', usage.ingredientId);
      if (updateError) throw new Error(`Supabase inventory deduction failed: ${updateError.message}`);

      movementRows.push({
        id: uuidv4(),
        ingredient_id: usage.ingredientId,
        movement_type: 'OUT',
        quantity: Number(usage.quantity || 0),
        unit_cost: Number(ingredient.unitPrice || 0),
        reference_type: 'invoice_payment',
        reference_id: safeInvoiceId,
        notes: `Auto deduction from paid invoice ${invoice.reference || safeInvoiceId}: ${usage.sourceProducts.join(', ')}`
      });
      applied.push({
        ingredientId: usage.ingredientId,
        ingredientName: ingredient.name,
        ingredientUnit: ingredient.unit,
        deductedQty: Number(usage.quantity || 0),
        remainingQty: nextQtyOnHand
      });
    }
    if (movementRows.length) {
      const { error: movementError } = await supabase
        .from('inventory_movements')
        .insert(movementRows);
      if (movementError) throw new Error(`Supabase inventory movement create failed: ${movementError.message}`);
    }
    return applied;
  }

  for (const usage of usageByIngredientId.values()) {
    const ingredient = inventoryIngredients.get(usage.ingredientId);
    if (!ingredient) continue;
    const nextQtyOnHand = Number(ingredient.qtyOnHand || 0) - Number(usage.quantity || 0);
    const movementId = uuidv4();
    const movementCreatedAt = new Date().toISOString();
    inventoryIngredients.set(usage.ingredientId, {
      ...ingredient,
      qtyOnHand: nextQtyOnHand,
      updatedAt: movementCreatedAt
    });
    inventoryMovements.set(movementId, toAppInventoryMovement({
      id: movementId,
      ingredient_id: usage.ingredientId,
      ingredient_name: ingredient.name,
      ingredient_unit: ingredient.unit,
      movement_type: 'OUT',
      quantity: Number(usage.quantity || 0),
      unit_cost: Number(ingredient.unitPrice || 0),
      reference_type: 'invoice_payment',
      reference_id: safeInvoiceId,
      notes: `Auto deduction from paid invoice ${invoice.reference || safeInvoiceId}: ${usage.sourceProducts.join(', ')}`,
      created_at: movementCreatedAt
    }));
    applied.push({
      ingredientId: usage.ingredientId,
      ingredientName: ingredient.name,
      ingredientUnit: ingredient.unit,
      deductedQty: Number(usage.quantity || 0),
      remainingQty: nextQtyOnHand
    });
  }

  invoice.inventoryDeductedAt = new Date().toISOString();
  invoices.set(safeInvoiceId, invoice);
  return applied;
}

async function reverseInventoryUsageForVoidedInvoice(invoice) {
  const safeInvoiceId = String(invoice?.id || '').trim();
  if (!safeInvoiceId) return [];

  if (isSupabaseEnabled()) {
    const { data: existingReversal, error: reversalError } = await supabase
      .from('inventory_movements')
      .select('id')
      .eq('reference_type', 'invoice_void')
      .eq('reference_id', safeInvoiceId)
      .limit(1);
    if (reversalError) throw new Error(`Supabase inventory reversal lookup failed: ${reversalError.message}`);
    if (existingReversal?.length) return [];

    const { data: paymentMovements, error: paymentMovementError } = await supabase
      .from('inventory_movements')
      .select('ingredient_id,quantity')
      .eq('reference_type', 'invoice_payment')
      .eq('reference_id', safeInvoiceId);
    if (paymentMovementError) throw new Error(`Supabase invoice inventory lookup failed: ${paymentMovementError.message}`);
    if (!paymentMovements?.length) return [];

    const ingredients = await listInventoryIngredients();
    const ingredientById = new Map(ingredients.map((row) => [row.id, row]));
    const restored = [];
    const reversalRows = [];

    for (const movement of paymentMovements) {
      const ingredientId = String(movement.ingredient_id || '').trim();
      const restoreQty = Number(movement.quantity || 0);
      const ingredient = ingredientById.get(ingredientId);
      if (!ingredientId || !ingredient || !Number.isFinite(restoreQty) || restoreQty <= 0) continue;

      const nextQtyOnHand = Number(ingredient.qtyOnHand || 0) + restoreQty;
      const { error: updateError } = await supabase
        .from('inventory_ingredients')
        .update({ qty_on_hand: nextQtyOnHand })
        .eq('id', ingredientId);
      if (updateError) throw new Error(`Supabase inventory restore failed: ${updateError.message}`);

      reversalRows.push({
        id: uuidv4(),
        ingredient_id: ingredientId,
        movement_type: 'IN',
        quantity: restoreQty,
        unit_cost: Number(ingredient.unitPrice || 0),
        reference_type: 'invoice_void',
        reference_id: safeInvoiceId,
        notes: `Inventory restored from voided invoice ${invoice.reference || safeInvoiceId}`
      });
      restored.push({
        ingredientId,
        ingredientName: ingredient.name,
        ingredientUnit: ingredient.unit,
        restoredQty: restoreQty,
        currentQty: nextQtyOnHand
      });
    }

    if (reversalRows.length) {
      const { error: insertError } = await supabase
        .from('inventory_movements')
        .insert(reversalRows);
      if (insertError) throw new Error(`Supabase inventory reversal insert failed: ${insertError.message}`);
    }

    return restored;
  }

  if (!invoice.inventoryDeductedAt || invoice.inventoryRestoredAt) {
    return [];
  }

  const paymentMovements = Array.from(inventoryMovements.values()).filter((movement) => {
    return String(movement.referenceType || '').toLowerCase() === 'invoice_payment'
      && String(movement.referenceId || '') === safeInvoiceId;
  });
  if (!paymentMovements.length) return [];

  const restored = [];
  paymentMovements.forEach((movement) => {
    const ingredientId = String(movement.ingredientId || '').trim();
    const restoreQty = Number(movement.quantity || 0);
    const ingredient = inventoryIngredients.get(ingredientId);
    if (!ingredientId || !ingredient || !Number.isFinite(restoreQty) || restoreQty <= 0) return;

    const nextQtyOnHand = Number(ingredient.qtyOnHand || 0) + restoreQty;
    const movementCreatedAt = new Date().toISOString();
    const reversalId = uuidv4();

    inventoryIngredients.set(ingredientId, {
      ...ingredient,
      qtyOnHand: nextQtyOnHand,
      updatedAt: movementCreatedAt
    });
    inventoryMovements.set(reversalId, toAppInventoryMovement({
      id: reversalId,
      ingredient_id: ingredientId,
      ingredient_name: ingredient.name,
      ingredient_unit: ingredient.unit,
      movement_type: 'IN',
      quantity: restoreQty,
      unit_cost: Number(ingredient.unitPrice || 0),
      reference_type: 'invoice_void',
      reference_id: safeInvoiceId,
      notes: `Inventory restored from voided invoice ${invoice.reference || safeInvoiceId}`,
      created_at: movementCreatedAt
    }));
    restored.push({
      ingredientId,
      ingredientName: ingredient.name,
      ingredientUnit: ingredient.unit,
      restoredQty: restoreQty,
      currentQty: nextQtyOnHand
    });
  });

  invoice.inventoryRestoredAt = new Date().toISOString();
  invoices.set(safeInvoiceId, invoice);
  return restored;
}

async function buildIngredientUsageMapForInvoiceLineItems(lineItems = []) {
  const recipes = await listProductRecipes();
  const recipesByProductId = new Map();
  recipes.forEach((recipe) => {
    const key = String(recipe.productId || '').trim();
    if (!key) return;
    if (!recipesByProductId.has(key)) recipesByProductId.set(key, []);
    recipesByProductId.get(key).push(recipe);
  });

  const usageByIngredientId = new Map();
  (lineItems || []).forEach((item) => {
    const productId = String(item?.productId || '').trim();
    const qtySold = Number(item?.qty || 0);
    if (!productId || !Number.isFinite(qtySold) || qtySold <= 0) return;
    const productRecipes = recipesByProductId.get(productId) || [];
    productRecipes.forEach((recipe) => {
      const usageQty = qtySold * Number(recipe.qtyPerProduct || 0);
      if (!usageByIngredientId.has(recipe.ingredientId)) {
        usageByIngredientId.set(recipe.ingredientId, {
          ingredientId: recipe.ingredientId,
          ingredientName: recipe.ingredientName || 'Ingredient',
          ingredientUnit: recipe.ingredientUnit || 'pcs',
          quantity: 0
        });
      }
      const bucket = usageByIngredientId.get(recipe.ingredientId);
      bucket.quantity += usageQty;
    });
  });

  return usageByIngredientId;
}

async function applyInventoryAdjustmentForEditedPaidInvoice(previousInvoice, nextInvoice, reason = '') {
  const safeInvoiceId = String(nextInvoice?.id || '').trim();
  if (!safeInvoiceId) return [];

  const appConfig = getAppConfig();
  if (!appConfig.enforceKitSpec) {
    return [];
  }

  const [previousUsage, nextUsage, ingredients] = await Promise.all([
    buildIngredientUsageMapForInvoiceLineItems(previousInvoice?.lineItems || []),
    buildIngredientUsageMapForInvoiceLineItems(nextInvoice?.lineItems || []),
    listInventoryIngredients()
  ]);
  const ingredientById = new Map((ingredients || []).map((row) => [row.id, row]));
  const ingredientIds = new Set([
    ...Array.from(previousUsage.keys()),
    ...Array.from(nextUsage.keys())
  ]);
  const note = `Paid invoice edit ${nextInvoice?.reference || safeInvoiceId}: ${String(reason || 'Items updated').trim() || 'Items updated'}`;
  const applied = [];

  if (isSupabaseEnabled()) {
    const movementRows = [];
    for (const ingredientId of ingredientIds) {
      const previousQty = Number(previousUsage.get(ingredientId)?.quantity || 0);
      const nextQty = Number(nextUsage.get(ingredientId)?.quantity || 0);
      const delta = nextQty - previousQty;
      if (!Number.isFinite(delta) || Math.abs(delta) < 1e-9) continue;

      const ingredient = ingredientById.get(ingredientId);
      if (!ingredient) continue;
      const nextQtyOnHand = Number(ingredient.qtyOnHand || 0) - delta;
      const { error: updateError } = await supabase
        .from('inventory_ingredients')
        .update({ qty_on_hand: nextQtyOnHand })
        .eq('id', ingredientId);
      if (updateError) throw new Error(`Supabase inventory edit adjustment failed: ${updateError.message}`);

      movementRows.push({
        id: uuidv4(),
        ingredient_id: ingredientId,
        movement_type: delta > 0 ? 'OUT' : 'IN',
        quantity: Math.abs(delta),
        unit_cost: Number(ingredient.unitPrice || 0),
        reference_type: 'invoice_edit',
        reference_id: safeInvoiceId,
        notes: note
      });
      applied.push({
        ingredientId,
        ingredientName: ingredient.name,
        ingredientUnit: ingredient.unit,
        adjustedQty: Math.abs(delta),
        movementType: delta > 0 ? 'OUT' : 'IN',
        remainingQty: nextQtyOnHand
      });
    }

    if (movementRows.length) {
      const { error: movementError } = await supabase
        .from('inventory_movements')
        .insert(movementRows);
      if (movementError) throw new Error(`Supabase inventory edit movement create failed: ${movementError.message}`);
    }
    return applied;
  }

  for (const ingredientId of ingredientIds) {
    const previousQty = Number(previousUsage.get(ingredientId)?.quantity || 0);
    const nextQty = Number(nextUsage.get(ingredientId)?.quantity || 0);
    const delta = nextQty - previousQty;
    if (!Number.isFinite(delta) || Math.abs(delta) < 1e-9) continue;

    const ingredient = inventoryIngredients.get(ingredientId);
    if (!ingredient) continue;
    const nextQtyOnHand = Number(ingredient.qtyOnHand || 0) - delta;
    const movementId = uuidv4();
    const movementCreatedAt = new Date().toISOString();
    inventoryIngredients.set(ingredientId, {
      ...ingredient,
      qtyOnHand: nextQtyOnHand,
      updatedAt: movementCreatedAt
    });
    inventoryMovements.set(movementId, toAppInventoryMovement({
      id: movementId,
      ingredient_id: ingredientId,
      ingredient_name: ingredient.name,
      ingredient_unit: ingredient.unit,
      movement_type: delta > 0 ? 'OUT' : 'IN',
      quantity: Math.abs(delta),
      unit_cost: Number(ingredient.unitPrice || 0),
      reference_type: 'invoice_edit',
      reference_id: safeInvoiceId,
      notes: note,
      created_at: movementCreatedAt
    }));
    applied.push({
      ingredientId,
      ingredientName: ingredient.name,
      ingredientUnit: ingredient.unit,
      adjustedQty: Math.abs(delta),
      movementType: delta > 0 ? 'OUT' : 'IN',
      remainingQty: nextQtyOnHand
    });
  }

  return applied;
}

async function recordPaidInvoiceAdjustment({
  invoiceId,
  reason,
  adjustedByUserId = null,
  adjustedByEmail = null,
  previousSnapshot = null,
  nextSnapshot = null
}) {
  const createdAt = new Date().toISOString();
  const log = {
    id: uuidv4(),
    invoiceId: String(invoiceId || '').trim() || null,
    reason: String(reason || '').trim() || null,
    adjustedByUserId: String(adjustedByUserId || '').trim() || null,
    adjustedByEmail: String(adjustedByEmail || '').trim().toLowerCase() || null,
    previousSnapshot,
    nextSnapshot,
    createdAt
  };
  if (!log.invoiceId || !log.reason) return null;

  invoiceAdjustmentLogs.set(log.id, log);
  if (!isSupabaseEnabled()) {
    return log;
  }

  const { error } = await supabase
    .from(INVOICE_ADJUSTMENTS_TABLE)
    .insert({
      id: log.id,
      invoice_id: log.invoiceId,
      reason: log.reason,
      adjusted_by_user_id: log.adjustedByUserId,
      adjusted_by_email: log.adjustedByEmail,
      previous_snapshot: log.previousSnapshot || {},
      next_snapshot: log.nextSnapshot || {},
      created_at: createdAt
    });

  if (error) {
    const message = String(error?.message || '').toLowerCase();
    if (/pos_invoice_adjustments/.test(message) && /(does not exist|relation)/.test(message)) {
      console.warn('[InvoiceAdjustments] Audit table missing, skipping adjustment log insert.');
      return log;
    }
    throw new Error(`Supabase invoice adjustment log failed: ${error.message}`);
  }

  return log;
}

async function editPaidInvoice({
  invoiceId,
  items,
  discountAmount = 0,
  discountProfile = null,
  orderType = null,
  reason,
  actedByUserId = null,
  actedByEmail = null,
  finalAmountPaid = null
}) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) throw new Error('Invoice not found');
  if (normalizeInvoiceStatus(invoice.status) !== 'PAID') {
    throw new Error('Only paid invoices can be edited.');
  }
  if (!invoice.payment) {
    throw new Error('A paid invoice must have a payment record before it can be edited.');
  }

  const safeReason = String(reason || '').trim();
  if (!safeReason) {
    throw new Error('A reason is required before editing a paid invoice.');
  }

  const previousInvoice = JSON.parse(JSON.stringify(invoice));
  const {
    lineItems,
    subtotal,
    discount,
    total,
    discountProfile: normalizedDiscountProfile
  } = await buildInvoiceLineItemsAndTotals({
    items,
    discountAmount,
    discountProfile
  });

  const originalPaymentMethod = String(invoice.payment?.method || invoice.paymentMethod || 'cash').trim().toLowerCase() || 'cash';
  const providedAmountPaid = Number(finalAmountPaid);
  let amountPaid = Number(invoice.payment?.amountPaid || total);
  let change = Number(invoice.payment?.change || 0);
  if (originalPaymentMethod === 'cash') {
    if (!Number.isFinite(providedAmountPaid) || providedAmountPaid < total) {
      throw new Error('Final cash received must be a valid number that covers the updated total.');
    }
    amountPaid = Math.round(providedAmountPaid * 100) / 100;
    change = Math.max(0, Math.round((amountPaid - total) * 100) / 100);
  } else {
    amountPaid = Number.isFinite(providedAmountPaid) && providedAmountPaid >= total
      ? Math.round(providedAmountPaid * 100) / 100
      : Math.round(total * 100) / 100;
    change = 0;
  }

  const nowIso = new Date().toISOString();
  const nextPayment = {
    ...invoice.payment,
    method: originalPaymentMethod,
    amountPaid,
    change,
    paidAt: invoice.payment?.paidAt || nowIso,
    success: invoice.payment?.success !== false,
    successMessage: invoice.payment?.successMessage || 'Paid transaction updated from Shift Monitor'
  };

  invoice.orderType = normalizeInvoiceOrderType(orderType) || invoice.orderType || null;
  invoice.paymentMethod = originalPaymentMethod;
  invoice.subtotal = subtotal;
  invoice.discount = discount;
  invoice.discountProfile = normalizedDiscountProfile;
  invoice.total = total;
  invoice.lineItems = lineItems.map((item, index) => ({
    ...item,
    lineId: item.lineId || uuidv5(`${invoice.id}:${item.productId}:${index}`, LINE_ITEM_UUID_NAMESPACE)
  }));
  invoice.payment = nextPayment;
  invoice.updatedAt = nowIso;
  invoices.set(invoice.id, invoice);

  if (isSupabaseEnabled()) {
    await _persistInvoiceToSupabase(invoice);
    const { error: paymentError } = await supabase
      .from('pos_payments')
      .upsert(toDbPayment(invoice.id, nextPayment), { onConflict: 'invoice_id' });
    if (paymentError) {
      throw new Error(`Supabase paid invoice payment update failed: ${paymentError.message}`);
    }
  }

  await applyInventoryAdjustmentForEditedPaidInvoice(previousInvoice, invoice, safeReason);
  await recordPaidInvoiceAdjustment({
    invoiceId: invoice.id,
    reason: safeReason,
    adjustedByUserId: actedByUserId,
    adjustedByEmail: actedByEmail,
    previousSnapshot: buildInvoiceAdjustmentSnapshot(previousInvoice),
    nextSnapshot: buildInvoiceAdjustmentSnapshot(invoice)
  });

  return invoice;
}

async function updateInvoiceLifecycleStatus({
  invoiceId,
  status,
  reason = null,
  actedByUserId = null,
  actedByEmail = null
}) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  const nextStatus = normalizeInvoiceStatus(status);
  assertInvoiceStatusTransition(invoice.status, nextStatus);

  const trimmedReason = String(reason || '').trim() || null;
  const nowIso = new Date().toISOString();
  const previousStatus = normalizeInvoiceStatus(invoice.status);

  let nextReason = trimmedReason;
  if (nextStatus === 'VOIDED' && previousStatus === 'HOLD_FOR_VOID' && invoice.statusReason) {
    const requestedAt = invoice.statusChangedAt ? new Date(invoice.statusChangedAt).toISOString() : null;
    const requestedBy = String(invoice.statusChangedByEmail || '').trim().toLowerCase() || 'cashier';
    const requestNote = requestedAt
      ? `Hold for void requested by ${requestedBy} on ${requestedAt}: ${invoice.statusReason}`
      : `Hold for void requested by ${requestedBy}: ${invoice.statusReason}`;
    nextReason = trimmedReason ? `${requestNote} | Admin void note: ${trimmedReason}` : requestNote;
  }

  invoice.status = nextStatus;
  invoice.statusReason = nextReason;
  invoice.statusChangedAt = nowIso;
  invoice.statusChangedByUserId = String(actedByUserId || '').trim() || null;
  invoice.statusChangedByEmail = String(actedByEmail || '').trim().toLowerCase() || null;
  invoice.updatedAt = nowIso;
  invoices.set(invoice.id, invoice);

  const session = await getGcashSessionByInvoiceId(invoice.id).catch(() => null);
  if (session) {
    session.status = nextStatus;
    session.updatedAt = nowIso;
    await saveGcashSession(session);
  }

  if (nextStatus === 'VOIDED') {
    await reverseInventoryUsageForVoidedInvoice(invoice);
  }

  await persistInvoice(invoice);
  return invoice;
}

function buildInventoryUsageFromInvoices({ paidInvoices, invoiceItems, recipesByProductId }) {
  const paidInvoiceSet = new Set((paidInvoices || []).map((x) => x.id));
  const productUnitsSold = new Map();

  (invoiceItems || [])
    .filter((item) => paidInvoiceSet.has(item.invoice_id))
    .forEach((item) => {
      const key = item.product_id;
      productUnitsSold.set(key, (productUnitsSold.get(key) || 0) + Number(item.qty || 0));
    });

  const usageByIngredientId = new Map();

  for (const [productId, recipes] of recipesByProductId.entries()) {
    const soldUnits = Number(productUnitsSold.get(productId) || 0);
    recipes.forEach((recipe) => {
      const ingredientId = recipe.ingredientId;
      const estimatedUsedQty = soldUnits * Number(recipe.qtyPerProduct || 0);
      if (!usageByIngredientId.has(ingredientId)) {
        usageByIngredientId.set(ingredientId, {
          estimatedUsedQty: 0,
          usageByProduct: []
        });
      }
      const bucket = usageByIngredientId.get(ingredientId);
      bucket.estimatedUsedQty += estimatedUsedQty;
      bucket.usageByProduct.push({
        productId,
        productName: recipe.productName,
        qtyPerProduct: Number(recipe.qtyPerProduct || 0),
        unitsSold: soldUnits,
        estimatedUsedQty
      });
    });
  }

  return usageByIngredientId;
}

async function createInventoryIngredient({ name, qtyOnHand, unitPrice, reorderLevel = 0, unit = 'pcs' }) {
  const ingredient = {
    id: uuidv4(),
    name: String(name || '').trim(),
    qtyOnHand: Number(qtyOnHand || 0),
    unitPrice: Number(unitPrice || 0),
    reorderLevel: Number(reorderLevel || 0),
    unit: String(unit || 'pcs').trim() || 'pcs',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!ingredient.name) {
    throw new Error('Ingredient name is required');
  }
  if (!Number.isFinite(ingredient.qtyOnHand) || ingredient.qtyOnHand < 0) {
    throw new Error('qtyOnHand must be a number >= 0');
  }
  if (!Number.isFinite(ingredient.unitPrice) || ingredient.unitPrice < 0) {
    throw new Error('unitPrice must be a number >= 0');
  }

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('inventory_ingredients')
      .insert({
        id: ingredient.id,
        name: ingredient.name,
        qty_on_hand: ingredient.qtyOnHand,
        unit_price: ingredient.unitPrice,
        reorder_level: ingredient.reorderLevel,
        unit: ingredient.unit,
        is_active: ingredient.isActive,
        created_at: ingredient.createdAt,
        updated_at: ingredient.updatedAt
      })
      .select('*')
      .single();

    if (error) {
      if (String(error.message || '').toLowerCase().includes('duplicate')) {
        throw new Error('Ingredient name already exists');
      }
      throw new Error(`Supabase create ingredient failed: ${error.message}`);
    }

    const createdIngredient = {
      id: data.id,
      name: data.name,
      qtyOnHand: Number(data.qty_on_hand || 0),
      unitPrice: Number(data.unit_price || 0),
      reorderLevel: Number(data.reorder_level || 0),
      unit: data.unit || 'pcs',
      isActive: Boolean(data.is_active),
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    if (createdIngredient.qtyOnHand > 0) {
      try {
        await recordInventoryMovement({
          ingredientId: createdIngredient.id,
          movementType: 'IN',
          quantity: createdIngredient.qtyOnHand,
          unitCost: createdIngredient.unitPrice,
          referenceType: 'ingredient_create',
          referenceId: createdIngredient.id,
          notes: `Initial stock for ingredient "${createdIngredient.name}".`
        });
      } catch (movementError) {
        console.warn('[Inventory] initial stock movement record failed:', movementError.message);
      }
    }
    return createdIngredient;
  }

  if (Array.from(inventoryIngredients.values()).some((x) => String(x.name).toLowerCase() === ingredient.name.toLowerCase())) {
    throw new Error('Ingredient name already exists');
  }
  inventoryIngredients.set(ingredient.id, ingredient);
  if (ingredient.qtyOnHand > 0) {
    try {
      await recordInventoryMovement({
        ingredientId: ingredient.id,
        movementType: 'IN',
        quantity: ingredient.qtyOnHand,
        unitCost: ingredient.unitPrice,
        referenceType: 'ingredient_create',
        referenceId: ingredient.id,
        notes: `Initial stock for ingredient "${ingredient.name}".`
      });
    } catch (movementError) {
      console.warn('[Inventory] initial stock movement record failed:', movementError.message);
    }
  }
  return ingredient;
}

async function updateInventoryIngredient(ingredientId, {
  name,
  qtyOnHand,
  unitPrice,
  reorderLevel,
  unit
} = {}) {
  const id = String(ingredientId || '').trim();
  if (!id) throw new Error('ingredientId is required');

  const patch = {};
  if (name !== undefined) {
    const nextName = String(name || '').trim();
    if (!nextName) throw new Error('Ingredient name is required');
    patch.name = nextName;
  }
  if (qtyOnHand !== undefined) {
    const nextQty = Number(qtyOnHand);
    if (!Number.isFinite(nextQty) || nextQty < 0) throw new Error('qtyOnHand must be a number >= 0');
    patch.qty_on_hand = nextQty;
  }
  if (unitPrice !== undefined) {
    const nextUnitPrice = Number(unitPrice);
    if (!Number.isFinite(nextUnitPrice) || nextUnitPrice < 0) throw new Error('unitPrice must be a number >= 0');
    patch.unit_price = nextUnitPrice;
  }
  if (reorderLevel !== undefined) {
    const nextReorderLevel = Number(reorderLevel);
    if (!Number.isFinite(nextReorderLevel) || nextReorderLevel < 0) throw new Error('reorderLevel must be a number >= 0');
    patch.reorder_level = nextReorderLevel;
  }
  if (unit !== undefined) {
    const nextUnit = String(unit || '').trim();
    if (!nextUnit) throw new Error('unit is required');
    patch.unit = nextUnit;
  }
  if (!Object.keys(patch).length) throw new Error('No ingredient changes were provided');

  if (isSupabaseEnabled()) {
    const { data: existing, error: findErr } = await supabase
      .from('inventory_ingredients')
      .select('id,name,qty_on_hand,unit_price')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();
    if (findErr) throw new Error(`Supabase ingredient lookup failed: ${findErr.message}`);
    if (!existing) throw new Error('Ingredient not found');

    if (patch.name) {
      const { data: duplicate, error: duplicateErr } = await supabase
        .from('inventory_ingredients')
        .select('id')
        .ilike('name', patch.name)
        .neq('id', id)
        .eq('is_active', true)
        .maybeSingle();
      if (duplicateErr && duplicateErr.code !== 'PGRST116') {
        throw new Error(`Supabase ingredient name lookup failed: ${duplicateErr.message}`);
      }
      if (duplicate?.id) throw new Error('Ingredient name already exists');
    }

    const { data, error } = await supabase
      .from('inventory_ingredients')
      .update(patch)
      .eq('id', id)
      .eq('is_active', true)
      .select('*')
      .single();
    if (error) throw new Error(`Supabase ingredient update failed: ${error.message}`);
    const updatedIngredient = toAppInventoryIngredient(data);
    const previousQty = Number(existing.qty_on_hand || 0);
    const nextQty = Number(updatedIngredient.qtyOnHand || 0);
    const qtyDelta = Math.round((nextQty - previousQty) * 1000) / 1000;
    if (qtyDelta !== 0) {
      try {
        await recordInventoryMovement({
          ingredientId: id,
          movementType: qtyDelta > 0 ? 'IN' : 'ADJUST',
          quantity: Math.abs(qtyDelta),
          unitCost: Number(updatedIngredient.unitPrice || existing.unit_price || 0),
          referenceType: 'ingredient_update',
          referenceId: id,
          notes: `Manual stock update for "${updatedIngredient.name}": ${previousQty} -> ${nextQty} ${updatedIngredient.unit || 'pcs'}.`
        });
      } catch (movementError) {
        console.warn('[Inventory] stock update movement record failed:', movementError.message);
      }
    }
    return updatedIngredient;
  }

  const existing = inventoryIngredients.get(id);
  if (!existing || existing.isActive === false) throw new Error('Ingredient not found');
  if (patch.name) {
    const duplicate = Array.from(inventoryIngredients.values()).find((row) => {
      return row.isActive !== false
        && String(row.id || '') !== id
        && String(row.name || '').toLowerCase() === String(patch.name || '').toLowerCase();
    });
    if (duplicate) throw new Error('Ingredient name already exists');
  }

  const next = {
    ...existing,
    name: patch.name !== undefined ? patch.name : existing.name,
    qtyOnHand: patch.qty_on_hand !== undefined ? patch.qty_on_hand : existing.qtyOnHand,
    unitPrice: patch.unit_price !== undefined ? patch.unit_price : existing.unitPrice,
    reorderLevel: patch.reorder_level !== undefined ? patch.reorder_level : existing.reorderLevel,
    unit: patch.unit !== undefined ? patch.unit : existing.unit,
    updatedAt: new Date().toISOString()
  };
  inventoryIngredients.set(id, next);
  const qtyDelta = Math.round((Number(next.qtyOnHand || 0) - Number(existing.qtyOnHand || 0)) * 1000) / 1000;
  if (qtyDelta !== 0) {
    try {
      await recordInventoryMovement({
        ingredientId: id,
        movementType: qtyDelta > 0 ? 'IN' : 'ADJUST',
        quantity: Math.abs(qtyDelta),
        unitCost: Number(next.unitPrice || 0),
        referenceType: 'ingredient_update',
        referenceId: id,
        notes: `Manual stock update for "${next.name}": ${Number(existing.qtyOnHand || 0)} -> ${Number(next.qtyOnHand || 0)} ${next.unit || 'pcs'}.`
      });
    } catch (movementError) {
      console.warn('[Inventory] stock update movement record failed:', movementError.message);
    }
  }
  return toAppInventoryIngredient(next);
}

async function deleteInventoryIngredient(ingredientId) {
  const id = String(ingredientId || '').trim();
  if (!id) throw new Error('ingredientId is required');

  if (isSupabaseEnabled()) {
    const { data: existing, error: findErr } = await supabase
      .from('inventory_ingredients')
      .select('id,name')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();
    if (findErr) throw new Error(`Supabase ingredient lookup failed: ${findErr.message}`);
    if (!existing) throw new Error('Ingredient not found');

    const { data: linkedRows, error: linkedErr } = await supabase
      .from('product_recipes')
      .select('id')
      .eq('ingredient_id', id)
      .limit(1);
    if (linkedErr) throw new Error(`Supabase recipe assignment lookup failed: ${linkedErr.message}`);
    if (linkedRows?.length) {
      throw new Error('Ingredient is assigned to one or more products. Remove it from kit specification first.');
    }

    const { error } = await supabase
      .from('inventory_ingredients')
      .update({ is_active: false })
      .eq('id', id)
      .eq('is_active', true);
    if (error) throw new Error(`Supabase ingredient delete failed: ${error.message}`);
    return { id: existing.id, name: existing.name };
  }

  const existing = inventoryIngredients.get(id);
  if (!existing || existing.isActive === false) throw new Error('Ingredient not found');
  const linked = Array.from(productRecipes.values()).some((row) => String(row.ingredientId || '') === id);
  if (linked) {
    throw new Error('Ingredient is assigned to one or more products. Remove it from kit specification first.');
  }

  inventoryIngredients.set(id, {
    ...existing,
    isActive: false,
    updatedAt: new Date().toISOString()
  });
  return { id: existing.id, name: existing.name };
}

async function getInventoryReport() {
  const recentMovementsLimit = 30;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfDayIso = startOfDay.toISOString();

  if (canAttemptSupabaseRead()) {
    try {
      const [
        { data: ingredients, error: ingredientErr },
        { data: recipes, error: recipeErr },
        { data: paidInvoices, error: invoiceErr },
        recentMovementsRaw,
        todayMovementsRaw
      ] = await Promise.all([
        supabase
          .from('inventory_ingredients')
          .select('id,name,qty_on_hand,unit_price,reorder_level,unit,is_active,created_at,updated_at')
          .eq('is_active', true)
          .order('name', { ascending: true }),
        supabase
          .from('product_recipes')
          .select('id,product_id,product_name,ingredient_id,qty_per_product'),
        supabase
          .from('pos_invoices')
          .select('id')
          .eq('status', 'PAID'),
        listInventoryMovements({ limit: recentMovementsLimit }),
        listInventoryMovements({ since: startOfDayIso })
      ]);

      if (ingredientErr) throw new Error(`Supabase inventory query failed: ${ingredientErr.message}`);
      if (recipeErr) throw new Error(`Supabase recipes query failed: ${recipeErr.message}`);
      if (invoiceErr) throw new Error(`Supabase invoice query failed: ${invoiceErr.message}`);

      const paidIds = (paidInvoices || []).map((x) => x.id);
      let invoiceItems = [];
      if (paidIds.length) {
        const { data: items, error: itemErr } = await supabase
          .from('pos_invoice_items')
          .select('invoice_id,product_id,qty')
          .in('invoice_id', paidIds);
        if (itemErr) throw new Error(`Supabase invoice items query failed: ${itemErr.message}`);
        invoiceItems = items || [];
      }

      const recipesByProductId = new Map();
      (recipes || []).forEach((r) => {
        const key = r.product_id;
        if (!recipesByProductId.has(key)) recipesByProductId.set(key, []);
        recipesByProductId.get(key).push({
          productId: r.product_id,
          productName: r.product_name,
          ingredientId: r.ingredient_id,
          qtyPerProduct: Number(r.qty_per_product || 0)
        });
      });

      const usageByIngredientId = buildInventoryUsageFromInvoices({
        paidInvoices: paidInvoices || [],
        invoiceItems,
        recipesByProductId
      });

      const rows = (ingredients || []).map((ing) => {
        const usage = usageByIngredientId.get(ing.id) || { estimatedUsedQty: 0, usageByProduct: [] };
        const qtyOnHand = Number(ing.qty_on_hand || 0);
        const unitPrice = Number(ing.unit_price || 0);
        const estimatedUsedQty = Number(usage.estimatedUsedQty || 0);
        return {
          id: ing.id,
          name: ing.name,
          qtyOnHand,
          unitPrice,
          reorderLevel: Number(ing.reorder_level || 0),
          unit: ing.unit || 'pcs',
          inventoryValue: qtyOnHand * unitPrice,
          estimatedUsedQty,
          estimatedRemainingQty: qtyOnHand,
          lowStock: qtyOnHand <= Number(ing.reorder_level || 0),
          usageByProduct: usage.usageByProduct.sort((a, b) => b.estimatedUsedQty - a.estimatedUsedQty),
          createdAt: ing.created_at,
          updatedAt: ing.updated_at
        };
      }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      const totals = rows.reduce((acc, row) => {
        acc.totalIngredients += 1;
        acc.totalInventoryValue += row.inventoryValue;
        acc.totalUnitPriceValue += Number(row.unitPrice || 0);
        if (row.lowStock) acc.lowStockCount += 1;
        return acc;
      }, { totalIngredients: 0, totalInventoryValue: 0, totalUnitPriceValue: 0, lowStockCount: 0 });

      const recentMovements = await attachInventoryMovementReferences(recentMovementsRaw || []);
      const todayMovements = await attachInventoryMovementReferences(todayMovementsRaw || []);
      const monitor = buildInventoryMonitorPayload({
        ingredients: rows,
        movements: [...recentMovements, ...todayMovements.filter((row) => !recentMovements.some((recent) => recent.id === row.id))]
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      });

      markSupabaseReadHealthy();
      return { ingredients: rows, totals, monitor };
    } catch (error) {
      markSupabaseReadFailure('getInventoryReport', error);
    }
  }

  // In-memory fallback
  const recipesByProductId = new Map();
  Array.from(productRecipes.values()).forEach((r) => {
    if (!recipesByProductId.has(r.productId)) recipesByProductId.set(r.productId, []);
    recipesByProductId.get(r.productId).push(r);
  });

  const paidInvoices = Array.from(invoices.values()).filter((inv) => inv.status === 'PAID');
  const invoiceItems = paidInvoices.flatMap((inv) => (inv.lineItems || []).map((item) => ({
    invoice_id: inv.id,
    product_id: item.productId,
    qty: item.qty
  })));

  const usageByIngredientId = buildInventoryUsageFromInvoices({
    paidInvoices: paidInvoices.map((inv) => ({ id: inv.id })),
    invoiceItems,
    recipesByProductId
  });

  const rows = Array.from(inventoryIngredients.values()).map((ing) => {
    const usage = usageByIngredientId.get(ing.id) || { estimatedUsedQty: 0, usageByProduct: [] };
    const qtyOnHand = Number(ing.qtyOnHand || 0);
    const unitPrice = Number(ing.unitPrice || 0);
    const estimatedUsedQty = Number(usage.estimatedUsedQty || 0);
    return {
      id: ing.id,
      name: ing.name,
      qtyOnHand,
      unitPrice,
      reorderLevel: Number(ing.reorderLevel || 0),
      unit: ing.unit || 'pcs',
      inventoryValue: qtyOnHand * unitPrice,
      estimatedUsedQty,
      estimatedRemainingQty: qtyOnHand,
      lowStock: qtyOnHand <= Number(ing.reorderLevel || 0),
      usageByProduct: usage.usageByProduct.sort((a, b) => b.estimatedUsedQty - a.estimatedUsedQty),
      createdAt: ing.createdAt,
      updatedAt: ing.updatedAt
    };
  }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const totals = rows.reduce((acc, row) => {
    acc.totalIngredients += 1;
    acc.totalInventoryValue += row.inventoryValue;
    acc.totalUnitPriceValue += Number(row.unitPrice || 0);
    if (row.lowStock) acc.lowStockCount += 1;
    return acc;
  }, { totalIngredients: 0, totalInventoryValue: 0, totalUnitPriceValue: 0, lowStockCount: 0 });

  const [recentMovementsRaw, todayMovementsRaw] = await Promise.all([
    listInventoryMovements({ limit: recentMovementsLimit }),
    listInventoryMovements({ since: startOfDayIso })
  ]);
  const recentMovements = await attachInventoryMovementReferences(recentMovementsRaw);
  const todayMovements = await attachInventoryMovementReferences(todayMovementsRaw);
  const monitor = buildInventoryMonitorPayload({
    ingredients: rows,
    movements: [...recentMovements, ...todayMovements.filter((row) => !recentMovements.some((recent) => recent.id === row.id))]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  });

  return { ingredients: rows, totals, monitor };
}

async function getInventoryIngredientHistory(ingredientId, { limit = 50 } = {}) {
  const safeIngredientId = String(ingredientId || '').trim();
  if (!safeIngredientId) throw new Error('ingredientId is required');

  const ingredients = await listInventoryIngredients();
  const ingredient = ingredients.find((row) => String(row.id || '') === safeIngredientId);
  if (!ingredient) throw new Error('Ingredient not found');

  const movements = await attachInventoryMovementReferences(
    await listInventoryMovements({ ingredientId: safeIngredientId, limit })
  );

  let runningAfterQty = Number(ingredient.qtyOnHand || 0);
  const history = movements.map((movement) => {
    const movementType = String(movement.movementType || '').toUpperCase();
    let beforeQty = null;
    let afterQty = runningAfterQty;

    if (movementType === 'OUT') {
      beforeQty = afterQty + Number(movement.quantity || 0);
    } else if (movementType === 'IN') {
      beforeQty = afterQty - Number(movement.quantity || 0);
    } else {
      const range = extractManualStockUpdateRange(movement.notes || '');
      if (range) {
        beforeQty = range.beforeQty;
        afterQty = range.afterQty;
      }
    }

    if (beforeQty !== null) {
      runningAfterQty = beforeQty;
    }

    return {
      ...movement,
      beforeQty,
      afterQty
    };
  });

  return {
    ingredient,
    history
  };
}

async function listExpenses({ month = null, dateFrom = null, dateTo = null, limit = 200 } = {}) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 200, 1000));
  let fromIso = null;
  let toIso = null;
  if (month) {
    const range = buildMonthRange(month);
    fromIso = range.fromIso;
    toIso = range.toIso;
  } else if (dateFrom && dateTo) {
    const range = normalizeDateRange({ dateFrom, dateTo });
    fromIso = range.fromIso;
    toIso = range.toIso;
  }

  if (canAttemptSupabaseRead()) {
    try {
      let query = supabase
        .from('pos_expenses')
        .select('*')
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(safeLimit);
      if (fromIso) query = query.gte('expense_date', fromIso.slice(0, 10));
      if (toIso) query = query.lte('expense_date', toIso.slice(0, 10));
      const { data, error } = await query;
      if (error) throw new Error(`Supabase expense list failed: ${error.message}`);
      markSupabaseReadHealthy();
      return (data || []).map((row) => toAppExpense(row));
    } catch (error) {
      markSupabaseReadFailure('listExpenses', error);
    }
  }

  hydrateExpenseFallbackEntries();
  let rows = Array.from(expenseEntries.values()).map((row) => toAppExpense(row));
  if (fromIso) rows = rows.filter((row) => String(row.expenseDate || '') >= fromIso.slice(0, 10));
  if (toIso) rows = rows.filter((row) => String(row.expenseDate || '') <= toIso.slice(0, 10));
  return rows
    .sort((a, b) => {
      const aDate = `${a.expenseDate || ''} ${a.createdAt || ''}`;
      const bDate = `${b.expenseDate || ''} ${b.createdAt || ''}`;
      return bDate.localeCompare(aDate);
    })
    .slice(0, safeLimit);
}

async function createExpense({
  expenseDate,
  category,
  description,
  amount,
  note = null,
  createdByUserId = null,
  createdByEmail = null,
  createdByName = null
}) {
  const safeExpenseDate = String(expenseDate || '').trim();
  const safeCategory = String(category || '').trim() || 'Miscellaneous';
  const safeDescription = String(description || '').trim();
  const safeAmount = Number(amount || 0);
  const nowIso = new Date().toISOString();

  if (!safeExpenseDate || Number.isNaN(new Date(safeExpenseDate).getTime())) {
    throw new Error('expenseDate is required');
  }
  if (!safeDescription) {
    throw new Error('description is required');
  }
  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    throw new Error('amount must be greater than 0');
  }

  hydrateExpenseFallbackEntries();
  const payload = {
    id: uuidv4(),
    expense_date: safeExpenseDate,
    category: safeCategory,
    description: safeDescription,
    amount: safeAmount,
    note: String(note || '').trim() || null,
    created_by_user_id: String(createdByUserId || '').trim() || null,
    created_by_email: String(createdByEmail || '').trim().toLowerCase() || null,
    created_by_name: String(createdByName || '').trim() || null,
    created_at: nowIso,
    updated_at: nowIso
  };

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('pos_expenses')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw new Error(`Supabase expense create failed: ${error.message}`);
    return toAppExpense(data);
  }

  const expense = toAppExpense(payload);
  expenseEntries.set(expense.id, expense);
  persistExpenseFallbackEntries();
  return { ...expense };
}

async function getMonthlyClosingReport({ month }) {
  const range = buildMonthRange(month);
  const [salesReport, expenses, shifts, drawerMovements, topProducts, inventoryIngredients] = await Promise.all([
    getSalesReport({ dateFrom: range.fromIso, dateTo: range.toIso }),
    listExpenses({ month: range.month, limit: 500 }),
    listCashierShifts({ dateFrom: range.fromIso, dateTo: range.toIso }),
    listCashDrawerMovements({ dateFrom: range.fromIso, dateTo: range.toIso, limit: 500 }),
    getTopSalesPerProductByRange({ dateFrom: range.fromIso, dateTo: range.toIso, limit: 10 }),
    listInventoryIngredients()
  ]);

  const totalExpenses = expenses.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const expenseByCategoryMap = new Map();
  expenses.forEach((row) => {
    const key = String(row.category || 'Miscellaneous').trim() || 'Miscellaneous';
    if (!expenseByCategoryMap.has(key)) {
      expenseByCategoryMap.set(key, { category: key, totalAmount: 0, count: 0 });
    }
    const bucket = expenseByCategoryMap.get(key);
    bucket.totalAmount += Number(row.amount || 0);
    bucket.count += 1;
  });

  const drawerWithdrawals = drawerMovements
    .filter((row) => String(row.movementType || '').toLowerCase() === 'withdrawal')
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const totalDiscrepancy = shifts.reduce((sum, row) => sum + Math.abs(Number(row.discrepancy || 0)), 0);
  const cashSales = Number(salesReport.byMethod?.cash || 0);
  const digitalSales = Number(salesReport.totalSales || 0) - cashSales;
  const inventoryValueSnapshot = inventoryIngredients.reduce(
    (sum, row) => sum + (Number(row.qtyOnHand || 0) * Number(row.unitPrice || 0)),
    0
  );

  return {
    reportType: 'monthly-closing',
    generatedAt: new Date().toISOString(),
    month: range.month,
    range: {
      label: 'monthly',
      dateFrom: range.fromIso,
      dateTo: range.toIso
    },
    summary: {
      totalSales: Number(salesReport.totalSales || 0),
      totalTransactions: Number(salesReport.totalTransactions || 0),
      averageTicket: Number(salesReport.averageTicket || 0),
      cashSales,
      digitalSales,
      totalExpenses,
      netSalesAfterExpenses: Number(salesReport.totalSales || 0) - totalExpenses,
      expenseCount: expenses.length,
      drawerWithdrawals,
      totalDiscrepancy,
      inventoryValueSnapshot
    },
    expenseByCategory: Array.from(expenseByCategoryMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount),
    expenses,
    topProducts
  };
}

async function getMonthlyClosingSnapshot(month) {
  const safeMonth = buildMonthRange(month).month;

  if (canUseMonthlyClosingSnapshotsSupabase()) {
    try {
      const { data, error } = await supabase
        .from('monthly_closing_snapshots')
        .select('*')
        .eq('month', safeMonth)
        .maybeSingle();
      if (error) throw new Error(`Supabase monthly closing snapshot fetch failed: ${error.message}`);
      markSupabaseReadHealthy();
      return data ? toAppMonthlyClosingSnapshot(data) : null;
    } catch (error) {
      if (isMissingSupabaseTableError(error, 'monthly_closing_snapshots')) {
        markMonthlyClosingSnapshotsSupabaseUnavailable(error);
      } else {
        markSupabaseReadFailure('getMonthlyClosingSnapshot', error);
      }
    }
  }

  hydrateMonthlyClosingSnapshotsFallback();
  const snapshot = monthlyClosingSnapshots.get(safeMonth);
  return snapshot ? { ...snapshot } : null;
}

async function listMonthlyClosingSnapshots({ limit = 60 } = {}) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 60, 240));

  if (canUseMonthlyClosingSnapshotsSupabase()) {
    try {
      const { data, error } = await supabase
        .from('monthly_closing_snapshots')
        .select('*')
        .order('month', { ascending: false })
        .limit(safeLimit);
      if (error) throw new Error(`Supabase monthly closing snapshot list failed: ${error.message}`);
      markSupabaseReadHealthy();
      return (data || [])
        .map((row) => toAppMonthlyClosingSnapshot(row))
        .filter(Boolean);
    } catch (error) {
      if (isMissingSupabaseTableError(error, 'monthly_closing_snapshots')) {
        markMonthlyClosingSnapshotsSupabaseUnavailable(error);
      } else {
        markSupabaseReadFailure('listMonthlyClosingSnapshots', error);
      }
    }
  }

  hydrateMonthlyClosingSnapshotsFallback();
  return Array.from(monthlyClosingSnapshots.values())
    .sort((a, b) => String(b.month || '').localeCompare(String(a.month || '')))
    .slice(0, safeLimit)
    .map((snapshot) => ({ ...snapshot }));
}

async function saveMonthlyClosingSnapshot({
  month,
  report = null,
  savedByUserId = null,
  savedByEmail = null,
  savedByName = null
}) {
  const safeMonth = buildMonthRange(month).month;
  const snapshotReport = report && typeof report === 'object'
    ? { ...report, month: safeMonth }
    : await getMonthlyClosingReport({ month: safeMonth });
  const nowIso = new Date().toISOString();

  if (canUseMonthlyClosingSnapshotsSupabase()) {
    try {
      const payload = {
        month: safeMonth,
        report_json: snapshotReport,
        saved_by_user_id: String(savedByUserId || '').trim() || null,
        saved_by_email: String(savedByEmail || '').trim().toLowerCase() || null,
        saved_by_name: String(savedByName || '').trim() || null,
        saved_at: nowIso,
        updated_at: nowIso
      };
      const { data, error } = await supabase
        .from('monthly_closing_snapshots')
        .upsert(payload, { onConflict: 'month' })
        .select('*')
        .single();
      if (error) throw new Error(`Supabase monthly closing snapshot save failed: ${error.message}`);
      return toAppMonthlyClosingSnapshot(data);
    } catch (error) {
      if (isMissingSupabaseTableError(error, 'monthly_closing_snapshots')) {
        markMonthlyClosingSnapshotsSupabaseUnavailable(error);
      } else {
        console.warn('[MonthlyClosing] Supabase snapshot save failed, using fallback:', sanitizeSupabaseErrorMessage(error));
      }
    }
  }

  hydrateMonthlyClosingSnapshotsFallback();
  const snapshot = toAppMonthlyClosingSnapshot({
    month: safeMonth,
    report: snapshotReport,
    savedByUserId,
    savedByEmail,
    savedByName,
    savedAt: nowIso,
    updatedAt: nowIso
  });
  monthlyClosingSnapshots.set(safeMonth, snapshot);
  persistMonthlyClosingSnapshotsFallback();
  return { ...snapshot };
}


async function getSalesReport({ dateFrom, dateTo }) {
  const { fromIso, toIso } = normalizeDateRange({ dateFrom, dateTo });

  if (isSupabaseEnabled()) {
    try {
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('pos_invoices')
        .select('id,reference,total_amount,payment_method,status,created_at')
        .eq('status', 'PAID')
        .gte('created_at', fromIso)
        .lte('created_at', toIso)
        .order('created_at', { ascending: false });

      if (invoicesError) throw new Error(`Supabase invoices report query failed: ${invoicesError.message}`);

      const invoiceIds = (invoicesData || []).map((x) => x.id);
      let payments = [];

      if (invoiceIds.length) {
        const { data: dbPayments, error: paymentsError } = await supabase
          .from('pos_payments')
          .select('invoice_id,method,amount_paid,change_amount,paid_at')
          .in('invoice_id', invoiceIds);
        if (paymentsError) throw new Error(`Supabase payments report query failed: ${paymentsError.message}`);
        payments = dbPayments || [];
      }

      const paymentByInvoiceId = new Map(payments.map((p) => [p.invoice_id, p]));
      const salesRows = (invoicesData || []).map((inv) => {
        const p = paymentByInvoiceId.get(inv.id);
        const saleAmount = getInvoiceSaleAmount(inv);
        return {
          invoiceId: inv.id,
          reference: inv.reference,
          method: p?.method || inv.payment_method,
          // Sales should use net invoice total, not tendered cash.
          amountPaid: saleAmount,
          tenderedAmount: Number(p?.amount_paid ?? saleAmount),
          changeAmount: Number(p?.change_amount || 0),
          paidAt: p?.paid_at || inv.created_at
        };
      });

      const summary = summarizeSalesRows(salesRows);
      markSupabaseReadHealthy();
      return {
        range: { dateFrom: fromIso, dateTo: toIso },
        ...summary,
        transactions: salesRows
      };
    } catch (error) {
      markSupabaseReadFailure('getSalesReport', error);
    }
  }

  const salesRows = Array.from(invoices.values())
    .filter((inv) => inv.status === 'PAID')
    .filter((inv) => {
      const d = new Date(inv.updatedAt || inv.createdAt);
      return d >= new Date(fromIso) && d <= new Date(toIso);
    })
    .map((inv) => {
      const saleAmount = getInvoiceSaleAmount(inv);
      return {
        invoiceId: inv.id,
        reference: inv.reference,
        method: inv.payment?.method || inv.paymentMethod,
        amountPaid: saleAmount,
        tenderedAmount: Number(inv.payment?.amountPaid ?? saleAmount),
        changeAmount: Number(inv.payment?.change || 0),
        paidAt: inv.payment?.paidAt || inv.updatedAt || inv.createdAt
      };
    })
    .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

  const summary = summarizeSalesRows(salesRows);
  return {
    range: { dateFrom: fromIso, dateTo: toIso },
    ...summary,
    transactions: salesRows
  };
}

async function getTopSalesPerProduct(limit = 10) {
  const cappedLimit = Math.max(1, Math.min(Number(limit) || 10, 50));

  if (isSupabaseEnabled()) {
    try {
      const { data: paidInvoices, error: invoiceError } = await supabase
        .from('pos_invoices')
        .select('id')
        .eq('status', 'PAID');

      if (invoiceError) throw new Error(`Supabase top-products invoice query failed: ${invoiceError.message}`);

      const invoiceIds = (paidInvoices || []).map((x) => x.id);
      if (!invoiceIds.length) return [];

      const { data: itemRows, error: itemsError } = await supabase
        .from('pos_invoice_items')
        .select('product_name,qty,subtotal')
        .in('invoice_id', invoiceIds);

      if (itemsError) throw new Error(`Supabase top-products items query failed: ${itemsError.message}`);

      const grouped = new Map();
      (itemRows || []).forEach((row) => {
        const key = row.product_name || 'Unknown Product';
        const current = grouped.get(key) || { productName: key, qtySold: 0, totalSales: 0 };
        current.qtySold += Number(row.qty || 0);
        current.totalSales += Number(row.subtotal || 0);
        grouped.set(key, current);
      });

      return Array.from(grouped.values())
        .sort((a, b) => (b.totalSales - a.totalSales) || (b.qtySold - a.qtySold))
        .slice(0, cappedLimit);
    } catch (error) {
      console.warn('[Offline] getTopSalesPerProduct Supabase failed, using in-memory:', error.message);
    }
  }

  const grouped = new Map();
  Array.from(invoices.values())
    .filter((inv) => inv.status === 'PAID')
    .forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        const key = item.name || 'Unknown Product';
        const current = grouped.get(key) || { productName: key, qtySold: 0, totalSales: 0 };
        current.qtySold += Number(item.qty || 0);
        current.totalSales += Number(item.subtotal || 0);
        grouped.set(key, current);
      });
    });

  return Array.from(grouped.values())
    .sort((a, b) => (b.totalSales - a.totalSales) || (b.qtySold - a.qtySold))
    .slice(0, cappedLimit);
}

async function listAllInvoices({ dateFrom, dateTo, status } = {}) {
  const { fromIso, toIso } = dateFrom && dateTo
    ? normalizeDateRange({ dateFrom, dateTo })
    : { fromIso: null, toIso: null };

  if (isSupabaseEnabled()) {
    try {
      const invoiceSelect = 'id,reference,total_amount,subtotal_amount,discount_amount,discount_profile_json,payment_method,status,status_reason,status_changed_at,status_changed_by_user_id,status_changed_by_email,order_type,cashier_user_id,cashier_email,cashier_name,cashier_role,created_at,updated_at';
      const legacyInvoiceSelect = 'id,reference,total_amount,payment_method,status,order_type,cashier_user_id,cashier_email,cashier_name,cashier_role,created_at,updated_at';
      let query = supabase
        .from('pos_invoices')
        .select(invoiceSelect)
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);
      if (fromIso && toIso) query = query.gte('created_at', fromIso).lte('created_at', toIso);

      let { data: invoicesData, error: invoicesError } = await query;
      if (invoicesError && shouldUseLegacyInvoiceSchema(invoicesError)) {
        let legacyQuery = supabase
          .from('pos_invoices')
          .select(legacyInvoiceSelect)
          .order('created_at', { ascending: false });
        if (status) legacyQuery = legacyQuery.eq('status', status);
        if (fromIso && toIso) legacyQuery = legacyQuery.gte('created_at', fromIso).lte('created_at', toIso);
        const legacyResult = await legacyQuery;
        invoicesData = legacyResult.data;
        invoicesError = legacyResult.error;
      }
      if (invoicesError) throw new Error(`Supabase invoices query failed: ${invoicesError.message}`);

      const invoiceIds = (invoicesData || []).map((x) => x.id);
      let payments = [];
      let dbGcashSessions = [];
      let dbLineItems = [];

      if (invoiceIds.length) {
        const { data: dbPayments, error: paymentsError } = await supabase
          .from('pos_payments')
          .select('invoice_id,method,amount_paid,change_amount,paid_at,provider,provider_reference,customer_name,customer_email,customer_phone')
          .in('invoice_id', invoiceIds);
        if (paymentsError) throw new Error(`Supabase payments query failed: ${paymentsError.message}`);
        payments = dbPayments || [];

        const { data: dbSessions, error: sessionsError } = await supabase
          .from('pos_gcash_sessions')
          .select('invoice_id,reference,provider,checkout_url,status')
          .in('invoice_id', invoiceIds);
        if (!sessionsError) dbGcashSessions = dbSessions || [];

        const { data: dbItems, error: itemsError } = await supabase
          .from('pos_invoice_items')
          .select('invoice_id,subtotal')
          .in('invoice_id', invoiceIds);
        if (!itemsError) dbLineItems = dbItems || [];
      }

      const paymentByInvoiceId = new Map(payments.map((p) => [p.invoice_id, p]));
      const sessionByInvoiceId = new Map(dbGcashSessions.map((s) => [s.invoice_id, s]));
      const subtotalByInvoiceId = new Map();
      dbLineItems.forEach((item) => {
        const invoiceId = item?.invoice_id;
        const subtotal = Number(item?.subtotal || 0);
        if (!invoiceId) return;
        subtotalByInvoiceId.set(invoiceId, toMoney((subtotalByInvoiceId.get(invoiceId) || 0) + subtotal));
      });

      markSupabaseReadHealthy();
      return (invoicesData || []).map((inv) => {
        const payment = paymentByInvoiceId.get(inv.id);
        const session = sessionByInvoiceId.get(inv.id);
        const total = Number(inv.total_amount);
        const subtotal = Number(inv.subtotal_amount ?? subtotalByInvoiceId.get(inv.id) ?? total);
        const discount = Number(inv.discount_amount ?? toMoney(subtotal - total));
        const discountProfile = inferDiscountProfileFromTotals({
          subtotal,
          total,
          discount,
          explicitProfile: parseStoredDiscountProfile(inv.discount_profile_json)
        });
        const resolvedStatus = resolveInvoiceStatus(inv.status, payment ? {
          amountPaid: payment.amount_paid,
          paidAt: payment.paid_at,
          providerReference: payment.provider_reference
        } : null);
        return {
          id: inv.id,
          reference: inv.reference,
          status: resolvedStatus,
          statusReason: inv.status_reason || null,
          statusChangedAt: inv.status_changed_at || null,
          statusChangedByUserId: inv.status_changed_by_user_id || null,
          statusChangedByEmail: inv.status_changed_by_email || null,
          orderType: inv.order_type || null,
          paymentMethod: inv.payment_method,
          cashierUserId: inv.cashier_user_id || null,
          cashierEmail: inv.cashier_email || null,
          cashierName: inv.cashier_name || null,
          cashierRole: inv.cashier_role || null,
          subtotal,
          discount,
          discountProfile,
          total,
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
    } catch (error) {
      markSupabaseReadFailure('listAllInvoices', error);
    }
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
      status: resolveInvoiceStatus(inv.status, inv.payment),
      statusReason: inv.statusReason || null,
      statusChangedAt: inv.statusChangedAt || null,
      statusChangedByUserId: inv.statusChangedByUserId || null,
      statusChangedByEmail: inv.statusChangedByEmail || null,
      orderType: inv.orderType || null,
      paymentMethod: inv.paymentMethod,
      cashierUserId: inv.cashierUserId || null,
      cashierEmail: inv.cashierEmail || null,
      cashierName: inv.cashierName || null,
      cashierRole: inv.cashierRole || null,
      subtotal: inv.subtotal ?? inv.total,
      discount: inv.discount || 0,
      discountProfile: inv.discountProfile || null,
      total: inv.total,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt,
      payment: inv.payment,
      gcashSession: gcashSessions.get(inv.id) || null
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getEarliestInvoiceDate({ status } = {}) {
  const safeStatus = status ? String(status).trim().toUpperCase() : null;

  if (isSupabaseEnabled()) {
    let query = supabase
      .from('pos_invoices')
      .select('created_at')
      .order('created_at', { ascending: true })
      .limit(1);

    if (safeStatus) query = query.eq('status', safeStatus);

    const { data, error } = await query;
    if (error) throw new Error(`Supabase earliest invoice lookup failed: ${error.message}`);

    const createdAt = data?.[0]?.created_at || null;
    return createdAt ? new Date(createdAt).toISOString() : null;
  }

  let rows = Array.from(invoices.values());
  if (safeStatus) {
    rows = rows.filter((invoice) => String(invoice.status || '').trim().toUpperCase() === safeStatus);
  }
  if (!rows.length) return null;

  rows.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  const createdAt = rows[0]?.createdAt || null;
  return createdAt ? new Date(createdAt).toISOString() : null;
}

function toAppCashierShift(dbShift) {
  if (!dbShift) return null;
  return {
    id: dbShift.id,
    drawerId: dbShift.drawer_id || null,
    drawerName: dbShift.drawer_name || 'Drawer',
    cashierUserId: dbShift.cashier_user_id || null,
    cashierEmail: dbShift.cashier_email || null,
    cashierName: dbShift.cashier_name || 'Cashier',
    cashierRole: dbShift.cashier_role || 'encharge',
    shiftStartAt: dbShift.shift_start_at,
    shiftEndAt: dbShift.shift_end_at || null,
    previousShiftId: dbShift.previous_shift_id || null,
    previousDrawerBalance: dbShift.previous_drawer_balance === null || dbShift.previous_drawer_balance === undefined
      ? null
      : Number(dbShift.previous_drawer_balance),
    openingAdjustment: Number(dbShift.opening_adjustment || 0),
    startingCash: Number(dbShift.starting_cash || 0),
    expectedCash: Number(dbShift.expected_cash || 0),
    endingCash: dbShift.ending_cash === null || dbShift.ending_cash === undefined ? null : Number(dbShift.ending_cash),
    discrepancy: dbShift.discrepancy === null || dbShift.discrepancy === undefined ? null : Number(dbShift.discrepancy),
    totalSales: Number(dbShift.total_sales || 0),
    cashSales: Number(dbShift.cash_sales || 0),
    cashTendered: Number(dbShift.cash_tendered || 0),
    changeGiven: Number(dbShift.change_given || 0),
    netCashRetained: Number(dbShift.net_cash_retained || 0),
    digitalSales: Number(dbShift.digital_sales || 0),
    totalTransactions: Number(dbShift.total_transactions || 0),
    status: dbShift.status || 'active',
    reviewStatus: dbShift.review_status || 'pending',
    reviewNote: dbShift.review_note || null,
    reviewedByUserId: dbShift.reviewed_by_user_id || null,
    reviewedByEmail: dbShift.reviewed_by_email || null,
    reviewedAt: dbShift.reviewed_at || null,
    createdAt: dbShift.created_at || null,
    updatedAt: dbShift.updated_at || null
  };
}

function toAppCashDrawer(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || 'Drawer',
    initialBalance: Number(row.initial_balance || row.initialBalance || 0),
    currentBalance: Number(row.current_balance || row.currentBalance || 0),
    isActive: row.is_active === undefined ? true : Boolean(row.is_active ?? row.isActive),
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null
  };
}

function getShiftReferenceBalance(shift) {
  if (!shift) return null;
  if (shift.endingCash !== null && shift.endingCash !== undefined && Number.isFinite(Number(shift.endingCash))) {
    return Number(shift.endingCash);
  }
  if (shift.expectedCash !== null && shift.expectedCash !== undefined && Number.isFinite(Number(shift.expectedCash))) {
    return Number(shift.expectedCash);
  }
  if (shift.startingCash !== null && shift.startingCash !== undefined && Number.isFinite(Number(shift.startingCash))) {
    return Number(shift.startingCash);
  }
  return null;
}

function normalizeCashDrawerMovementType(type) {
  const key = String(type || '').trim().toLowerCase();
  if (key === 'withdrawal' || key === 'deposit' || key === 'adjustment') return key;
  return 'withdrawal';
}

function toAppCashDrawerMovement(row) {
  if (!row) return null;
  return {
    id: row.id,
    drawerId: row.drawer_id || row.drawerId || null,
    drawerName: row.drawer_name || row.drawerName || null,
    shiftId: row.shift_id || row.shiftId || null,
    movementType: normalizeCashDrawerMovementType(row.movement_type || row.movementType),
    amount: Number(row.amount || 0),
    note: row.note || null,
    performedByUserId: row.performed_by_user_id || row.performedByUserId || null,
    performedByEmail: row.performed_by_email || row.performedByEmail || null,
    performedByName: row.performed_by_name || row.performedByName || null,
    createdAt: row.created_at || row.createdAt || null
  };
}

function getCashDrawerMovementSignedAmount(movement) {
  const amount = Number(movement?.amount || 0);
  const type = normalizeCashDrawerMovementType(movement?.movementType);
  if (!Number.isFinite(amount)) return 0;
  if (type === 'deposit') return amount;
  return -amount;
}

async function getCashDrawerById(drawerId) {
  const id = String(drawerId || '').trim();
  if (!id) return null;

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('cash_drawers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(`Supabase cash drawer fetch failed: ${error.message}`);
    return toAppCashDrawer(data);
  }

  const local = cashDrawers.get(id);
  return local ? { ...local } : null;
}

async function listCashDrawers() {
  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('cash_drawers')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw new Error(`Supabase cash drawer list failed: ${error.message}`);
    return (data || []).map((row) => toAppCashDrawer(row));
  }

  return Array.from(cashDrawers.values())
    .map((row) => ({ ...row }))
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
}

async function createCashDrawer({
  name,
  initialBalance = 0
}) {
  const safeName = String(name || '').trim();
  const safeInitialBalance = Number(initialBalance || 0);
  if (!safeName) throw new Error('name is required');
  if (!Number.isFinite(safeInitialBalance) || safeInitialBalance <= 0) {
    throw new Error('initialBalance must be greater than 0');
  }

  if (isSupabaseEnabled()) {
    const { data: existing, error: existingError } = await supabase
      .from('cash_drawers')
      .select('id')
      .ilike('name', safeName)
      .maybeSingle();
    if (existingError && existingError.code !== 'PGRST116') {
      throw new Error(`Supabase cash drawer lookup failed: ${existingError.message}`);
    }
    if (existing?.id) throw new Error('Drawer name already exists');

    const row = {
      id: uuidv4(),
      name: safeName,
      initial_balance: safeInitialBalance,
      current_balance: safeInitialBalance,
      is_active: true
    };
    const { data, error } = await supabase
      .from('cash_drawers')
      .insert(row)
      .select('*')
      .single();
    if (error) throw new Error(`Supabase cash drawer create failed: ${error.message}`);
    return toAppCashDrawer(data);
  }

  const exists = Array.from(cashDrawers.values()).some((drawer) => String(drawer.name || '').toLowerCase() === safeName.toLowerCase());
  if (exists) throw new Error('Drawer name already exists');

  const nowIso = new Date().toISOString();
  const drawer = {
    id: uuidv4(),
    name: safeName,
    initialBalance: safeInitialBalance,
    currentBalance: safeInitialBalance,
    isActive: true,
    createdAt: nowIso,
    updatedAt: nowIso
  };
  cashDrawers.set(drawer.id, drawer);
  return { ...drawer };
}

async function getCashDrawerUsageStats(drawerId) {
  const safeDrawerId = String(drawerId || '').trim();
  if (!safeDrawerId) throw new Error('drawerId is required');

  if (isSupabaseEnabled()) {
    const [
      { count: shiftCount, error: shiftError },
      { count: movementCount, error: movementError }
    ] = await Promise.all([
      supabase
        .from('cashier_shifts')
        .select('id', { count: 'exact', head: true })
        .eq('drawer_id', safeDrawerId),
      supabase
        .from('cash_drawer_movements')
        .select('id', { count: 'exact', head: true })
        .eq('drawer_id', safeDrawerId)
    ]);

    if (shiftError) throw new Error(`Supabase cash drawer shift usage lookup failed: ${shiftError.message}`);
    if (movementError) throw new Error(`Supabase cash drawer movement usage lookup failed: ${movementError.message}`);

    const normalizedShiftCount = Number(shiftCount || 0);
    const normalizedMovementCount = Number(movementCount || 0);
    return {
      shiftCount: normalizedShiftCount,
      movementCount: normalizedMovementCount,
      hasTransactions: normalizedShiftCount > 0 || normalizedMovementCount > 0
    };
  }

  const shiftCount = Array.from(cashierShifts.values()).filter((shift) => String(shift.drawerId || '') === safeDrawerId).length;
  const movementCount = Array.from(cashDrawerMovements.values()).filter((movement) => String(movement.drawerId || '') === safeDrawerId).length;
  return {
    shiftCount,
    movementCount,
    hasTransactions: shiftCount > 0 || movementCount > 0
  };
}

async function updateCashDrawer(drawerId, {
  name,
  initialBalance
}) {
  const safeDrawerId = String(drawerId || '').trim();
  if (!safeDrawerId) throw new Error('drawerId is required');

  const drawer = await getCashDrawerById(safeDrawerId);
  if (!drawer) throw new Error('Drawer not found');

  const usage = await getCashDrawerUsageStats(safeDrawerId);
  if (usage.hasTransactions) {
    throw new Error('Drawer cannot be edited after it has transactions or shift history.');
  }

  const safeName = String(name || '').trim();
  const safeInitialBalance = Number(initialBalance || 0);
  if (!safeName) throw new Error('name is required');
  if (!Number.isFinite(safeInitialBalance) || safeInitialBalance <= 0) {
    throw new Error('initialBalance must be greater than 0');
  }

  if (isSupabaseEnabled()) {
    const { data: duplicate, error: duplicateError } = await supabase
      .from('cash_drawers')
      .select('id')
      .ilike('name', safeName)
      .neq('id', safeDrawerId)
      .maybeSingle();
    if (duplicateError && duplicateError.code !== 'PGRST116') {
      throw new Error(`Supabase cash drawer duplicate lookup failed: ${duplicateError.message}`);
    }
    if (duplicate?.id) throw new Error('Drawer name already exists');

    const { data, error } = await supabase
      .from('cash_drawers')
      .update({
        name: safeName,
        initial_balance: safeInitialBalance,
        current_balance: safeInitialBalance
      })
      .eq('id', safeDrawerId)
      .select('*')
      .single();
    if (error) throw new Error(`Supabase cash drawer update failed: ${error.message}`);
    return toAppCashDrawer(data);
  }

  const exists = Array.from(cashDrawers.values()).some((row) => String(row.id || '') !== safeDrawerId && String(row.name || '').toLowerCase() === safeName.toLowerCase());
  if (exists) throw new Error('Drawer name already exists');

  const nextDrawer = {
    ...drawer,
    name: safeName,
    initialBalance: safeInitialBalance,
    currentBalance: safeInitialBalance,
    updatedAt: new Date().toISOString()
  };
  cashDrawers.set(safeDrawerId, nextDrawer);
  return { ...nextDrawer };
}

async function deleteCashDrawer(drawerId) {
  const safeDrawerId = String(drawerId || '').trim();
  if (!safeDrawerId) throw new Error('drawerId is required');

  const drawer = await getCashDrawerById(safeDrawerId);
  if (!drawer) throw new Error('Drawer not found');

  const usage = await getCashDrawerUsageStats(safeDrawerId);
  if (usage.hasTransactions) {
    throw new Error('Drawer cannot be deleted after it has transactions or shift history.');
  }

  if (isSupabaseEnabled()) {
    const { error } = await supabase
      .from('cash_drawers')
      .delete()
      .eq('id', safeDrawerId);
    if (error) throw new Error(`Supabase cash drawer delete failed: ${error.message}`);
    return drawer;
  }

  cashDrawers.delete(safeDrawerId);
  return drawer;
}

async function setCashDrawerCurrentBalance(drawerId, currentBalance) {
  const safeBalance = Number(currentBalance || 0);
  if (!Number.isFinite(safeBalance) || safeBalance < 0) {
    throw new Error('currentBalance must be >= 0');
  }
  const drawer = await getCashDrawerById(drawerId);
  if (!drawer) throw new Error('Drawer not found');

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('cash_drawers')
      .update({
        current_balance: safeBalance
      })
      .eq('id', drawer.id)
      .select('*')
      .single();
    if (error) throw new Error(`Supabase cash drawer balance update failed: ${error.message}`);
    return toAppCashDrawer(data);
  }

  const next = {
    ...drawer,
    currentBalance: safeBalance,
    updatedAt: new Date().toISOString()
  };
  cashDrawers.set(next.id, next);
  return { ...next };
}

function normalizeShiftReviewStatus(status) {
  const key = String(status || '').trim().toLowerCase();
  if (key === 'approved' || key === 'investigate' || key === 'pending') return key;
  return 'pending';
}

async function startCashierShift({
  shiftId = null,
  drawerId = null,
  cashierUserId = null,
  cashierEmail = null,
  cashierName = null,
  cashierRole = 'encharge',
  previousShiftId = null,
  previousDrawerBalance = null,
  openingAdjustment = null,
  startingCash = 0,
  shiftStartAt = null
}) {
  const safeDrawerId = String(drawerId || '').trim();
  const email = String(cashierEmail || '').trim().toLowerCase();
  const name = String(cashierName || '').trim() || 'Cashier';
  const role = String(cashierRole || 'encharge').trim().toLowerCase();
  const safeStartCash = Number(startingCash || 0);
  const safePreviousDrawerBalance = previousDrawerBalance === null || previousDrawerBalance === undefined
    ? null
    : Number(previousDrawerBalance);
  const safeOpeningAdjustment = openingAdjustment === null || openingAdjustment === undefined || openingAdjustment === ''
    ? 0
    : Math.round(Number(openingAdjustment) * 100) / 100;
  if (!safeDrawerId) throw new Error('drawerId is required');
  if (!email) throw new Error('cashierEmail is required');
  if (!Number.isFinite(safeStartCash) || safeStartCash < 0) throw new Error('startingCash must be >= 0');
  if (safePreviousDrawerBalance !== null && (!Number.isFinite(safePreviousDrawerBalance) || safePreviousDrawerBalance < 0)) {
    throw new Error('previousDrawerBalance must be >= 0');
  }
  if (!Number.isFinite(safeOpeningAdjustment)) {
    throw new Error('openingAdjustment must be a valid amount');
  }
  const nowIso = String(shiftStartAt || new Date().toISOString());
  const drawer = await getCashDrawerById(safeDrawerId);
  if (!drawer) throw new Error('Drawer not found');

  if (isSupabaseEnabled()) {
    const { data: activeDrawerData, error: activeDrawerErr } = await supabase
      .from('cashier_shifts')
      .select('*')
      .eq('drawer_id', safeDrawerId)
      .eq('status', 'active')
      .order('shift_start_at', { ascending: false })
      .limit(1);
    if (activeDrawerErr) throw new Error(`Supabase active drawer shift lookup failed: ${activeDrawerErr.message}`);
    if (activeDrawerData?.[0]) return toAppCashierShift(activeDrawerData[0]);

    const activeQuery = supabase
      .from('cashier_shifts')
      .select('*')
      .eq('status', 'active')
      .order('shift_start_at', { ascending: false })
      .limit(1);
    const { data: activeData, error: activeErr } = cashierUserId
      ? await activeQuery.eq('cashier_user_id', cashierUserId)
      : await activeQuery.eq('cashier_email', email);
    if (activeErr) throw new Error(`Supabase active shift lookup failed: ${activeErr.message}`);
    if (activeData?.[0]) return toAppCashierShift(activeData[0]);

    const row = {
      id: shiftId || uuidv4(),
      drawer_id: safeDrawerId,
      drawer_name: drawer.name,
      cashier_user_id: cashierUserId || null,
      cashier_email: email,
      cashier_name: name,
      cashier_role: role,
      previous_shift_id: String(previousShiftId || '').trim() || null,
      previous_drawer_balance: safePreviousDrawerBalance,
      opening_adjustment: safeOpeningAdjustment,
      shift_start_at: nowIso,
      starting_cash: safeStartCash,
      expected_cash: safeStartCash,
      ending_cash: null,
      discrepancy: null,
      total_sales: 0,
      cash_sales: 0,
      digital_sales: 0,
      total_transactions: 0,
      status: 'active',
      review_status: 'pending',
      review_note: null,
      reviewed_by_user_id: null,
      reviewed_by_email: null,
      reviewed_at: null
    };

    const { data, error } = await supabase
      .from('cashier_shifts')
      .insert(row)
      .select('*')
      .single();
    if (error) throw new Error(`Supabase shift create failed: ${error.message}`);
    await setCashDrawerCurrentBalance(safeDrawerId, safeStartCash);
    return toAppCashierShift(data);
  }

  const existingDrawerShift = Array.from(cashierShifts.values()).find((x) => {
    return x.status === 'active' && String(x.drawerId || '') === safeDrawerId;
  });
  if (existingDrawerShift) return { ...existingDrawerShift };

  const existing = Array.from(cashierShifts.values()).find((x) => {
    if (x.status !== 'active') return false;
    if (cashierUserId) return String(x.cashierUserId || '') === String(cashierUserId);
    return String(x.cashierEmail || '').toLowerCase() === email;
  });
  if (existing) return { ...existing };

  const shift = {
    id: shiftId || uuidv4(),
    drawerId: safeDrawerId,
    drawerName: drawer.name,
    cashierUserId: cashierUserId || null,
    cashierEmail: email,
    cashierName: name,
    cashierRole: role,
    previousShiftId: String(previousShiftId || '').trim() || null,
    previousDrawerBalance: safePreviousDrawerBalance,
    openingAdjustment: safeOpeningAdjustment,
    shiftStartAt: nowIso,
    shiftEndAt: null,
    startingCash: safeStartCash,
    expectedCash: safeStartCash,
    endingCash: null,
    discrepancy: null,
    totalSales: 0,
    cashSales: 0,
    cashTendered: 0,
    changeGiven: 0,
    netCashRetained: 0,
    digitalSales: 0,
    totalTransactions: 0,
    status: 'active',
    reviewStatus: 'pending',
    reviewNote: null,
    reviewedByUserId: null,
    reviewedByEmail: null,
    reviewedAt: null,
    createdAt: nowIso,
    updatedAt: nowIso
  };
  cashierShifts.set(shift.id, shift);
  await setCashDrawerCurrentBalance(safeDrawerId, safeStartCash);
  return { ...shift };
}

async function getCashierShiftById(shiftId) {
  const id = String(shiftId || '').trim();
  if (!id) return null;

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('cashier_shifts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(`Supabase shift fetch failed: ${error.message}`);
    return toAppCashierShift(data);
  }

  const local = cashierShifts.get(id);
  return local ? { ...local } : null;
}

async function listCashierShifts({ status = null, dateFrom = null, dateTo = null, discrepancyOnly = false } = {}) {
  const fromIso = dateFrom ? new Date(dateFrom).toISOString() : null;
  const toIso = dateTo ? new Date(dateTo).toISOString() : null;
  const safeStatus = status ? String(status).trim().toLowerCase() : null;

  if (canAttemptSupabaseRead()) {
    try {
      let query = supabase
        .from('cashier_shifts')
        .select('*')
        .order('shift_start_at', { ascending: false });

      if (safeStatus) query = query.eq('status', safeStatus);
      if (fromIso) query = query.gte('shift_start_at', fromIso);
      if (toIso) query = query.lte('shift_start_at', toIso);
      if (discrepancyOnly) query = query.neq('discrepancy', 0);

      const { data, error } = await query;
      if (error) throw new Error(`Supabase shifts list failed: ${error.message}`);
      markSupabaseReadHealthy();
      return (data || []).map((x) => toAppCashierShift(x));
    } catch (error) {
      markSupabaseReadFailure('listCashierShifts', error);
    }
  }

  let rows = Array.from(cashierShifts.values());
  if (safeStatus) rows = rows.filter((x) => String(x.status || '').toLowerCase() === safeStatus);
  if (fromIso) rows = rows.filter((x) => new Date(x.shiftStartAt) >= new Date(fromIso));
  if (toIso) rows = rows.filter((x) => new Date(x.shiftStartAt) <= new Date(toIso));
  if (discrepancyOnly) rows = rows.filter((x) => Number(x.discrepancy || 0) !== 0);
  return rows
    .map((x) => ({ ...x }))
    .sort((a, b) => new Date(b.shiftStartAt) - new Date(a.shiftStartAt));
}

async function getCashierShiftOpeningContext({
  drawerId = null,
  cashierUserId = null,
  cashierEmail = null
} = {}) {
  const safeDrawerId = String(drawerId || '').trim() || null;
  const email = String(cashierEmail || '').trim().toLowerCase();
  const userId = String(cashierUserId || '').trim() || null;
  const drawer = safeDrawerId ? await getCashDrawerById(safeDrawerId) : null;
  if (safeDrawerId && !drawer) throw new Error('Drawer not found');

  if (isSupabaseEnabled()) {
    let activeQuery = supabase
      .from('cashier_shifts')
      .select('*')
      .eq('status', 'active')
      .order('shift_start_at', { ascending: false })
      .limit(1);
    if (safeDrawerId) activeQuery = activeQuery.eq('drawer_id', safeDrawerId);
    else if (userId) activeQuery = activeQuery.eq('cashier_user_id', userId);
    else activeQuery = activeQuery.eq('cashier_email', email);
    const { data: activeData, error: activeErr } = await activeQuery;
    if (activeErr) throw new Error(`Supabase active shift lookup failed: ${activeErr.message}`);

    let previousQuery = supabase
      .from('cashier_shifts')
      .select('*')
      .eq('status', 'logged_out')
      .order('shift_end_at', { ascending: false })
      .limit(1);
    if (safeDrawerId) previousQuery = previousQuery.eq('drawer_id', safeDrawerId);
    const { data: previousData, error: previousErr } = await previousQuery;
    if (previousErr) throw new Error(`Supabase previous shift lookup failed: ${previousErr.message}`);

    const activeShift = toAppCashierShift(activeData?.[0] || null);
    const previousShift = toAppCashierShift(previousData?.[0] || null);
    return {
      drawer,
      activeShift,
      previousShift,
      previousDrawerBalance: drawer?.currentBalance ?? getShiftReferenceBalance(previousShift)
    };
  }

  const shifts = Array.from(cashierShifts.values());
  const activeShift = shifts.find((x) => {
    if (String(x.status || '').toLowerCase() !== 'active') return false;
    if (safeDrawerId) return String(x.drawerId || '') === safeDrawerId;
    if (userId) return String(x.cashierUserId || '') === userId;
    return String(x.cashierEmail || '').toLowerCase() === email;
  }) || null;
  const previousShift = shifts
    .filter((x) => String(x.status || '').toLowerCase() === 'logged_out')
    .filter((x) => !safeDrawerId || String(x.drawerId || '') === safeDrawerId)
    .sort((a, b) => new Date(b.shiftEndAt || b.updatedAt || 0) - new Date(a.shiftEndAt || a.updatedAt || 0))[0] || null;

  return {
    drawer: drawer ? { ...drawer } : null,
    activeShift: activeShift ? { ...activeShift } : null,
    previousShift: previousShift ? { ...previousShift } : null,
    previousDrawerBalance: drawer?.currentBalance ?? getShiftReferenceBalance(previousShift)
  };
}

async function listCashDrawerMovements({ drawerId = null, shiftId = null, dateFrom = null, dateTo = null, limit = 50 } = {}) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 5000));
  const safeDrawerId = String(drawerId || '').trim() || null;
  const safeShiftId = String(shiftId || '').trim() || null;
  const hasDateRange = Boolean(dateFrom && dateTo);
  const range = hasDateRange ? normalizeDateRange({ dateFrom, dateTo }) : null;

  if (canAttemptSupabaseRead()) {
    try {
      let query = supabase
        .from('cash_drawer_movements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(safeLimit);
      if (safeDrawerId) query = query.eq('drawer_id', safeDrawerId);
      if (safeShiftId) query = query.eq('shift_id', safeShiftId);
      if (range?.fromIso) query = query.gte('created_at', range.fromIso);
      if (range?.toIso) query = query.lte('created_at', range.toIso);
      const { data, error } = await query;
      if (error) throw new Error(`Supabase cash drawer movement list failed: ${error.message}`);
      markSupabaseReadHealthy();
      return (data || []).map((row) => toAppCashDrawerMovement(row));
    } catch (error) {
      markSupabaseReadFailure('listCashDrawerMovements', error);
    }
  }

  let rows = Array.from(cashDrawerMovements.values());
  if (safeDrawerId) rows = rows.filter((row) => String(row.drawerId || '') === safeDrawerId);
  if (safeShiftId) rows = rows.filter((row) => String(row.shiftId || '') === safeShiftId);
  if (range?.fromIso) rows = rows.filter((row) => new Date(row.createdAt || 0) >= new Date(range.fromIso));
  if (range?.toIso) rows = rows.filter((row) => new Date(row.createdAt || 0) <= new Date(range.toIso));
  return rows
    .map((row) => ({ ...row }))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, safeLimit);
}

async function createCashDrawerMovement({
  drawerId,
  shiftId,
  movementType = 'withdrawal',
  amount,
  note = null,
  performedByUserId = null,
  performedByEmail = null,
  performedByName = null
}) {
  const safeDrawerId = String(drawerId || '').trim();
  const safeShiftId = String(shiftId || '').trim();
  const safeMovementType = normalizeCashDrawerMovementType(movementType);
  const safeAmount = Number(amount || 0);
  const safeNote = note ? String(note).trim() : null;
  const safePerformedByName = String(performedByName || '').trim() || null;
  const safePerformedByEmail = String(performedByEmail || '').trim().toLowerCase() || null;
  const safePerformedByUserId = String(performedByUserId || '').trim() || null;

  if (!safeDrawerId) throw new Error('drawerId is required');
  if (!Number.isFinite(safeAmount) || safeAmount <= 0) throw new Error('amount must be greater than 0');
  const drawer = await getCashDrawerById(safeDrawerId);
  if (!drawer) throw new Error('Drawer not found');
  const shift = safeShiftId ? await getCashierShiftById(safeShiftId) : null;
  if (safeShiftId && !shift) throw new Error('Shift not found');

  if (isSupabaseEnabled()) {
    const row = {
      id: uuidv4(),
      drawer_id: safeDrawerId,
      drawer_name: drawer.name,
      shift_id: safeShiftId || null,
      movement_type: safeMovementType,
      amount: safeAmount,
      note: safeNote,
      performed_by_user_id: safePerformedByUserId,
      performed_by_email: safePerformedByEmail,
      performed_by_name: safePerformedByName
    };
    const { data, error } = await supabase
      .from('cash_drawer_movements')
      .insert(row)
      .select('*')
      .single();
    if (error) throw new Error(`Supabase cash drawer movement create failed: ${error.message}`);
    const movement = toAppCashDrawerMovement(data);
    if (!shift || String(shift.status || '').toLowerCase() !== 'active') {
      const nextBalance = Math.round((Number(drawer.currentBalance || 0) + getCashDrawerMovementSignedAmount(movement)) * 100) / 100;
      await setCashDrawerCurrentBalance(safeDrawerId, Math.max(0, nextBalance));
    }
    return movement;
  }

  const createdAt = new Date().toISOString();
  const movement = {
    id: uuidv4(),
    drawerId: safeDrawerId,
    drawerName: drawer.name,
    shiftId: safeShiftId || null,
    movementType: safeMovementType,
    amount: safeAmount,
    note: safeNote,
    performedByUserId: safePerformedByUserId,
    performedByEmail: safePerformedByEmail,
    performedByName: safePerformedByName,
    createdAt
  };
  cashDrawerMovements.set(movement.id, movement);
  if (!shift || String(shift.status || '').toLowerCase() !== 'active') {
    const nextBalance = Math.round((Number(drawer.currentBalance || 0) + getCashDrawerMovementSignedAmount(movement)) * 100) / 100;
    await setCashDrawerCurrentBalance(safeDrawerId, Math.max(0, nextBalance));
  }
  return { ...movement };
}

async function getCashierShiftSummary(shiftIdOrRow) {
  const shift = typeof shiftIdOrRow === 'string'
    ? await getCashierShiftById(shiftIdOrRow)
    : shiftIdOrRow;
  if (!shift) throw new Error('Shift not found');

  const dateFrom = shift.shiftStartAt;
  const dateTo = shift.shiftEndAt || new Date().toISOString();
  const transactions = await listAllInvoices({ dateFrom, dateTo });
  const shiftTransactions = (transactions || []).filter((txn) => {
    if (shift.cashierUserId) {
      return String(txn.cashierUserId || '') === String(shift.cashierUserId);
    }
    return String(txn.cashierEmail || '').toLowerCase() === String(shift.cashierEmail || '').toLowerCase();
  });
  const paidTransactions = shiftTransactions.filter((txn) => normalizeInvoiceStatus(txn.status) === 'PAID');
  const holdForVoidTransactions = shiftTransactions.filter((txn) => normalizeInvoiceStatus(txn.status) === 'HOLD_FOR_VOID');
  const voidedTransactions = shiftTransactions.filter((txn) => normalizeInvoiceStatus(txn.status) === 'VOIDED');

  const paymentMethods = {};
  let totalSales = 0;
  let cashSales = 0;
  let cashTendered = 0;
  let changeGiven = 0;
  let holdForVoidAmount = 0;
  let holdForVoidCashAmount = 0;
  let voidedAmount = 0;
  let voidedCashAmount = 0;
  const getTrackedPaymentMethod = (txn, fallback = 'other') => String(txn?.payment?.method || txn?.paymentMethod || fallback).toLowerCase();
  holdForVoidTransactions.forEach((txn) => {
    const amount = getInvoiceSaleAmount(txn);
    holdForVoidAmount += amount;
    const method = getTrackedPaymentMethod(txn);
    if (method === 'cash') {
      const tendered = Number(txn?.payment?.amountPaid ?? amount);
      const change = Number(txn?.payment?.change ?? 0);
      holdForVoidCashAmount += Number.isFinite(tendered) ? (tendered - Math.max(0, change)) : amount;
    }
  });
  voidedTransactions.forEach((txn) => {
    const amount = getInvoiceSaleAmount(txn);
    voidedAmount += amount;
    const method = getTrackedPaymentMethod(txn);
    if (method === 'cash') {
      const tendered = Number(txn?.payment?.amountPaid ?? amount);
      const change = Number(txn?.payment?.change ?? 0);
      voidedCashAmount += Number.isFinite(tendered) ? (tendered - Math.max(0, change)) : amount;
    }
  });
  paidTransactions.forEach((txn) => {
    const method = getTrackedPaymentMethod(txn);
    const amount = getInvoiceSaleAmount(txn);
    totalSales += amount;
    paymentMethods[method] = (paymentMethods[method] || 0) + amount;
    if (method === 'cash') {
      cashSales += amount;
      const tendered = Number(txn?.payment?.amountPaid ?? amount);
      const change = Number(txn?.payment?.change ?? 0);
      cashTendered += Number.isFinite(tendered) ? tendered : amount;
      changeGiven += Number.isFinite(change) ? Math.max(0, change) : 0;
    }
  });
  const drawerMovements = await listCashDrawerMovements({ shiftId: shift.id, limit: 500 });
  const drawerNetAdjustments = drawerMovements.reduce((sum, movement) => {
    return sum + getCashDrawerMovementSignedAmount(movement);
  }, 0);
  const cashWithdrawals = drawerMovements
    .filter((movement) => movement.movementType === 'withdrawal')
    .reduce((sum, movement) => sum + Number(movement.amount || 0), 0);
  const digitalSales = totalSales - cashSales;
  const netCashRetained = cashTendered - changeGiven;
  const expectedCashBalance = Number(shift.startingCash || 0) + cashSales + holdForVoidCashAmount + drawerNetAdjustments;

  return {
    shiftId: shift.id,
    totalSales,
    totalTransactions: paidTransactions.length,
    cashSales,
    cashTendered,
    changeGiven,
    netCashRetained,
    digitalSales,
    holdForVoidCount: holdForVoidTransactions.length,
    holdForVoidAmount,
    holdForVoidCashAmount,
    voidedCount: voidedTransactions.length,
    voidedAmount,
    voidedCashAmount,
    paymentMethods,
    cashWithdrawals,
    drawerNetAdjustments,
    cashDrawerMovements: drawerMovements,
    expectedCashBalance,
    transactions: shiftTransactions
  };
}

async function closeCashierShift({
  shiftId,
  endingCash,
  reviewedByUserId = null,
  reviewedByEmail = null
}) {
  const shift = await getCashierShiftById(shiftId);
  if (!shift) throw new Error('Shift not found');
  if (String(shift.status || '').toLowerCase() !== 'active') {
    throw new Error('Shift is already closed');
  }

  const safeEndingCash = Number(endingCash);
  if (!Number.isFinite(safeEndingCash) || safeEndingCash < 0) {
    throw new Error('endingCash must be >= 0');
  }

  const summary = await getCashierShiftSummary(shift);
  const discrepancy = safeEndingCash - Number(summary.expectedCashBalance || 0);
  const nowIso = new Date().toISOString();
  const reviewStatus = discrepancy === 0 ? 'approved' : 'pending';

  if (isSupabaseEnabled()) {
    const patch = {
      shift_end_at: nowIso,
      ending_cash: safeEndingCash,
      expected_cash: Number(summary.expectedCashBalance || 0),
      discrepancy,
      total_sales: Number(summary.totalSales || 0),
      cash_sales: Number(summary.cashSales || 0),
      cash_tendered: Number(summary.cashTendered || 0),
      change_given: Number(summary.changeGiven || 0),
      net_cash_retained: Number(summary.netCashRetained || 0),
      digital_sales: Number(summary.digitalSales || 0),
      total_transactions: Number(summary.totalTransactions || 0),
      status: 'logged_out',
      review_status: reviewStatus,
      reviewed_by_user_id: reviewStatus === 'approved' ? reviewedByUserId : null,
      reviewed_by_email: reviewStatus === 'approved' ? reviewedByEmail : null,
      reviewed_at: reviewStatus === 'approved' ? nowIso : null
    };
    let updateResult = await supabase
      .from('cashier_shifts')
      .update(patch)
      .eq('id', shift.id)
      .select('*')
      .single();

    if (updateResult.error && /cash_tendered|change_given|net_cash_retained/i.test(String(updateResult.error.message || ''))) {
      const patchLegacy = { ...patch };
      delete patchLegacy.cash_tendered;
      delete patchLegacy.change_given;
      delete patchLegacy.net_cash_retained;
      updateResult = await supabase
        .from('cashier_shifts')
        .update(patchLegacy)
        .eq('id', shift.id)
        .select('*')
        .single();
    }
    if (updateResult.error) throw new Error(`Supabase shift close failed: ${updateResult.error.message}`);
    const data = updateResult.data;
    if (shift.drawerId) {
      await setCashDrawerCurrentBalance(shift.drawerId, safeEndingCash);
    }

    return {
      shift: toAppCashierShift(data),
      summary: {
        ...summary,
        expectedCashBalance: Number(summary.expectedCashBalance || 0),
        endingCash: safeEndingCash,
        discrepancy
      }
    };
  }

  const nextShift = {
    ...shift,
    shiftEndAt: nowIso,
    endingCash: safeEndingCash,
    expectedCash: Number(summary.expectedCashBalance || 0),
    discrepancy,
    totalSales: Number(summary.totalSales || 0),
    cashSales: Number(summary.cashSales || 0),
    cashTendered: Number(summary.cashTendered || 0),
    changeGiven: Number(summary.changeGiven || 0),
    netCashRetained: Number(summary.netCashRetained || 0),
    digitalSales: Number(summary.digitalSales || 0),
    totalTransactions: Number(summary.totalTransactions || 0),
    status: 'logged_out',
    reviewStatus
  };
  cashierShifts.set(nextShift.id, nextShift);
  if (shift.drawerId) {
    await setCashDrawerCurrentBalance(shift.drawerId, safeEndingCash);
  }
  return {
    shift: { ...nextShift },
      summary: {
        ...summary,
        endingCash: safeEndingCash,
        discrepancy
      }
  };
}

async function reviewCashierShift({
  shiftId,
  reviewStatus,
  reviewNote = null,
  reviewedByUserId = null,
  reviewedByEmail = null
}) {
  const shift = await getCashierShiftById(shiftId);
  if (!shift) throw new Error('Shift not found');

  const status = normalizeShiftReviewStatus(reviewStatus);
  const note = reviewNote ? String(reviewNote).trim() : null;
  const nowIso = new Date().toISOString();

  if (Number(shift.discrepancy || 0) !== 0 && !note) {
    throw new Error('A review note is required when reconciling or investigating a discrepancy.');
  }

  if (isSupabaseEnabled()) {
    const { data, error } = await supabase
      .from('cashier_shifts')
      .update({
        review_status: status,
        review_note: note,
        reviewed_by_user_id: reviewedByUserId || null,
        reviewed_by_email: reviewedByEmail || null,
        reviewed_at: nowIso
      })
      .eq('id', shift.id)
      .select('*')
      .single();
    if (error) throw new Error(`Supabase shift review update failed: ${error.message}`);
    return toAppCashierShift(data);
  }

  const next = {
    ...shift,
    reviewStatus: status,
    reviewNote: note,
    reviewedByUserId: reviewedByUserId || null,
    reviewedByEmail: reviewedByEmail || null,
    reviewedAt: nowIso
  };
  cashierShifts.set(next.id, next);
  return { ...next };
}

async function listActiveCashierMonitoring() {
  const activeShifts = await listCashierShifts({ status: 'active' });
  const rows = await Promise.all(activeShifts.map(async (shift) => {
    const summary = await getCashierShiftSummary(shift);
    return {
      shiftId: shift.id,
      drawerId: shift.drawerId || null,
      drawerName: shift.drawerName || 'Drawer',
      cashierUserId: shift.cashierUserId,
      cashierEmail: shift.cashierEmail,
      cashierName: shift.cashierName,
      loginTime: shift.shiftStartAt,
      startingCash: shift.startingCash,
      currentSales: Number(summary.totalSales || 0),
      holdForVoidCount: Number(summary.holdForVoidCount || 0),
      holdForVoidAmount: Number(summary.holdForVoidAmount || 0),
      cashWithdrawals: Number(summary.cashWithdrawals || 0),
      currentDrawerBalance: Number(summary.expectedCashBalance || 0),
      cashTendered: Number(summary.cashTendered || 0),
      changeGiven: Number(summary.changeGiven || 0),
      netCashRetained: Number(summary.netCashRetained || 0),
      totalTransactions: Number(summary.totalTransactions || 0),
      status: 'active'
    };
  }));
  return rows.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));
}

async function getTopSalesPerProductByRange({ dateFrom, dateTo, limit = 10 }) {
  const { fromIso, toIso } = normalizeDateRange({ dateFrom, dateTo });
  const cappedLimit = Math.max(1, Math.min(Number(limit) || 10, 50));

  if (canAttemptSupabaseRead()) {
    try {
      const { data: paidInvoices, error: invoiceError } = await supabase
        .from('pos_invoices')
        .select('id')
        .eq('status', 'PAID')
        .gte('created_at', fromIso)
        .lte('created_at', toIso);
      if (invoiceError) throw new Error(`Supabase top-products by range invoice query failed: ${invoiceError.message}`);

      const invoiceIds = (paidInvoices || []).map((x) => x.id);
      if (!invoiceIds.length) return [];

      const { data: itemRows, error: itemsError } = await supabase
        .from('pos_invoice_items')
        .select('product_name,qty,subtotal')
        .in('invoice_id', invoiceIds);
      if (itemsError) throw new Error(`Supabase top-products by range items query failed: ${itemsError.message}`);

      const grouped = new Map();
      (itemRows || []).forEach((row) => {
        const key = row.product_name || 'Unknown Product';
        const current = grouped.get(key) || { productName: key, qtySold: 0, totalSales: 0 };
        current.qtySold += Number(row.qty || 0);
        current.totalSales += Number(row.subtotal || 0);
        grouped.set(key, current);
      });

      markSupabaseReadHealthy();
      return Array.from(grouped.values())
        .sort((a, b) => (b.totalSales - a.totalSales) || (b.qtySold - a.qtySold))
        .slice(0, cappedLimit);
    } catch (error) {
      markSupabaseReadFailure('getTopSalesPerProductByRange', error);
    }
  }

  const grouped = new Map();
  Array.from(invoices.values())
    .filter((inv) => inv.status === 'PAID')
    .filter((inv) => {
      const d = new Date(inv.updatedAt || inv.createdAt);
      return d >= new Date(fromIso) && d <= new Date(toIso);
    })
    .forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        const key = item.name || 'Unknown Product';
        const current = grouped.get(key) || { productName: key, qtySold: 0, totalSales: 0 };
        current.qtySold += Number(item.qty || 0);
        current.totalSales += Number(item.subtotal || 0);
        grouped.set(key, current);
      });
    });

  return Array.from(grouped.values())
    .sort((a, b) => (b.totalSales - a.totalSales) || (b.qtySold - a.qtySold))
    .slice(0, cappedLimit);
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

/**
 * Sync all pending offline operations to Supabase.
 * Returns { synced, failed, remaining } counts.
 */
async function syncOfflineQueue() {
  if (!isSupabaseEnabled()) return { synced: 0, failed: 0, remaining: offlineQueue.getCount() };

  const ops = offlineQueue.getAll();
  if (!ops.length) return { synced: 0, failed: 0, remaining: 0 };

  let synced = 0;
  let failed = 0;

  for (const op of ops) {
    try {
      switch (op.type) {
        case 'persist_invoice':
          await _persistInvoiceToSupabase(op.payload.invoice);
          break;
        case 'set_invoice_paid': {
          const { invoiceId, invoice, paymentData } = op.payload;
          const invoiceForSync = invoice || {
            id: invoiceId,
            reference: `SYNC-${invoiceId}`,
            status: 'PAID',
            orderType: null,
            paymentMethod: paymentData?.method || 'gcash',
            total: Number(paymentData?.amountPaid || 0),
            createdAt: paymentData?.paidAt || new Date().toISOString(),
            updatedAt: paymentData?.paidAt || new Date().toISOString(),
            lineItems: []
          };
          // Ensure invoice exists (and has latest state) before payment FK upsert.
          await upsertInvoiceToSupabase(invoiceForSync);

          const paymentRow = {
            invoice_id: invoiceId,
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
          if (paymentError) throw new Error(`Supabase payment upsert failed: ${paymentError.message}`);
          await applyInventoryUsageForPaidInvoice(invoiceForSync);
          break;
        }
        case 'save_gcash_session': {
          const { error: sessionError } = await supabase
            .from('pos_gcash_sessions')
            .upsert(toDbSession(op.payload.session), { onConflict: 'reference' });
          if (sessionError) throw new Error(`Supabase GCash session upsert failed: ${sessionError.message}`);
          break;
        }
        default:
          console.warn('[Sync] Unknown operation type:', op.type);
      }
      offlineQueue.remove(op.id);
      synced++;
    } catch (error) {
      console.warn(`[Sync] Failed to sync op ${op.id} (${op.type}):`, error.message);
      offlineQueue.incrementRetry(op.id);
      failed++;
    }
  }

  return { synced, failed, remaining: offlineQueue.getCount() };
}

/**
 * Get the count of pending offline operations.
 */
function getOfflineQueueCount() {
  return offlineQueue.getCount();
}

/**
 * Get offline queue summary.
 * Returns operation count and unique invoice/order count.
 */
function getOfflineQueueSummary() {
  const ops = offlineQueue.getAll();
  const invoiceIds = new Set();

  ops.forEach((op) => {
    const invoiceId = op?.payload?.invoiceId || op?.payload?.invoice?.id || op?.payload?.session?.invoiceId || null;
    if (invoiceId) invoiceIds.add(String(invoiceId));
  });

  return {
    operations: ops.length,
    invoices: invoiceIds.size
  };
}

module.exports = {
  getAppConfig,
  ensureAppConfigLoaded,
  ensureDiscountProfilesLoaded,
  updateAppConfig,
  listDiscountManagerProfiles,
  createDiscountProfile,
  updateDiscountProfile,
  deleteDiscountProfile,
  listReceiptTemplates,
  getReceiptTemplateById,
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
  editPaidInvoice,
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
  hasMonthlyClosingReportData,
  getMonthlyClosingSnapshot,
  listMonthlyClosingSnapshots,
  saveMonthlyClosingSnapshot,
  listProductRecipes,
  replaceProductRecipes,
  listAllInvoices,
  getEarliestInvoiceDate,
  startCashierShift,
  getCashierShiftOpeningContext,
  getCashierShiftById,
  getCashierShiftSummary,
  getCashDrawerById,
  getCashDrawerUsageStats,
  listCashDrawers,
  createCashDrawer,
  updateCashDrawer,
  deleteCashDrawer,
  listCashDrawerMovements,
  createCashDrawerMovement,
  closeCashierShift,
  listCashierShifts,
  listActiveCashierMonitoring,
  reviewCashierShift,
  syncOfflineQueue,
  getOfflineQueueCount,
  getOfflineQueueSummary
};
