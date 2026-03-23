-- Enable Row Level Security on all public tables exposed through PostgREST.
-- The POS server is expected to use SUPABASE_SERVICE_ROLE_KEY for data access.

alter table if exists public.app_settings enable row level security;
alter table if exists public.app_users enable row level security;
alter table if exists public.auth_audit_logs enable row level security;
alter table if exists public.cash_drawers enable row level security;
alter table if exists public.cash_drawer_movements enable row level security;
alter table if exists public.cashier_shifts enable row level security;
alter table if exists public.discount_profiles enable row level security;
alter table if exists public.inventory_alerts enable row level security;
alter table if exists public.inventory_ingredients enable row level security;
alter table if exists public.inventory_movements enable row level security;
alter table if exists public.inventory_settings enable row level security;
alter table if exists public.menu_categories enable row level security;
alter table if exists public.menu_products enable row level security;
alter table if exists public.monthly_closing_snapshots enable row level security;
alter table if exists public.pos_expenses enable row level security;
alter table if exists public.pos_gcash_sessions enable row level security;
alter table if exists public.pos_invoice_adjustments enable row level security;
alter table if exists public.pos_invoice_items enable row level security;
alter table if exists public.pos_invoices enable row level security;
alter table if exists public.pos_payments enable row level security;
alter table if exists public.product_recipes enable row level security;
alter table if exists public.receipt_templates enable row level security;
