-- POS schema for invoices, items, payments, and GCash sessions

create table if not exists public.pos_invoices (
  id uuid primary key,
  reference text not null unique,
  status text not null,
  status_reason text,
  status_changed_at timestamptz,
  status_changed_by_user_id uuid,
  status_changed_by_email text,
  payment_method text not null,
  subtotal_amount numeric(12,2),
  discount_amount numeric(12,2),
  discount_profile_json jsonb,
  total_amount numeric(12,2) not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.pos_invoice_items (
  id uuid primary key,
  invoice_id uuid not null references public.pos_invoices(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  unit_price numeric(12,2) not null,
  qty integer not null,
  subtotal numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_pos_invoice_items_invoice_id
  on public.pos_invoice_items(invoice_id);

create table if not exists public.pos_payments (
  invoice_id uuid primary key references public.pos_invoices(id) on delete cascade,
  method text not null,
  provider text,
  provider_reference text,
  recipient_gcash_number text,
  paid_at timestamptz not null,
  amount_paid numeric(12,2) not null,
  change_amount numeric(12,2) not null default 0,
  success boolean not null default true,
  success_message text,
  customer_name text,
  customer_email text,
  customer_phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.pos_invoice_adjustments (
  id uuid primary key,
  invoice_id uuid not null references public.pos_invoices(id) on delete cascade,
  reason text not null,
  adjusted_by_user_id uuid,
  adjusted_by_email text,
  previous_snapshot jsonb not null default '{}'::jsonb,
  next_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_pos_invoice_adjustments_invoice_id
  on public.pos_invoice_adjustments(invoice_id);

create table if not exists public.pos_gcash_sessions (
  reference text primary key,
  invoice_id uuid not null references public.pos_invoices(id) on delete cascade,
  provider text not null,
  amount numeric(12,2) not null,
  currency text not null,
  qr_text text,
  qr_data_url text,
  checkout_url text,
  status text not null,
  merchant_gcash_number text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.app_settings (
  key text primary key,
  value_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.discount_profiles (
  id text primary key,
  name text not null unique,
  type text not null check (type in ('percent', 'fixed')),
  amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pos_invoices enable row level security;
alter table public.pos_invoice_items enable row level security;
alter table public.pos_payments enable row level security;
alter table public.pos_invoice_adjustments enable row level security;
alter table public.pos_gcash_sessions enable row level security;
alter table public.app_settings enable row level security;
alter table public.discount_profiles enable row level security;
