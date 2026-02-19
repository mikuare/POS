# Supabase Setup Guide - Development & Production

## Overview

You should have **TWO separate Supabase projects**:
1. **Production Project**: "POS" (your existing project)
2. **Development Project**: "POS - Development" (new project to create)

## Why Separate Projects?

✅ **Safety**: Production data is protected from development mistakes
✅ **Testing**: Freely test without affecting real customer data
✅ **Clean**: Development and production data are completely isolated
✅ **Professional**: Industry best practice

## Step 1: Create Development Supabase Project

### 1.1 Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Make sure you're logged in

### 1.2 Create New Project
1. Click **"New Project"** button
2. Fill in the details:
   - **Name**: `POS - Development` (or `POS Dev`)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose same region as production (for consistency)
   - **Pricing Plan**: Free tier is fine for development

3. Click **"Create new project"**
4. Wait 2-3 minutes for project to be ready

### 1.3 Set Up Database Schema
Once your project is ready:

1. Go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open your local file: `supabase/schema.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`
7. Verify: You should see success messages for all tables created

### 1.4 Get Development Credentials

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** section
3. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **service_role key** (click "Reveal" to see it)

### 1.5 Update .env.development

Open `.env.development` and update:

```env
# Supabase Development Project
SUPABASE_URL=https://your-dev-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key_here
```

**Important**: Replace with your actual development project credentials!

## Step 2: Verify Production Supabase Project

### 2.1 Get Production Credentials

1. Go to your **"POS"** project in Supabase dashboard
2. Go to **Project Settings** > **API**
3. Copy:
   - **Project URL**
   - **service_role key**

### 2.2 Update .env.production

Open `.env.production` and update:

```env
# Supabase Production Project
SUPABASE_URL=https://your-prod-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key_here
```

### 2.3 Update Vercel Environment Variables

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your POS project
3. Go to **Settings** > **Environment Variables**
4. Update or add:
   - `SUPABASE_URL` = Your production Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Your production service role key

## Step 3: Test Both Environments

### Test Development Environment

```bash
# Start development server
npm run dev
```

Expected output:
```
POS server running on http://localhost:4000
Provider: paymongo
Supabase: enabled (service_role)
```

**Verify**:
1. Open: http://localhost:4000/health
2. Should show: `"supabaseEnabled": true`
3. Create a test transaction
4. Check your **Development Supabase project** dashboard
5. Go to **Table Editor** > **invoices** table
6. You should see your test transaction

### Test Production Environment

1. Push to GitHub (if you have changes)
2. Vercel will auto-deploy
3. Visit: https://www.judech.online/health
4. Should show: `"supabaseEnabled": true`
5. Create a real transaction
6. Check your **Production Supabase project** dashboard
7. Transaction should appear in production database only

## Alternative: Use Same Project (Not Recommended)

If you prefer to use the same Supabase project for both dev and prod:

### Pros:
- ✅ Simpler setup (only one project)
- ✅ No need to manage two projects

### Cons:
- ❌ Development and production data mixed together
- ❌ Risk of accidentally affecting production data
- ❌ Harder to clean up test data
- ❌ Not a professional best practice

### If You Choose This Option:

1. Copy your production Supabase credentials to `.env.development`:

```env
# Using same Supabase project (not recommended)
SUPABASE_URL=https://your-prod-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key_here
```

2. Be very careful when testing - you're working with production data!

## Comparison Table

| Aspect | Separate Projects | Same Project |
|--------|------------------|--------------|
| **Data Safety** | ✅ Isolated | ❌ Mixed |
| **Testing Freedom** | ✅ Test freely | ❌ Be careful |
| **Setup Complexity** | Medium | Simple |
| **Professional** | ✅ Yes | ❌ No |
| **Cost** | Free (2 projects) | Free (1 project) |
| **Recommended** | ✅ **YES** | ❌ No |

## Troubleshooting

### Error: "Supabase client initialization failed"

**Solution**:
1. Verify `SUPABASE_URL` is correct (should start with `https://`)
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is the service_role key (not anon key)
3. Check for typos or extra spaces
4. Restart server: `Ctrl+C` then `npm run dev`

### Development data appearing in production

**Cause**: You're using the same Supabase project for both

**Solution**:
1. Create separate development project (see Step 1)
2. Update `.env.development` with dev project credentials
3. Restart development server

### Can't see tables in Supabase

**Solution**:
1. Make sure you ran the schema SQL in SQL Editor
2. Check **Table Editor** in left sidebar
3. Refresh the page
4. Verify no errors in SQL execution

## Best Practices

1. ✅ **Always use separate projects** for dev and prod
2. ✅ **Never test with production data** - use development project
3. ✅ **Keep credentials secure** - never commit to git
4. ✅ **Regular backups** - Supabase has automatic backups, but verify
5. ✅ **Monitor usage** - Check Supabase dashboard for usage limits
6. ✅ **Clean up test data** - Periodically clean development database

## Quick Reference

### Development
- **Project Name**: POS - Development
- **Purpose**: Testing and development
- **Data**: Test/dummy data only
- **Config**: `.env.development`

### Production
- **Project Name**: POS
- **Purpose**: Live customer transactions
- **Data**: Real customer data
- **Config**: Vercel environment variables

## Summary

**Recommended Setup:**
```
Development Environment:
├── PayMongo: TEST keys (sk_test_*)
├── Supabase: Development project
└── URL: http://localhost:4000

Production Environment:
├── PayMongo: LIVE keys (sk_live_*)
├── Supabase: Production project
└── URL: https://www.judech.online
```

This setup gives you complete isolation between development and production! 🎉
