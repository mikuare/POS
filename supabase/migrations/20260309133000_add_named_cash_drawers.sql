-- Add named cash drawers so admins can seed the first drawer balance and
-- cashiers can choose which drawer they are assigned to for each shift.

create table if not exists public.cash_drawers (
  id uuid primary key,
  name text not null unique,
  initial_balance numeric(12,2) not null default 0 check (initial_balance >= 0),
  current_balance numeric(12,2) not null default 0 check (current_balance >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_cash_drawers_set_updated_at on public.cash_drawers;
create trigger trg_cash_drawers_set_updated_at
before update on public.cash_drawers
for each row
execute function public.set_updated_at();

alter table public.cash_drawers disable row level security;

alter table if exists public.cashier_shifts
  add column if not exists drawer_id uuid references public.cash_drawers(id) on delete set null,
  add column if not exists drawer_name text;

create index if not exists idx_cashier_shifts_drawer_id on public.cashier_shifts(drawer_id);

alter table if exists public.cash_drawer_movements
  add column if not exists drawer_id uuid references public.cash_drawers(id) on delete cascade,
  add column if not exists drawer_name text;

alter table if exists public.cash_drawer_movements
  alter column shift_id drop not null;

create index if not exists idx_cash_drawer_movements_drawer_id on public.cash_drawer_movements(drawer_id);
