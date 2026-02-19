# Environment Setup Guide

This guide will help you set up separate development (staging) and production environments for your POS system.

## 🎯 Overview

Your POS system now supports two separate environments:
- **Development (Staging)**: For local testing before pushing to production
- **Production**: Live environment on Vercel

## 📁 Environment Files

### `.env.development` - Local Development/Staging
- Used when running `npm run dev`
- Uses TEST PayMongo keys
- Uses development Supabase project
- Runs on `http://localhost:4000`

### `.env.production` - Production
- Used when deploying to Vercel
- Uses LIVE PayMongo keys
- Uses production Supabase project
- Runs on `https://www.judech.online`

### `.env.example` - Template
- Template file for reference
- Not used by the application
- Safe to commit to git

## 🚀 Quick Start

### Step 1: Set Up Development Environment

1. **Copy your current production credentials** to `.env.development`:
   ```bash
   # Open .env.development and fill in:
   ```

2. **Get PayMongo TEST keys**:
   - Go to: https://dashboard.paymongo.com/developers/api-keys
   - **Switch to TEST MODE** (toggle in top-right)
   - Copy your TEST Secret Key (starts with `sk_test_`)
   - Add to `.env.development`:
     ```env
     PAYMONGO_SECRET_KEY=sk_test_your_test_key_here
     ```

3. **Set up webhook for local testing** (using ngrok):
   ```bash
   # Install ngrok if you haven't: https://ngrok.com/download
   
   # Start ngrok tunnel
   ngrok http 4000
   ```
   
   - Copy the https URL (e.g., `https://abc123.ngrok.io`)
   - Go to PayMongo dashboard: https://dashboard.paymongo.com/developers/webhooks
   - Create webhook with URL: `https://abc123.ngrok.io/api/webhooks/payments`
   - Select events: `checkout_session.payment.paid` and `payment.paid`
   - Copy the webhook secret and add to `.env.development`:
     ```env
     PAYMONGO_WEBHOOK_SECRET=whsec_your_test_webhook_secret
     ```

4. **Create Development Supabase Project** (Recommended):
   
   **Option A: Create Separate Dev Project (Recommended)**
   - Go to: https://supabase.com/dashboard
   - Click "New Project"
   - Name: "POS System - Development"
   - Choose region and password
   - Wait for project to be ready
   - Go to: Project Settings > API
   - Copy URL and service_role key
   - Add to `.env.development`:
     ```env
     SUPABASE_URL=https://your-dev-project.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key
     ```
   - Run the schema in SQL Editor:
     - Copy contents from `supabase/schema.sql`
     - Paste in SQL Editor and run
   
   **Option B: Use Same Supabase Project (Quick Start)**
   - Copy your production Supabase credentials to `.env.development`
   - ⚠️ Warning: Dev and prod data will be in same database

### Step 2: Set Up Production Environment

1. **Get PayMongo LIVE keys**:
   - Go to: https://dashboard.paymongo.com/developers/api-keys
   - **Switch to LIVE MODE** (toggle in top-right)
   - Copy your LIVE Secret Key (starts with `sk_live_`)
   - Add to `.env.production`:
     ```env
     PAYMONGO_SECRET_KEY=sk_live_your_live_key_here
     ```

2. **Set up production webhook**:
   - Go to PayMongo dashboard: https://dashboard.paymongo.com/developers/webhooks
   - Create webhook with URL: `https://www.judech.online/api/webhooks/payments`
   - Select events: `checkout_session.payment.paid` and `payment.paid`
   - Copy webhook secret and add to `.env.production`:
     ```env
     PAYMONGO_WEBHOOK_SECRET=whsec_your_live_webhook_secret
     ```

3. **Configure production Supabase**:
   - Use your existing production Supabase project
   - Add credentials to `.env.production`:
     ```env
     SUPABASE_URL=https://your-prod-project.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key
     ```

### Step 3: Configure Vercel

1. **Go to Vercel Dashboard**:
   - Navigate to your project settings
   - Go to: Settings > Environment Variables

2. **Add Production Environment Variables**:
   Copy all variables from `.env.production` and add them to Vercel:
   - `PORT=4000`
   - `APP_BASE_URL=https://www.judech.online`
   - `PAYMENT_PROVIDER=paymongo`
   - `PAYMONGO_SECRET_KEY=sk_live_...`
   - `PAYMONGO_WEBHOOK_SECRET=whsec_...`
   - `PAYMONGO_SUCCESS_URL=https://www.judech.online/`
   - `PAYMONGO_CANCEL_URL=https://www.judech.online/`
   - `SUPABASE_URL=https://...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`

3. **Redeploy** (if needed):
   ```bash
   git push origin main
   ```

## 💻 Usage

### Development (Local Staging)

```bash
# Start development server with hot reload
npm run dev

# Server will run on: http://localhost:4000
# Uses: .env.development
# Features: Hot reload on file changes
```

### Production (Local Test)

```bash
# Start production server locally (no hot reload)
npm run start:prod

# Server will run on: http://localhost:4000
# Uses: .env.production
# Note: This uses production credentials locally
```

### Production (Vercel)

```bash
# Push to GitHub
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically deploy
# Uses: Environment variables from Vercel dashboard
```

## 🔄 Workflow

### Recommended Development Workflow:

1. **Develop Locally** (Staging):
   ```bash
   npm run dev
   ```
   - Make your changes
   - Test with TEST PayMongo keys
   - Test with development Supabase data
   - Verify all functionality works

2. **Test Locally** (Production Mode):
   ```bash
   npm run start:prod
   ```
   - Optional: Test with production credentials locally
   - Verify configuration is correct

3. **Deploy to Production**:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin main
   ```
   - Vercel automatically deploys
   - Uses LIVE PayMongo keys
   - Uses production Supabase

4. **Verify Production**:
   - Visit: https://www.judech.online
   - Test the new feature
   - Monitor for any issues

## 🔒 Security Best Practices

1. **Never commit `.env` files**:
   - `.env.development` - Contains TEST keys (still sensitive)
   - `.env.production` - Contains LIVE keys (very sensitive)
   - Both are in `.gitignore`

2. **Use separate keys for dev and prod**:
   - Development: TEST keys (`sk_test_*`)
   - Production: LIVE keys (`sk_live_*`)

3. **Use separate Supabase projects**:
   - Prevents accidental data corruption
   - Allows safe testing

4. **Rotate keys regularly**:
   - If keys are exposed, regenerate immediately
   - Update in both `.env.production` and Vercel

## 🐛 Troubleshooting

### Issue: "npm run dev" still shows production URL

**Solution**:
1. Make sure `.env.development` exists
2. Check that `APP_BASE_URL=http://localhost:4000` in `.env.development`
3. Restart the server: `Ctrl+C` then `npm run dev`

### Issue: Webhook not working locally

**Solution**:
1. Make sure ngrok is running: `ngrok http 4000`
2. Update webhook URL in PayMongo dashboard with ngrok URL
3. Verify webhook secret in `.env.development`
4. Check server logs for webhook errors

### Issue: "PAYMONGO_SECRET_KEY is not configured"

**Solution**:
1. Open `.env.development`
2. Add your TEST secret key: `PAYMONGO_SECRET_KEY=sk_test_...`
3. Restart server

### Issue: Changes not reflecting in production

**Solution**:
1. Verify git push was successful
2. Check Vercel deployment logs
3. Verify environment variables in Vercel dashboard
4. Clear browser cache and hard refresh

## 📝 Environment Variables Reference

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `PORT` | 4000 | 4000 | Server port |
| `APP_BASE_URL` | http://localhost:4000 | https://www.judech.online | Base URL for callbacks |
| `PAYMENT_PROVIDER` | paymongo | paymongo | Payment provider |
| `PAYMONGO_SECRET_KEY` | sk_test_* | sk_live_* | PayMongo API key |
| `PAYMONGO_WEBHOOK_SECRET` | whsec_* (test) | whsec_* (live) | Webhook signature secret |
| `SUPABASE_URL` | Dev project URL | Prod project URL | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Dev key | Prod key | Supabase service role key |

## 🎉 You're All Set!

Now you can:
- ✅ Develop and test locally with `npm run dev`
- ✅ Use TEST PayMongo keys safely
- ✅ Keep development and production data separate
- ✅ Push to production only when ready
- ✅ Automatic deployment via Vercel

Happy coding! 🚀
