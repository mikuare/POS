-- Inventory module for admin ingredient management and usage reporting.

create table if not exists public.inventory_ingredients (
  id uuid primary key,
  name text not null unique,
  qty_on_hand numeric(12,3) not null default 0,
  unit_price numeric(12,2) not null default 0,
  reorder_level numeric(12,3) not null default 0,
  unit text not null default 'pcs',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key,
  ingredient_id uuid not null references public.inventory_ingredients(id) on delete cascade,
  movement_type text not null check (movement_type in ('IN', 'OUT', 'ADJUST')),
  quantity numeric(12,3) not null,
  unit_cost numeric(12,2) not null default 0,
  reference_type text,
  reference_id text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.product_recipes (
  id uuid primary key,
  product_id text not null,
  product_name text not null,
  ingredient_id uuid not null references public.inventory_ingredients(id) on delete cascade,
  qty_per_product numeric(12,3) not null check (qty_per_product > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, ingredient_id)
);

create index if not exists idx_inventory_ingredients_name on public.inventory_ingredients(name);
create index if not exists idx_inventory_movements_ingredient_id on public.inventory_movements(ingredient_id);
create index if not exists idx_inventory_movements_created_at on public.inventory_movements(created_at desc);
create index if not exists idx_product_recipes_product_id on public.product_recipes(product_id);
create index if not exists idx_product_recipes_ingredient_id on public.product_recipes(ingredient_id);

-- Trigger helper (safe create)
create or replace function public.set_inventory_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_inventory_ingredients_updated_at on public.inventory_ingredients;
create trigger trg_inventory_ingredients_updated_at
before update on public.inventory_ingredients
for each row
execute function public.set_inventory_updated_at();

drop trigger if exists trg_product_recipes_updated_at on public.product_recipes;
create trigger trg_product_recipes_updated_at
before update on public.product_recipes
for each row
execute function public.set_inventory_updated_at();

alter table public.inventory_ingredients disable row level security;
alter table public.inventory_movements disable row level security;
alter table public.product_recipes disable row level security;

