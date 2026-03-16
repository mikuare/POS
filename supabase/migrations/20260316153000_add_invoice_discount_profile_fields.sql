alter table if exists public.pos_invoices
  add column if not exists subtotal_amount numeric(12,2),
  add column if not exists discount_amount numeric(12,2),
  add column if not exists discount_profile_json jsonb;

update public.pos_invoices
set subtotal_amount = total_amount
where subtotal_amount is null;

update public.pos_invoices
set discount_amount = greatest(coalesce(subtotal_amount, total_amount) - total_amount, 0)
where discount_amount is null;
