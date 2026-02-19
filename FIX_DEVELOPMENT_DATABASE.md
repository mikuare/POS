# Fix Development Database - Missing Customer Info

## The Issue

**Problem**: Production shows customer info in transactions, but development (localhost) doesn't.

**Cause**: Your development Supabase database is missing the latest migration that adds customer information columns to the `pos_payments` table.

**Migration File**: `supabase/migrations/20260216060000_add_customer_info_to_payments.sql`

This migration adds three columns:
- `customer_name`
- `customer_email`
- `customer_phone`

## Quick Fix - Option 1: Run Migration in SQL Editor

### Step 1: Open Development Supabase Project

1. Go to: https://supabase.com/dashboard
2. Select your **"POS - Development"** project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Migration

Copy and paste this SQL into the editor:

```sql
-- Add customer information columns to pos_payments table
-- These store the billing info from PayMongo checkout (name, email, phone/GCash number)

ALTER TABLE public.pos_payments
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text;
```

### Step 3: Execute

1. Click **"Run"** or press `Ctrl+Enter`
2. You should see: "Success. No rows returned"

### Step 4: Verify

1. Go to **Table Editor** in left sidebar
2. Click on **pos_payments** table
3. You should now see the three new columns:
   - customer_name
   - customer_email
   - customer_phone

### Step 5: Test

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open: http://localhost:4000

3. Create a test GCash transaction with customer info:
   - Add items to cart
   - Select GCash payment
   - Enter customer name, email, phone
   - Complete checkout

4. Check Supabase Table Editor
   - Go to **pos_payments** table
   - You should now see customer info populated!

## Quick Fix - Option 2: Use Supabase CLI

If you have Supabase CLI installed:

### Step 1: Link to Development Project

```bash
supabase link --project-ref your-dev-project-ref
```

### Step 2: Push All Migrations

```bash
supabase db push
```

This will automatically apply all migrations in `supabase/migrations/` folder, including the customer info migration.

### Step 3: Verify

```bash
supabase migration list
```

You should see all three migrations marked as applied:
- ✅ 20260216040825_init_pos_schema.sql
- ✅ 20260216050414_create_pos_tables.sql
- ✅ 20260216060000_add_customer_info_to_payments.sql

## Quick Fix - Option 3: Run All Migrations

If you want to ensure your development database has ALL the latest schema:

### Step 1: Open SQL Editor in Development Project

### Step 2: Run Complete Schema

Copy the entire contents of `supabase/schema.sql` and run it. The `IF NOT EXISTS` clauses will ensure nothing breaks.

### Step 3: Run All Migrations

Then run each migration file in order:

**Migration 1**: `supabase/migrations/20260216040825_init_pos_schema.sql`
**Migration 2**: `supabase/migrations/20260216050414_create_pos_tables.sql`
**Migration 3**: `supabase/migrations/20260216060000_add_customer_info_to_payments.sql`

The `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS` clauses ensure safe execution.

## Verify Both Databases Match

### Check Development Database

1. Go to your **Development** Supabase project
2. Go to **Table Editor** > **pos_payments**
3. Check columns - should have:
   - invoice_id
   - method
   - provider
   - provider_reference
   - recipient_gcash_number
   - paid_at
   - amount_paid
   - change_amount
   - success
   - success_message
   - **customer_name** ✅
   - **customer_email** ✅
   - **customer_phone** ✅
   - created_at

### Check Production Database

1. Go to your **Production** Supabase project
2. Go to **Table Editor** > **pos_payments**
3. Should have the same columns as development

Both should now match!

## Why This Happened

When you created your development Supabase project, you likely ran the base `schema.sql` file, but didn't run the migration files that were added later.

**Timeline:**
1. Initial schema created (`schema.sql`)
2. Later, customer info feature was added (migration file)
3. Production database was updated with the migration
4. Development database was created from base schema only
5. Result: Production has customer info, development doesn't

## Prevent This in the Future

### Option A: Use Supabase CLI (Recommended)

Always use `supabase db push` to keep databases in sync:

```bash
# For development
supabase link --project-ref dev-project-ref
supabase db push

# For production
supabase unlink
supabase link --project-ref prod-project-ref
supabase db push
```

### Option B: Manual Process

When you add a new migration:

1. Create migration file in `supabase/migrations/`
2. Run in **Development** Supabase SQL Editor
3. Test thoroughly
4. Run in **Production** Supabase SQL Editor
5. Deploy code changes

### Option C: Keep a Checklist

Create a file `DATABASE_SYNC_CHECKLIST.md`:

```markdown
# Database Sync Checklist

When adding new database changes:

- [ ] Create migration file in `supabase/migrations/`
- [ ] Run in Development Supabase
- [ ] Verify in Development Table Editor
- [ ] Test with development server
- [ ] Run in Production Supabase
- [ ] Verify in Production Table Editor
- [ ] Test on production site
- [ ] Commit migration file to git
```

## Testing After Fix

### Test in Development

```bash
npm run dev
```

1. Open: http://localhost:4000
2. Create GCash transaction with customer info:
   - Name: "Test Customer"
   - Email: "test@example.com"
   - Phone: "09123456789"
3. Complete checkout
4. Check Supabase Development project
5. Go to **pos_payments** table
6. You should see:
   - customer_name: "Test Customer"
   - customer_email: "test@example.com"
   - customer_phone: "+639123456789"

### Test in Production

1. Visit: https://www.judech.online
2. Create a real transaction (small amount)
3. Enter customer info
4. Complete payment
5. Check Supabase Production project
6. Verify customer info is saved

Both should now work identically!

## Summary

**Quick Fix:**
1. Open Development Supabase SQL Editor
2. Run this SQL:
   ```sql
   ALTER TABLE public.pos_payments
     ADD COLUMN IF NOT EXISTS customer_name text,
     ADD COLUMN IF NOT EXISTS customer_email text,
     ADD COLUMN IF NOT EXISTS customer_phone text;
   ```
3. Restart dev server: `npm run dev`
4. Test - customer info should now appear!

**Root Cause**: Development database was missing the customer info migration that production already had.

**Prevention**: Use Supabase CLI or manually sync migrations to both databases.

Now your development and production databases will have the same schema! 🎉
