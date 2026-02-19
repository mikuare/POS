# POS SYSTEM (Cash + GCash Sample)

A runnable sample POS that supports:
- `Cash` payment (instant settlement with change computation)
- `GCash` flow via gateway-style checkout session (mock provider included)
- Webhook/callback style invoice status update to `PAID`
- Optional Supabase cloud persistence for sales/transactions
- **Separate Development and Production Environments**

## Why this architecture
Direct GCash API access is generally restricted. Typical POS systems integrate through a payment gateway (PayMongo, Xendit, etc.):
1. Create checkout session
2. Show QR/hosted checkout
3. Receive webhook/callback
4. Mark invoice paid and print receipt

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables

**For Development (Local Staging):**
```bash
# Copy the example file
copy .env.example .env.development

# Edit .env.development with your TEST credentials
# See ENVIRONMENT_SETUP_GUIDE.md for detailed instructions
```

**For Production:**
```bash
# Copy the example file
copy .env.example .env.production

# Edit .env.production with your LIVE credentials
# Configure Vercel environment variables (see guide)
```

### 3. Start the Development Server
```bash
npm run dev
```

Server will run on: `http://localhost:4000`

### 4. Open POS UI
Navigate to: `http://localhost:4000`

## 📚 Complete Setup Guide

For detailed setup instructions including:
- PayMongo TEST and LIVE keys configuration
- Webhook setup for local and production
- Supabase project setup (dev and prod)
- Vercel deployment configuration

**👉 See [ENVIRONMENT_SETUP_GUIDE.md](ENVIRONMENT_SETUP_GUIDE.md)**

## 💻 Available Scripts

```bash
# Development (uses .env.development)
npm run dev              # Start with hot reload on localhost

# Production
npm run start:prod       # Start with production config locally
npm run start            # Start production server (used by Vercel)
```

## 🌍 Environments

### Development (Staging)
- **URL**: `http://localhost:4000`
- **Config**: `.env.development`
- **PayMongo**: TEST keys (`sk_test_*`)
- **Supabase**: Development project (recommended)
- **Webhook**: ngrok tunnel for local testing

### Production
- **URL**: `https://www.judech.online`
- **Config**: Vercel environment variables
- **PayMongo**: LIVE keys (`sk_live_*`)
- **Supabase**: Production project
- **Webhook**: Production domain

## ⚙️ Configuration

### Environment Files

- **`.env.development`**: Local development with TEST keys
- **`.env.production`**: Production with LIVE keys
- **`.env.example`**: Template file (safe to commit)

### PayMongo Setup

**Development (TEST Mode):**
1. Get TEST keys from PayMongo dashboard (TEST mode)
2. Set up ngrok for local webhook testing
3. Configure `.env.development`

**Production (LIVE Mode):**
1. Get LIVE keys from PayMongo dashboard (LIVE mode)
2. Set up production webhook
3. Configure Vercel environment variables

**👉 See [ENVIRONMENT_SETUP_GUIDE.md](ENVIRONMENT_SETUP_GUIDE.md) for step-by-step instructions**

### Supabase Setup

**Recommended: Separate Projects**
- Development project for testing
- Production project for live data

**Quick Start: Same Project**
- Use same Supabase project for both
- ⚠️ Dev and prod data will be mixed

**👉 See [ENVIRONMENT_SETUP_GUIDE.md](ENVIRONMENT_SETUP_GUIDE.md) for detailed setup**

## 🧪 Testing Payment Methods

### Cash Payment
1. Add items to cart
2. Choose `Cash` payment method
3. Enter tendered amount
4. Invoice is marked `PAID` and persisted

### GCash Payment (Development)
1. Add items to cart
2. Choose `GCash` payment method
3. Enter customer info (optional)
4. Click `Checkout`
5. PayMongo checkout page opens
6. Use TEST credentials:
   - GCash Number: Any 11-digit number
   - OTP: `123456`
7. Complete payment
8. POS auto-updates to `PAID` via webhook

### GCash Payment (Production)
1. Same flow as development
2. Uses real GCash account
3. Real money transaction
4. Webhook confirms payment

## 🐛 Troubleshooting

### "npm run dev" shows production URL

**Solution**: 
- Verify `.env.development` exists and has `APP_BASE_URL=http://localhost:4000`
- Restart server

### Webhook not working locally

**Solution**:
- Start ngrok: `ngrok http 4000`
- Update webhook URL in PayMongo dashboard
- Verify webhook secret in `.env.development`

### Changes not reflecting in production

**Solution**:
- Verify git push succeeded
- Check Vercel deployment logs
- Verify environment variables in Vercel
- Clear browser cache

**👉 See [ENVIRONMENT_SETUP_GUIDE.md](ENVIRONMENT_SETUP_GUIDE.md) for more troubleshooting**

## 🔄 Development Workflow

1. **Develop Locally**:
   ```bash
   npm run dev
   ```
   - Test with TEST PayMongo keys
   - Use development Supabase
   - Verify all features work

2. **Push to Production**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
   - Vercel auto-deploys
   - Uses LIVE PayMongo keys
   - Uses production Supabase

3. **Verify Production**:
   - Visit: https://www.judech.online
   - Test functionality
   - Monitor for issues

## 🔒 Security Best Practices

- ✅ Separate TEST and LIVE keys
- ✅ Separate dev and prod Supabase projects
- ✅ Never commit `.env` files to git
- ✅ Use Vercel environment variables for production
- ✅ Rotate keys if exposed
- ✅ Monitor PayMongo dashboard regularly

## 📋 API Endpoints

### Health Check
```
GET /health
```

### Products
```
GET /api/products
```

### Invoices
```
POST /api/invoices
GET /api/invoices/:invoiceId
```

### Payments
```
POST /api/payments/cash
POST /api/payments/gcash/checkout
POST /api/payments/gcash/verify/:invoiceId
GET /api/payments/gcash/session/:reference
```

### Webhooks
```
POST /api/webhooks/payments
```

### Reports
```
GET /api/reports/sales
GET /api/admin/transactions
```

## 🚀 Production Deployment

### Vercel Setup
1. Connect GitHub repository to Vercel
2. Configure environment variables (see guide)
3. Deploy automatically on push to main

### Environment Variables (Vercel)
Add all variables from `.env.production` to Vercel dashboard:
- `PORT`, `APP_BASE_URL`, `PAYMENT_PROVIDER`
- `PAYMONGO_SECRET_KEY`, `PAYMONGO_WEBHOOK_SECRET`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Success/Cancel URLs

## 📚 Additional Resources

- **[ENVIRONMENT_SETUP_GUIDE.md](ENVIRONMENT_SETUP_GUIDE.md)**: Complete setup instructions
- **[TODO.md](TODO.md)**: Setup checklist
- **[PAYMONGO_SETUP_GUIDE.md](PAYMONGO_SETUP_GUIDE.md)**: PayMongo-specific guide

## ⚠️ Important Production Upgrades

Before going live, consider:
- Add authentication/authorization (cashier/admin roles)
- Implement inventory management
- Add official receipt numbering
- Implement tax calculations
- Add idempotent webhook handling
- Implement retry logic for failures
- Add comprehensive logging and monitoring
- Set up backup and disaster recovery
