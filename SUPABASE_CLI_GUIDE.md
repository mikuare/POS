# Supabase CLI Guide - Database Migrations

## Overview

The Supabase CLI allows you to manage your database schema using migrations and push changes to your Supabase projects. This is especially useful for keeping development and production databases in sync.

## Prerequisites

- Node.js installed
- Supabase account with projects created
- Development and Production Supabase projects set up

## Step 1: Install Supabase CLI

### Option A: Using npm (Recommended)
```bash
npm install -g supabase
```

### Option B: Using Chocolatey (Windows)
```bash
choco install supabase
```

### Option C: Using Scoop (Windows)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Verify Installation
```bash
supabase --version
```

You should see the version number (e.g., `1.x.x`)

## Step 2: Initialize Supabase in Your Project

```bash
# Navigate to your project directory
cd "c:/Users/edujk/Desktop/POS SYSTEM"

# Initialize Supabase
supabase init
```

This creates a `supabase` folder with:
- `config.toml` - Configuration file
- `migrations/` - Database migration files (you already have this!)

## Step 3: Link to Development Project

### 3.1 Login to Supabase
```bash
supabase login
```

This will open your browser to authenticate.

### 3.2 Link to Development Project
```bash
# Link to your development project
supabase link --project-ref your-dev-project-ref
```

**How to find your project ref:**
1. Go to https://supabase.com/dashboard
2. Open your "POS - Development" project
3. Go to Project Settings > General
4. Copy the "Reference ID" (looks like: `abcdefghijklmnop`)

**Or use the project URL:**
```bash
# If your dev project URL is: https://abcdefghijklmnop.supabase.co
# Then your project-ref is: abcdefghijklmnop
supabase link --project-ref abcdefghijklmnop
```

You'll be prompted for your database password (the one you set when creating the project).

## Step 4: Push Migrations to Development

### Option A: Push Existing Migrations
```bash
# Push all migrations in supabase/migrations/ folder
supabase db push
```

This will:
- Read all `.sql` files in `supabase/migrations/`
- Apply them to your linked development project
- Track which migrations have been applied

### Option B: Push Specific Migration
```bash
# Push a specific migration file
supabase db push --file supabase/migrations/20260216040825_init_pos_schema.sql
```

### Option C: Reset and Push All
```bash
# Reset database and apply all migrations (CAUTION: Deletes all data!)
supabase db reset
```

## Step 5: Verify Migrations

### Check Migration Status
```bash
# See which migrations have been applied
supabase migration list
```

### Check Database Schema
```bash
# Generate types from your database
supabase gen types typescript --local > database.types.ts
```

## Working with Multiple Projects (Dev & Prod)

### Method 1: Use Different Directories (Recommended)

Create separate configurations:

```bash
# For Development
supabase link --project-ref your-dev-project-ref

# Save the config
# Then when you want to switch to production:

# Unlink current project
supabase unlink

# Link to production
supabase link --project-ref your-prod-project-ref
```

### Method 2: Use Environment Variables

```bash
# Set project ref for development
set SUPABASE_PROJECT_REF=your-dev-project-ref
supabase db push

# Set project ref for production
set SUPABASE_PROJECT_REF=your-prod-project-ref
supabase db push
```

### Method 3: Manual Switching

**For Development:**
```bash
supabase link --project-ref your-dev-project-ref
supabase db push
```

**For Production:**
```bash
supabase unlink
supabase link --project-ref your-prod-project-ref
supabase db push
```

## Creating New Migrations

### Generate a New Migration
```bash
# Create a new migration file
supabase migration new add_new_feature
```

This creates a new file: `supabase/migrations/[timestamp]_add_new_feature.sql`

### Edit the Migration
Open the new file and add your SQL:

```sql
-- Add a new column to invoices table
ALTER TABLE invoices ADD COLUMN notes TEXT;

-- Create a new table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Apply the Migration
```bash
# Push to development
supabase db push

# Test in development
# If everything works, push to production:
supabase unlink
supabase link --project-ref your-prod-project-ref
supabase db push
```

## Alternative: Direct SQL Editor (What You've Been Doing)

If you prefer not to use CLI, you can continue using the SQL Editor:

### For Development:
1. Go to your "POS - Development" project
2. Open SQL Editor
3. Copy contents from `supabase/schema.sql` or migration files
4. Run the SQL

### For Production:
1. Go to your "POS" project
2. Open SQL Editor
3. Copy the same SQL
4. Run the SQL

**Pros:**
- ✅ Simple and visual
- ✅ No CLI setup needed
- ✅ Direct control

**Cons:**
- ❌ Manual process
- ❌ No migration tracking
- ❌ Easy to forget which changes were applied

## Recommended Workflow

### For Your Current Setup:

Since you already have migration files in `supabase/migrations/`, here's the best approach:

**1. For Development (First Time):**
```bash
# Link to development project
supabase link --project-ref your-dev-project-ref

# Push all existing migrations
supabase db push
```

**2. For Future Changes:**
```bash
# Create new migration
supabase migration new your_change_description

# Edit the migration file
# Add your SQL changes

# Push to development
supabase db push

# Test thoroughly in development
# If everything works:

# Switch to production
supabase unlink
supabase link --project-ref your-prod-project-ref

# Push to production
supabase db push
```

**3. Alternative (If CLI is too complex):**
- Continue using SQL Editor for both projects
- Keep migration files in `supabase/migrations/` for reference
- Manually copy and run SQL in both projects

## Common Commands Reference

```bash
# Installation
npm install -g supabase

# Login
supabase login

# Initialize project
supabase init

# Link to project
supabase link --project-ref your-project-ref

# Unlink project
supabase unlink

# Push migrations
supabase db push

# List migrations
supabase migration list

# Create new migration
supabase migration new migration_name

# Reset database (CAUTION!)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --linked > database.types.ts

# Check CLI version
supabase --version

# Get help
supabase --help
```

## Troubleshooting

### Error: "Project not linked"
**Solution:**
```bash
supabase link --project-ref your-project-ref
```

### Error: "Database password incorrect"
**Solution:**
- Use the database password you set when creating the project
- Reset password in Supabase dashboard if forgotten

### Error: "Migration already applied"
**Solution:**
- This is normal - Supabase tracks applied migrations
- The migration will be skipped

### Want to reapply all migrations
**Solution:**
```bash
# CAUTION: This deletes all data!
supabase db reset
```

## Summary

**Quick Answer to Your Question:**

**Yes, you can use `supabase db push`!**

**Steps:**
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link to dev project: `supabase link --project-ref your-dev-project-ref`
4. Push migrations: `supabase db push`

**Your existing migration files in `supabase/migrations/` will be automatically detected and applied!**

**Alternative (Simpler):**
- Continue using SQL Editor in Supabase dashboard
- Copy and paste SQL from your migration files
- This works perfectly fine and is easier if you're not comfortable with CLI

Both methods work! Choose what you're most comfortable with. 🎉
