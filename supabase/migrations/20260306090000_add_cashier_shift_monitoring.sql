-- Cashier shift monitoring + cashier attribution in invoices

alter table if exists public.pos_invoices
  add column if not exists cashier_user_id uuid references auth.users(id) on delete set null,
  add column if not exists cashier_email text,
  add column if not exists cashier_name text,
  add column if not exists cashier_role text;

create index if not exists idx_pos_invoices_cashier_user_id on public.pos_invoices(cashier_user_id);
create index if not exists idx_pos_invoices_cashier_email on public.pos_invoices(cashier_email);

create table if not exists public.cashier_shifts (
  id uuid primary key,
  cashier_user_id uuid references auth.users(id) on delete set null,
  cashier_email text not null,
  cashier_name text not null,
  cashier_role text not null default 'encharge'
    check (cashier_role in ('administrations', 'supervisor', 'encharge')),
  shift_start_at timestamptz not null,
  shift_end_at timestamptz,
  starting_cash numeric(12,2) not null default 0 check (starting_cash >= 0),
  expected_cash numeric(12,2) not null default 0,
  ending_cash numeric(12,2),
  discrepancy numeric(12,2),
  total_sales numeric(12,2) not null default 0,
  cash_sales numeric(12,2) not null default 0,
  digital_sales numeric(12,2) not null default 0,
  total_transactions integer not null default 0,
  status text not null default 'active'
    check (status in ('active', 'logged_out')),
  review_status text not null default 'pending'
    check (review_status in ('pending', 'approved', 'investigate')),
  review_note text,
  reviewed_by_user_id uuid references auth.users(id) on delete set null,
  reviewed_by_email text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cashier_shifts_status on public.cashier_shifts(status);
create index if not exists idx_cashier_shifts_shift_start_at on public.cashier_shifts(shift_start_at desc);
create index if not exists idx_cashier_shifts_cashier_user_id on public.cashier_shifts(cashier_user_id);
create index if not exists idx_cashier_shifts_cashier_email on public.cashier_shifts(cashier_email);
create index if not exists idx_cashier_shifts_review_status on public.cashier_shifts(review_status);
create index if not exists idx_cashier_shifts_discrepancy on public.cashier_shifts(discrepancy);

drop trigger if exists trg_cashier_shifts_set_updated_at on public.cashier_shifts;
create trigger trg_cashier_shifts_set_updated_at
before update on public.cashier_shifts
for each row
execute function public.set_updated_at();

alter table public.cashier_shifts disable row level security;
