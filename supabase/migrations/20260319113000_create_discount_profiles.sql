create table if not exists public.discount_profiles (
  id text primary key,
  name text not null unique,
  type text not null check (type in ('percent', 'fixed')),
  amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_discount_profiles_set_updated_at on public.discount_profiles;
create trigger trg_discount_profiles_set_updated_at
before update on public.discount_profiles
for each row
execute function public.set_updated_at();

alter table public.discount_profiles disable row level security;

insert into public.discount_profiles (id, name, type, amount)
values
  ('student', 'Students', 'percent', 10),
  ('senior', 'Seniors', 'percent', 20),
  ('pwd', 'PWD', 'percent', 20)
on conflict (id) do update
set
  name = excluded.name,
  type = excluded.type,
  amount = excluded.amount;
