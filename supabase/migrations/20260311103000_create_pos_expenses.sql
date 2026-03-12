create table if not exists public.pos_expenses (
  id uuid primary key,
  expense_date date not null,
  category text not null,
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  note text,
  created_by_user_id text,
  created_by_email text,
  created_by_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pos_expenses_expense_date on public.pos_expenses(expense_date desc);
create index if not exists idx_pos_expenses_category on public.pos_expenses(category);

drop trigger if exists trg_pos_expenses_updated_at on public.pos_expenses;
create trigger trg_pos_expenses_updated_at
before update on public.pos_expenses
for each row
execute function public.set_inventory_updated_at();

alter table public.pos_expenses disable row level security;
