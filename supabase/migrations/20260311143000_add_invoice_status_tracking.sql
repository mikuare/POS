alter table if exists public.pos_invoices
  add column if not exists status_reason text,
  add column if not exists status_changed_at timestamptz,
  add column if not exists status_changed_by_user_id uuid,
  add column if not exists status_changed_by_email text;
