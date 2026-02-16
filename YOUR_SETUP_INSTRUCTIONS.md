# Your Specific Setup Instructions

## ✅ What You Have:
- **Secret Key**: `sk_test_xxxxxxxxxxxxxxxxxxxxx` (stored in your .env file)
- **Public Key**: `pk_test_xxxxxxxxxxxxxxxxxxxxx`
- **Webhook URL**: `https://www.judech.online/api/webhooks/payments`
- **Webhook Event**: `checkout_session.payment.paid` ✅

**Note**: Your actual API keys are safely stored in your `.env` file (which is not committed to git).

## 🔧 Configuration Steps

### Step 1: Get Your Webhook Secret

You mentioned you have a webhook set up, but I need the **Webhook Signing Secret**. Here's how to get it:

1. Go to: https://dashboard.paymongo.com/developers/webhooks
2. Find your webhook (the one with URL: `https://www.judech.online/api/webhooks/payments`)
3. Click on it to view details
4. Look for **"Webhook Signing Secret"** or **"Secret"**
5. It should start with `whsec_` (like: `whsec_xxxxxxxxxxxxx`)
6. Copy that secret

**Important**: If you don't see the webhook secret, you may need to:
- Delete the existing webhook
- Create a new one
- The secret will be shown when you create it

### Step 2: Configure Your .env File

Open your `.env` file and add these lines:

```env
# Server Configuration
PORT=4000
APP_BASE_URL=https://www.judech.online

# Payment Provider
PAYMENT_PROVIDER=paymongo

# PayMongo Test Keys
PAYMONGO_SECRET_KEY=sk_test_your_actual_secret_key_here
PAYMONGO_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here

# PayMongo URLs
PAYMONGO_API_BASE_URL=https://api.paymongo.com/v1
PAYMONGO_SUCCESS_URL=https://www.judech.online/
PAYMONGO_CANCEL_URL=https://www.judech.online/
```

**Important**: Replace the placeholder values with your actual keys from PayMongo dashboard.

**Replace** `whsec_YOUR_WEBHOOK_SECRET_HERE` with your actual webhook secret from Step 1.

### Step 3: Restart Your Server

Since you're using a deployed server (not localhost), you need to restart it. The method depends on how you deployed:

#### If using PM2:
```bash
pm2 restart pos-system
```
or
```bash
pm2 restart all
```

#### If using systemd:
```bash
sudo systemctl restart pos-system
```

#### If running directly with npm:
1. Stop the current process (Ctrl+C if in terminal)
2. Start again:
```bash
npm run dev
```
or
```bash
npm start
```

#### If using a hosting service (Heroku, Vercel, etc.):
- Update the environment variables in your hosting dashboard
- The service will automatically restart

### Step 4: Verify Configuration

After restarting, check if it's working:

1. **Open your browser**: https://www.judech.online/health

You should see something like:
```json
{
  "ok": true,
  "provider": "paymongo",
  "supabaseEnabled": false,
  "now": "2024-01-15T10:30:00.000Z"
}
```

If you see `"provider": "paymongo"`, it's configured correctly!

### Step 5: Test GCash Payment

1. Open: https://www.judech.online
2. Add products to cart
3. Select **GCash** payment method
4. Click **Checkout**
5. PayMongo checkout page will open
6. Use these **test credentials**:
   - **GCash Number**: `09123456789` (or any 11-digit number)
   - **OTP**: `123456` (test mode always accepts this)
7. Complete the payment
8. Return to your POS - it should update to "PAID" automatically

---

## 🚫 You DON'T Need ngrok

**Why?** Because you're already using a public domain (`https://www.judech.online`).

**ngrok is only needed when**:
- Testing on `localhost` (like `http://localhost:4000`)
- Your computer is not accessible from the internet

**Your situation**:
- ✅ You have a public domain: `https://www.judech.online`
- ✅ PayMongo can reach your webhook directly
- ✅ No tunnel needed!

---

## 📝 Quick Checklist

- [ ] Get webhook signing secret from PayMongo dashboard
- [ ] Update `.env` file with all keys
- [ ] Restart your server
- [ ] Check `/health` endpoint shows `"provider": "paymongo"`
- [ ] Test a GCash payment with test credentials
- [ ] Verify invoice updates to PAID status

---

## ❓ Troubleshooting

### Error: "PAYMONGO_SECRET_KEY is not configured"

**Solution**: 
- Make sure `.env` file has: `PAYMONGO_SECRET_KEY=sk_test_your_actual_key_here`
- Restart the server after changing `.env`

### Error: "PAYMONGO_WEBHOOK_SECRET is not configured"

**Solution**:
- Get the webhook signing secret from PayMongo dashboard
- Add to `.env`: `PAYMONGO_WEBHOOK_SECRET=whsec_xxxxx`
- Restart the server

### Payment completes but POS doesn't update

**Possible causes**:
- Webhook secret is wrong
- Webhook URL is incorrect
- Server is not running
- Firewall blocking webhook requests

**Solution**:
1. Check server logs for webhook errors
2. Verify webhook URL in PayMongo: `https://www.judech.online/api/webhooks/payments`
3. Make sure webhook event `checkout_session.payment.paid` is selected
4. Verify webhook secret matches in `.env` and PayMongo dashboard

---

## 🎯 Summary

Your `.env` file should look like this:

```env
PORT=4000
APP_BASE_URL=https://www.judech.online
PAYMENT_PROVIDER=paymongo

PAYMONGO_SECRET_KEY=sk_test_your_actual_secret_key_here
PAYMONGO_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here

PAYMONGO_SUCCESS_URL=https://www.judech.online/
PAYMONGO_CANCEL_URL=https://www.judech.online/
```

**Note**: Your actual keys are already configured in your local `.env` file. This is just an example format.

After setting this up and restarting, your GCash payments should work! 🎉
