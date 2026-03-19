create table if not exists public.monthly_closing_snapshots (
  month text primary key check (month ~ '^\d{4}-\d{2}$'),
  report_json jsonb not null,
  saved_by_user_id text,
  saved_by_email text,
  saved_by_name text,
  saved_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_monthly_closing_snapshots_saved_at
on public.monthly_closing_snapshots(saved_at desc);

alter table public.monthly_closing_snapshots disable row level security;
