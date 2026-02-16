# PayMongo Setup Guide for POS System

## Quick Setup Checklist

- [ ] Create PayMongo account
- [ ] Get Test Secret Key
- [ ] Set up Webhook (for local testing, use ngrok)
- [ ] Get Webhook Secret
- [ ] Configure .env file
- [ ] Restart server
- [ ] Test GCash payment

---

## Step-by-Step Instructions

### 1. Create PayMongo Account

1. Go to: https://dashboard.paymongo.com/
2. Click "Sign Up" or "Login"
3. Complete registration

### 2. Get Your Test API Keys

1. **Login to PayMongo Dashboard**: https://dashboard.paymongo.com/
2. **Switch to TEST MODE**:
   - Look for the toggle switch in the top-right corner
   - Make sure it says "TEST MODE" (not "LIVE MODE")
3. **Navigate to API Keys**:
   - Go to: https://dashboard.paymongo.com/developers/api-keys
   - Or click: Developers → API Keys
4. **Copy Secret Key**:
   - Find the "Secret Key" section
   - Click "Reveal" button
   - Copy the entire key (starts with `sk_test_`)
   - **Example format**: `sk_test_abcdefghijklmnopqrstuvwxyz123456`

### 3. Set Up Webhook (Required for Payment Confirmation)

#### Option A: Local Testing with ngrok (Recommended for Development)

1. **Install ngrok**:
   - Download from: https://ngrok.com/download
   - Or install via npm: `npm install -g ngrok`

2. **Start ngrok tunnel**:
   ```bash
   ngrok http 4000
   ```
   
3. **Copy the HTTPS URL**:
   - ngrok will display a URL like: `https://abc123.ngrok.io`
   - Copy this URL

4. **Create Webhook in PayMongo**:
   - Go to: https://dashboard.paymongo.com/developers/webhooks
   - Click "Add Webhook"
   - **Webhook URL**: `https://abc123.ngrok.io/api/webhooks/payments`
     (replace `abc123.ngrok.io` with your actual ngrok URL)
   - **Events to listen**: Check these boxes:
     - ✅ `checkout_session.payment.paid`
     - ✅ `payment.paid`
   - Click "Create Webhook"

5. **Copy Webhook Secret**:
   - After creating, you'll see the webhook details
   - Copy the "Webhook Signing Secret" (starts with `whsec_`)
   - **Example format**: `whsec_abcdefghijklmnopqrstuvwxyz123456`

#### Option B: Production/Deployed Server

1. **Create Webhook in PayMongo**:
   - Go to: https://dashboard.paymongo.com/developers/webhooks
   - Click "Add Webhook"
   - **Webhook URL**: `https://your-domain.com/api/webhooks/payments`
   - **Events to listen**: Check these boxes:
     - ✅ `checkout_session.payment.paid`
     - ✅ `payment.paid`
   - Click "Create Webhook"

2. **Copy Webhook Secret**:
   - Copy the "Webhook Signing Secret" (starts with `whsec_`)

### 4. Configure Your .env File

1. **Open your .env file** (if it doesn't exist, copy from .env.example):
   ```bash
   copy .env.example .env
   ```

2. **Add your PayMongo credentials**:
   ```env
   # Payment Provider
   PAYMENT_PROVIDER=paymongo
   
   # PayMongo Test Keys
   PAYMONGO_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
   PAYMONGO_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE
   
   # Optional: Customize URLs
   PAYMONGO_SUCCESS_URL=http://localhost:4000/
   PAYMONGO_CANCEL_URL=http://localhost:4000/
   ```

3. **Replace the placeholders**:
   - Replace `sk_test_YOUR_ACTUAL_SECRET_KEY_HERE` with your actual secret key
   - Replace `whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE` with your actual webhook secret

### 5. Restart Your Server

```bash
npm run dev
```

You should see:
```
POS server running on http://localhost:4000
Provider: paymongo
```

### 6. Test GCash Payment

1. **Open POS**: http://localhost:4000
2. **Add products** to cart
3. **Select GCash** as payment method
4. **Click Checkout**
5. **PayMongo checkout page** will open in a new tab
6. **Use Test Credentials**:
   - **GCash Number**: Any 11-digit number (e.g., `09123456789`)
   - **OTP**: `123456` (test mode always accepts this)
7. **Complete payment**
8. **Return to POS** - it should automatically update to "PAID" status

---

## Test Mode vs Live Mode

### Test Mode (Development)
- ✅ Use for development and testing
- ✅ No real money involved
- ✅ Keys start with `sk_test_`
- ✅ Test OTP is always `123456`
- ✅ Any phone number works

### Live Mode (Production)
- ⚠️ Real money transactions
- ⚠️ Keys start with `sk_live_`
- ⚠️ Real GCash accounts required
- ⚠️ Real OTP from GCash app
- ⚠️ Requires business verification

**Always use TEST MODE for development!**

---

## Troubleshooting

### Error: "PAYMONGO_SECRET_KEY is not configured"

**Solution**:
1. Check your `.env` file exists
2. Verify `PAYMONGO_SECRET_KEY` is set and not empty
3. Make sure the key starts with `sk_test_`
4. Restart the server after changing `.env`

### Error: "PAYMONGO_WEBHOOK_SECRET is not configured"

**Solution**:
1. Create a webhook in PayMongo dashboard
2. Copy the webhook signing secret
3. Add it to `.env` as `PAYMONGO_WEBHOOK_SECRET`
4. Restart the server

### Payment completes but POS doesn't update

**Possible causes**:
- Webhook URL is incorrect
- ngrok tunnel expired (restart ngrok and update webhook URL)
- Webhook events not selected
- Webhook secret is wrong

**Solution**:
1. Check ngrok is still running
2. Verify webhook URL in PayMongo dashboard matches ngrok URL
3. Check server console for webhook errors
4. Verify webhook secret in `.env` matches PayMongo dashboard

### ngrok session expired

**Solution**:
1. Restart ngrok: `ngrok http 4000`
2. Copy the new URL
3. Update webhook URL in PayMongo dashboard
4. No need to restart your POS server

---

## Security Best Practices

✅ **DO**:
- Use TEST keys for development
- Keep `.env` file in `.gitignore`
- Never commit API keys to git
- Use environment variables for all secrets
- Verify webhook signatures (already implemented)

❌ **DON'T**:
- Don't expose secret keys in client-side code
- Don't use LIVE keys in development
- Don't share your API keys publicly
- Don't skip webhook signature verification

---

## Need Help?

- **PayMongo Documentation**: https://developers.paymongo.com/docs
- **PayMongo Support**: support@paymongo.com
- **PayMongo Dashboard**: https://dashboard.paymongo.com/

---

## Summary

Your `.env` file should look like this:

```env
PORT=4000
APP_BASE_URL=http://localhost:4000
PAYMENT_PROVIDER=paymongo

# Get these from PayMongo Dashboard (TEST MODE)
PAYMONGO_SECRET_KEY=sk_test_your_actual_key_here
PAYMONGO_WEBHOOK_SECRET=whsec_your_actual_secret_here

PAYMONGO_SUCCESS_URL=http://localhost:4000/
PAYMONGO_CANCEL_URL=http://localhost:4000/
```

After setting this up and restarting your server, GCash payments should work! 🎉
