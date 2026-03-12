-- Track previous drawer balance reference and opening cash adjustments per shift

alter table if exists public.cashier_shifts
  add column if not exists previous_shift_id uuid references public.cashier_shifts(id) on delete set null,
  add column if not exists previous_drawer_balance numeric(12,2),
  add column if not exists opening_adjustment numeric(12,2) not null default 0;
