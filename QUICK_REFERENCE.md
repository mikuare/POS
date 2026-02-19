# Quick Reference Card

## 🚀 Commands

### Development (Local Staging)
```bash
# Start development server with hot reload
npm run dev

# Runs on: http://localhost:4000
# Uses: .env.development
# Keys: TEST PayMongo keys (sk_test_*)
```

### Production Testing (Local)
```bash
# Start with production config locally
npm run start:prod

# Runs on: http://localhost:4000
# Uses: .env.production
# Keys: LIVE PayMongo keys (sk_live_*)
```

### Production Deployment
```bash
# Push to GitHub (Vercel auto-deploys)
git add .
git commit -m "Your changes"
git push origin main

# Runs on: https://www.judech.online
# Uses: Vercel environment variables
# Keys: LIVE PayMongo keys (sk_live_*)
```

## 📁 Environment Files

| File | Purpose | Keys | Supabase |
|------|---------|------|----------|
| `.env.development` | Local dev/staging | TEST (sk_test_*) | Dev project |
| `.env.production` | Production | LIVE (sk_live_*) | Prod project |
| `.env.example` | Template | N/A | N/A |

## 🔧 Setup Checklist

### First Time Setup
- [ ] Copy `.env.example` to `.env.development`
- [ ] Add TEST PayMongo keys to `.env.development`
- [ ] Set up ngrok: `ngrok http 4000`
- [ ] Configure webhook in PayMongo (TEST mode)
- [ ] Create dev Supabase project (optional)
- [ ] Test: `npm run dev`

### Production Setup
- [ ] Copy `.env.example` to `.env.production`
- [ ] Add LIVE PayMongo keys to `.env.production`
- [ ] Configure webhook in PayMongo (LIVE mode)
- [ ] Add all env vars to Vercel dashboard
- [ ] Push to GitHub: `git push origin main`
- [ ] Test: https://www.judech.online

## 🌐 URLs

### Development
- **POS UI**: http://localhost:4000
- **Health Check**: http://localhost:4000/health
- **Webhook**: https://your-ngrok-url.ngrok.io/api/webhooks/payments

### Production
- **POS UI**: https://www.judech.online
- **Health Check**: https://www.judech.online/health
- **Webhook**: https://www.judech.online/api/webhooks/payments

## 🔑 PayMongo Dashboard

### TEST Mode (Development)
- **Dashboard**: https://dashboard.paymongo.com/
- **API Keys**: https://dashboard.paymongo.com/developers/api-keys
- **Webhooks**: https://dashboard.paymongo.com/developers/webhooks
- **Toggle**: Switch to TEST mode (top-right)

### LIVE Mode (Production)
- **Dashboard**: https://dashboard.paymongo.com/
- **API Keys**: https://dashboard.paymongo.com/developers/api-keys
- **Webhooks**: https://dashboard.paymongo.com/developers/webhooks
- **Toggle**: Switch to LIVE mode (top-right)

## 🧪 Test Credentials

### PayMongo TEST Mode
- **GCash Number**: Any 11-digit number (e.g., 09123456789)
- **OTP**: `123456`
- **Result**: Payment succeeds in test mode

### PayMongo LIVE Mode
- **GCash Number**: Real GCash number
- **OTP**: Real OTP from GCash app
- **Result**: Real money transaction

## 🛠️ Useful Tools

### ngrok (Local Webhook Testing)
```bash
# Install: https://ngrok.com/download

# Start tunnel
ngrok http 4000

# Copy the https URL and use in PayMongo webhook
```

### Check Server Status
```bash
# Development
curl http://localhost:4000/health

# Production
curl https://www.judech.online/health
```

## 📝 Common Tasks

### Update Development Environment
1. Edit `.env.development`
2. Restart: `Ctrl+C` then `npm run dev`

### Update Production Environment
1. Edit environment variables in Vercel dashboard
2. Redeploy (or wait for next git push)

### Switch Between Environments
```bash
# Development
npm run dev

# Production (local test)
npm run start:prod
```

### View Logs
```bash
# Development: Check terminal output

# Production: Check Vercel dashboard > Deployments > Logs
```

## 🚨 Emergency

### Keys Exposed
1. Regenerate keys in PayMongo dashboard
2. Update `.env.development` and `.env.production`
3. Update Vercel environment variables
4. Redeploy

### Webhook Not Working
1. Check webhook URL is correct
2. Verify webhook secret matches
3. Check server logs for errors
4. Test webhook manually in PayMongo dashboard

### Production Down
1. Check Vercel deployment status
2. Check environment variables in Vercel
3. Check PayMongo dashboard for issues
4. Review recent git commits

## 📚 Documentation

- **Setup Guide**: [ENVIRONMENT_SETUP_GUIDE.md](ENVIRONMENT_SETUP_GUIDE.md)
- **Setup Checklist**: [TODO.md](TODO.md)
- **Main README**: [README.md](README.md)
- **PayMongo Guide**: [PAYMONGO_SETUP_GUIDE.md](PAYMONGO_SETUP_GUIDE.md)

## 💡 Tips

- Always test in development before production
- Keep TEST and LIVE keys separate
- Use separate Supabase projects for dev/prod
- Monitor PayMongo dashboard regularly
- Keep ngrok running during development
- Clear browser cache if changes don't appear
