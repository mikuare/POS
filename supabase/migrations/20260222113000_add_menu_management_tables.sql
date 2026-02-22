-- Menu management tables for Admin/Supervisor:
-- - Editable categories
-- - Editable products (name, price, image)
-- - Add category/product support

create extension if not exists pgcrypto;

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  category_key text not null unique,
  category_name text not null,
  image_url text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_menu_categories_key_format check (category_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.menu_products (
  id text primary key,
  category_id uuid not null references public.menu_categories(id) on delete restrict,
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  image_url text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_menu_categories_active_order
  on public.menu_categories(is_active, sort_order, category_name);

create index if not exists idx_menu_products_category_active_order
  on public.menu_products(category_id, is_active, sort_order, name);

create index if not exists idx_menu_products_active_name
  on public.menu_products(is_active, name);

create or replace function public.set_menu_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_menu_categories_updated_at on public.menu_categories;
create trigger trg_menu_categories_updated_at
before update on public.menu_categories
for each row
execute function public.set_menu_updated_at();

drop trigger if exists trg_menu_products_updated_at on public.menu_products;
create trigger trg_menu_products_updated_at
before update on public.menu_products
for each row
execute function public.set_menu_updated_at();

alter table public.menu_categories disable row level security;
alter table public.menu_products disable row level security;

-- Seed default categories (idempotent)
insert into public.menu_categories (category_key, category_name, image_url, sort_order, is_active)
values
  ('main-dish', 'Main Dish', '/Menu/Main Dish.png', 10, true),
  ('rice', 'Rice', '/Menu/Rice.png', 20, true),
  ('burger', 'Burger', '/Menu/Burger.png', 30, true),
  ('drinks', 'Drinks', '/Menu/Drinks.png', 40, true),
  ('fries', 'Fries', '/Menu/Fries.png', 50, true),
  ('dessert', 'Dessert', '/Menu/Dessert.png', 60, true),
  ('sauces', 'Sauces', '/Menu/Sauce.png', 70, true)
on conflict (category_key) do update
set
  category_name = excluded.category_name,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;

-- Seed default products (idempotent by id)
insert into public.menu_products (id, category_id, name, price, image_url, sort_order, is_active)
select p.id, c.id, p.name, p.price, p.image_url, p.sort_order, true
from (
  values
    ('p1', 'main-dish', 'Succulent Roast Beef', 249, '/Main Dish/Succulent Roast Beef Slides with rice and beef sauce.png', 10),
    ('p2', 'main-dish', 'Roasted Beef w Java Rice', 229, '/Main Dish/roasted beef w java rice.png', 20),
    ('p3', 'main-dish', 'Party Tray', 799, '/Main Dish/Party Tray.png', 30),
    ('p4', 'main-dish', 'Letchon Baka', 269, '/Main Dish/Letchon Baka.png', 40),
    ('p5', 'main-dish', 'Crispy Letchon Kawali', 219, '/Main Dish/Crispy Letchon Kawali.png', 50),
    ('p6', 'main-dish', 'Beef Steak with Hot Sauce', 239, '/Main Dish/beef steak with hot sauce.png', 60),
    ('p7', 'main-dish', 'Beef Caldereta', 229, '/Main Dish/Beef Caldereta.png', 70),
    ('p20', 'rice', 'Delicious Fried Rice', 79, '/Rice/Delicious fried rice.png', 10),
    ('p21', 'rice', 'Unli Rice', 59, '/Rice/Unli Rice.png', 20),
    ('p22', 'rice', 'Brown Rice Bowl', 69, '/Rice/Steaming bowl of brown rice.png', 30),
    ('p23', 'rice', 'Fluffy Rice Bowl', 65, '/Rice/Steaming bowl of fluffy rice.png', 40),
    ('p30', 'burger', 'Spicy Jalapeno Cheeseburger', 189, '/Burger/Spicy jalapeño cheeseburger with fries.png', 10),
    ('p31', 'burger', 'Gourmet Cheese Burger', 179, '/Burger/Gourmet cheese burger.png', 20),
    ('p32', 'burger', 'Crispy Chicken Sandwich', 169, '/Burger/Crispy chicken sandwich with slaw Burger.png', 30),
    ('p33', 'burger', 'BBQ Bacon Cheeseburger', 199, '/Burger/BBQ bacon cheeseburger.png', 40),
    ('p40', 'drinks', 'Lemon-Lime Soda', 59, '/Drinks/Refreshing lemon-lime soda on wood.png', 10),
    ('p41', 'drinks', 'Iced Tea Citrus Mint', 69, '/Drinks/Iced tea with citrus and mint.png', 20),
    ('p42', 'drinks', 'Refreshing Soda Lemon', 55, '/Drinks/Refreshing soda with lemon wedges.png', 30),
    ('p43', 'drinks', 'Coke Float', 79, '/Drinks/Coke Float.png', 40),
    ('p44', 'drinks', 'Mango Juice', 85, '/Drinks/Refreshing mango juice with mint garnish.png', 50),
    ('p45', 'drinks', 'Citrus Iced Drink', 75, '/Drinks/Citrus iced drinks with mint garnish.png', 60),
    ('p46', 'drinks', 'Strawberry Lemonade', 89, '/Drinks/Refreshing strawberry lemonade.png', 70),
    ('p50', 'fries', 'Loaded Bacon Cheese Fries', 139, '/Fries/Loaded bacon cheese fries close-up.png', 10),
    ('p51', 'fries', 'Crispy Fries', 99, '/Fries/Crispy Fries with dipping sauce.png', 20),
    ('p52', 'fries', 'Cajun Seasoned Fries', 119, '/Fries/Cajun seasoned fries.png', 30),
    ('p60', 'dessert', 'Strawberry Cheesecake Slice', 109, '/Dessert/Delicious strawberry cheesecake slice.png', 10),
    ('p61', 'dessert', 'Leche Flan Slice', 89, '/Dessert/Delicious slice of leche flan.png', 20),
    ('p62', 'dessert', 'Chocolate Fudge Cake Slice', 119, '/Dessert/Delicious chocolate fudge cake slice.png', 30),
    ('p70', 'sauces', 'Spicy Vinegar Sauce', 25, '/Sauces/Spicy Vinegar sauce.png', 10),
    ('p71', 'sauces', 'Spicy BBQ Sauce', 30, '/Sauces/Spicy BBQ sauce.png', 20),
    ('p72', 'sauces', 'Gravy Sauce', 25, '/Sauces/Gravy Sauce.png', 30),
    ('p73', 'sauces', 'Baka Sauce', 35, '/Sauces/Baka Sauce.png', 40)
) as p(id, category_key, name, price, image_url, sort_order)
join public.menu_categories c on c.category_key = p.category_key
on conflict (id) do update
set
  category_id = excluded.category_id,
  name = excluded.name,
  price = excluded.price,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
