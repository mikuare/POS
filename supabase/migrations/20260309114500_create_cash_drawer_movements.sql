-- Document manual cash drawer deductions and adjustments performed by admins

create table if not exists public.cash_drawer_movements (
  id uuid primary key,
  shift_id uuid not null references public.cashier_shifts(id) on delete cascade,
  movement_type text not null
    check (movement_type in ('withdrawal', 'deposit', 'adjustment')),
  amount numeric(12,2) not null check (amount > 0),
  note text,
  performed_by_user_id uuid references auth.users(id) on delete set null,
  performed_by_email text,
  performed_by_name text,
  created_at timestamptz not null default now()
);

create index if not exists idx_cash_drawer_movements_shift_id on public.cash_drawer_movements(shift_id);
create index if not exists idx_cash_drawer_movements_created_at on public.cash_drawer_movements(created_at desc);

alter table public.cash_drawer_movements disable row level security;
