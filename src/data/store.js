const { v4: uuidv4 } = require('uuid');
const { getSupabase, isSupabaseEnabled } = require('./supabaseClient');

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

const invoices = new Map();
const gcashSessions = new Map();
const inventoryIngredients = new Map();
const productRecipes = new Map();
const menuCategories = new Map(DEFAULT_MENU_CATEGORIES.map((x) => [x.key, x]));
const supabase = getSupabase();
const PG_INT_MAX = 2147483647;

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
  if (!isSupabaseEnabled()) {
    return listMenuCategoriesFallback();
  }

  await seedMenuCatalogIfEmpty();

  const { data, error } = await supabase
    .from('menu_categories')
    .select('category_key,category_name,image_url,sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('category_name', { ascending: true });

  if (error) throw new Error(`Supabase menu categories fetch failed: ${error.message}`);
  return (data || []).map((x) => ({
    key: x.category_key,
    name: x.category_name,
    image: x.image_url || getDefaultCategoryByKey(x.category_key)?.image || '',
    sortOrder: Number(x.sort_order || 0)
  }));
}

async function listProducts() {
  if (!isSupabaseEnabled()) {
    return listProductsFallback();
  }

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

  return (data || []).map((x) => ({
    id: x.id,
    name: x.name,
    price: Number(x.price || 0),
    category: x.menu_categories?.category_key || 'main-dish',
    image: x.image_url || '/Business Logo/Ruels Logo for business.png'
  }));
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
    status: invoice.status,
    order_type: invoice.orderType || null,
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
    orderType: dbInvoice.order_type || null,
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

async function createInvoice({ items, paymentMethod, discountAmount = 0, orderType = null }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Invoice must contain at least one item');
  }

  const productCatalog = await listProducts();
  const now = new Date().toISOString();
  const lineItems = items
    .map((item) => {
      const product = productCatalog.find((p) => p.id === item.productId);
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
    orderType: orderType || null,
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
    if (!soldUnits) continue;

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

    return {
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
  }

  if (Array.from(inventoryIngredients.values()).some((x) => String(x.name).toLowerCase() === ingredient.name.toLowerCase())) {
    throw new Error('Ingredient name already exists');
  }
  inventoryIngredients.set(ingredient.id, ingredient);
  return ingredient;
}

async function getInventoryReport() {
  if (isSupabaseEnabled()) {
    const [{ data: ingredients, error: ingredientErr }, { data: recipes, error: recipeErr }, { data: paidInvoices, error: invoiceErr }] = await Promise.all([
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
        .eq('status', 'PAID')
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
        estimatedRemainingQty: Math.max(0, qtyOnHand - estimatedUsedQty),
        lowStock: qtyOnHand <= Number(ing.reorder_level || 0),
        usageByProduct: usage.usageByProduct.sort((a, b) => b.estimatedUsedQty - a.estimatedUsedQty),
        createdAt: ing.created_at,
        updatedAt: ing.updated_at
      };
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const totals = rows.reduce((acc, row) => {
      acc.totalIngredients += 1;
      acc.totalInventoryValue += row.inventoryValue;
      if (row.lowStock) acc.lowStockCount += 1;
      return acc;
    }, { totalIngredients: 0, totalInventoryValue: 0, lowStockCount: 0 });

    return { ingredients: rows, totals };
  }

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
        estimatedRemainingQty: Math.max(0, qtyOnHand - estimatedUsedQty),
        lowStock: qtyOnHand <= Number(ing.reorderLevel || 0),
        usageByProduct: usage.usageByProduct.sort((a, b) => b.estimatedUsedQty - a.estimatedUsedQty),
        createdAt: ing.createdAt,
        updatedAt: ing.updatedAt
      };
  }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const totals = rows.reduce((acc, row) => {
    acc.totalIngredients += 1;
    acc.totalInventoryValue += row.inventoryValue;
    if (row.lowStock) acc.lowStockCount += 1;
    return acc;
  }, { totalIngredients: 0, totalInventoryValue: 0, lowStockCount: 0 });

  return { ingredients: rows, totals };
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

async function getTopSalesPerProduct(limit = 10) {
  const cappedLimit = Math.max(1, Math.min(Number(limit) || 10, 50));

  if (isSupabaseEnabled()) {
    const { data: paidInvoices, error: invoiceError } = await supabase
      .from('pos_invoices')
      .select('id')
      .eq('status', 'PAID');

    if (invoiceError) {
      throw new Error(`Supabase top-products invoice query failed: ${invoiceError.message}`);
    }

    const invoiceIds = (paidInvoices || []).map((x) => x.id);
    if (!invoiceIds.length) return [];

    const { data: itemRows, error: itemsError } = await supabase
      .from('pos_invoice_items')
      .select('product_name,qty,subtotal')
      .in('invoice_id', invoiceIds);

    if (itemsError) {
      throw new Error(`Supabase top-products items query failed: ${itemsError.message}`);
    }

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
    let query = supabase
      .from('pos_invoices')
      .select('id,reference,total_amount,payment_method,status,order_type,created_at,updated_at')
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
        orderType: inv.order_type || null,
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
      orderType: inv.orderType || null,
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
  saveGcashSession,
  getGcashSessionByReference,
  getGcashSessionByInvoiceId,
  getSalesReport,
  getTopSalesPerProduct,
  createInventoryIngredient,
  getInventoryReport,
  listAllInvoices
};


