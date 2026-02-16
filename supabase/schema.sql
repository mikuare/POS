-- POS schema for invoices, items, payments, and GCash sessions

create table if not exists public.pos_invoices (
  id uuid primary key,
  reference text not null unique,
  status text not null,
  payment_method text not null,
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

alter table public.pos_invoices disable row level security;
alter table public.pos_invoice_items disable row level security;
alter table public.pos_payments disable row level security;
alter table public.pos_gcash_sessions disable row level security;
