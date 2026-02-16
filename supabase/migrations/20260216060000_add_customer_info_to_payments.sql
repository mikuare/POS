-- Add customer information columns to pos_payments table
-- These store the billing info from PayMongo checkout (name, email, phone/GCash number)

ALTER TABLE public.pos_payments
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text;
