-- User accounts (profile/role tracking) + auth audit logs
-- Compatible with Supabase Auth (auth.users).

create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null default 'encharge'
    check (role in ('administrations', 'supervisor', 'encharge')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create index if not exists idx_app_users_role on public.app_users(role);
create index if not exists idx_app_users_created_at on public.app_users(created_at desc);
create index if not exists idx_app_users_last_login_at on public.app_users(last_login_at desc);

create table if not exists public.auth_audit_logs (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  event_type text not null
    check (event_type in (
      'signup_success',
      'signup_failed',
      'login_success',
      'login_failed',
      'logout',
      'admin_access_allowed',
      'admin_access_denied'
    )),
  event_source text not null default 'web',
  ip_address inet,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_auth_audit_logs_user_id on public.auth_audit_logs(user_id);
create index if not exists idx_auth_audit_logs_event_type on public.auth_audit_logs(event_type);
create index if not exists idx_auth_audit_logs_created_at on public.auth_audit_logs(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_app_users_set_updated_at on public.app_users;
create trigger trg_app_users_set_updated_at
before update on public.app_users
for each row
execute function public.set_updated_at();

-- Auto-create an app_users profile whenever a new Supabase Auth user is created.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text;
  meta_name text;
begin
  meta_role := lower(coalesce(new.raw_user_meta_data->>'role', 'encharge'));
  if meta_role not in ('administrations', 'supervisor', 'encharge') then
    meta_role := 'encharge';
  end if;

  meta_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'User');

  insert into public.app_users (id, full_name, email, role)
  values (new.id, meta_name, new.email, meta_role)
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Keep aligned with existing project setup (service role/server-side access).
alter table public.app_users disable row level security;
alter table public.auth_audit_logs disable row level security;
