create table if not exists public.pos_invoice_adjustments (
  id uuid primary key,
  invoice_id uuid not null references public.pos_invoices(id) on delete cascade,
  reason text not null,
  adjusted_by_user_id uuid,
  adjusted_by_email text,
  previous_snapshot jsonb not null default '{}'::jsonb,
  next_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_pos_invoice_adjustments_invoice_id
  on public.pos_invoice_adjustments(invoice_id);

alter table public.pos_invoice_adjustments disable row level security;
