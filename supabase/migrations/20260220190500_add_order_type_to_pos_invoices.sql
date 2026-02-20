alter table if exists public.pos_invoices
add column if not exists order_type text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pos_invoices_order_type_check'
  ) then
    alter table public.pos_invoices
    add constraint pos_invoices_order_type_check
    check (order_type is null or order_type in ('dine-in', 'take-out'));
  end if;
end $$;
