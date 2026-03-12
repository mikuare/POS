-- Add drawer cash movement audit fields per cashier shift

alter table if exists public.cashier_shifts
  add column if not exists cash_tendered numeric(12,2) not null default 0,
  add column if not exists change_given numeric(12,2) not null default 0,
  add column if not exists net_cash_retained numeric(12,2) not null default 0;
