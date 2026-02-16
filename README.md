# POS SYSTEM (Cash + GCash Sample)

A runnable sample POS that supports:
- `Cash` payment (instant settlement with change computation)
- `GCash` flow via gateway-style checkout session (mock provider included)
- Webhook/callback style invoice status update to `PAID`
- Optional Supabase cloud persistence for sales/transactions

## Why this architecture
Direct GCash API access is generally restricted. Typical POS systems integrate through a payment gateway (PayMongo, Xendit, etc.):
1. Create checkout session
2. Show QR/hosted checkout
3. Receive webhook/callback
4. Mark invoice paid and print receipt

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
copy .env.example .env
```

Then edit `.env` and configure based on your needs (see configuration sections below).

### 3. Start the Server
```bash
npm run dev
```

### 4. Open POS UI
Navigate to: `http://localhost:4000`

## Configuration

### PayMongo Setup (for Real GCash Payments)

To use PayMongo for GCash payments in **TEST MODE**:

#### Step 1: Get Your PayMongo Test API Keys

1. **Sign up/Login** to PayMongo Dashboard:
   - Go to: https://dashboard.paymongo.com/
   - Create an account or login

2. **Navigate to API Keys**:
   - Go to: https://dashboard.paymongo.com/developers/api-keys
   - Switch to **TEST MODE** (toggle in the top-right corner)

3. **Copy Your Test Secret Key**:
   - Look for the **Secret Key** (starts with `sk_test_`)
   - Click "Reveal" and copy the full key
   - **IMPORTANT**: Use TEST keys (sk_test_) for development, NOT live keys (sk_live_)

#### Step 2: Set Up Webhook (Required for Payment Confirmation)

1. **Create a Webhook**:
   - Go to: https://dashboard.paymongo.com/developers/webhooks
   - Click "Add Webhook"
   - **Webhook URL**: `https://your-domain.com/api/webhooks/payments`
     - For local testing, use a tunnel service like ngrok:
       ```bash
       ngrok http 4000
       ```
     - Then use: `https://your-ngrok-url.ngrok.io/api/webhooks/payments`

2. **Select Events**:
   - Check: `checkout_session.payment.paid`
   - Check: `payment.paid`

3. **Copy Webhook Secret**:
   - After creating, copy the **Webhook Signing Secret** (starts with `whsec_`)

#### Step 3: Configure .env File

Open your `.env` file and add:

```env
# Payment Provider
PAYMENT_PROVIDER=paymongo

# PayMongo Test Keys
PAYMONGO_SECRET_KEY=sk_test_your_secret_key_here
PAYMONGO_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional: Customize URLs
PAYMONGO_SUCCESS_URL=http://localhost:4000/
PAYMONGO_CANCEL_URL=http://localhost:4000/
```

#### Step 4: Restart Server

```bash
npm run dev
```

#### Step 5: Test GCash Payment

1. Open POS: `http://localhost:4000`
2. Add products to cart
3. Select **GCash** as payment method
4. Click **Checkout**
5. A PayMongo checkout page will open
6. Use PayMongo's test GCash credentials:
   - **Test GCash Number**: Any 11-digit number (e.g., 09123456789)
   - **OTP**: `123456` (test mode always accepts this)
7. Complete payment
8. POS will automatically update to PAID status via webhook

### Mock Provider (for Testing Without PayMongo)

If you want to test without setting up PayMongo:

1. In `.env`, set:
   ```env
   PAYMENT_PROVIDER=mock
   ```

2. Restart server

3. When checking out with GCash:
   - A mock checkout page will open
   - Click "Simulate Successful Payment"
   - Invoice will be marked as PAID immediately

## Supabase setup (store transactions + sales)
1. Open Supabase SQL Editor and run `supabase/schema.sql`.
2. In `.env`, set:
   - `SUPABASE_URL=https://<project-id>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=<from Supabase Project Settings > API>`
3. Restart server.
4. Verify with `GET /health` that `supabaseEnabled=true`.

## Test payment methods
### Cash
1. Add items
2. Choose `Cash`
3. Enter tendered amount
4. Invoice is marked `PAID` and persisted

### GCash (mock)
1. Add items
2. Choose `GCash`
3. Click `Checkout`
4. POS displays QR + opens checkout page
5. In checkout page, click `Simulate Successful Payment`
6. POS auto-refreshes and marks invoice `PAID` and persists

## Troubleshooting

### Error: "PAYMONGO_SECRET_KEY is not configured"

**Cause**: The PayMongo secret key is missing or empty in your `.env` file.

**Solution**:
1. Make sure you've copied `.env.example` to `.env`
2. Add your PayMongo test secret key to `.env`:
   ```env
   PAYMONGO_SECRET_KEY=sk_test_your_actual_key_here
   ```
3. Restart the server: `npm run dev`

### Error: "PAYMONGO_WEBHOOK_SECRET is not configured"

**Cause**: Webhook secret is missing when PayMongo tries to verify webhook signatures.

**Solution**:
1. Create a webhook in PayMongo dashboard
2. Copy the webhook signing secret
3. Add to `.env`:
   ```env
   PAYMONGO_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```
4. Restart the server

### Webhook Not Receiving Events (Local Development)

**Cause**: PayMongo cannot reach `localhost` directly.

**Solution**:
1. Use ngrok or similar tunnel:
   ```bash
   ngrok http 4000
   ```
2. Update webhook URL in PayMongo dashboard to ngrok URL
3. Restart server if needed

### Payment Stuck on "Waiting for payment webhook"

**Possible Causes**:
- Webhook URL is incorrect
- Webhook secret is wrong
- Webhook events not selected in PayMongo dashboard
- Firewall blocking webhook requests

**Solution**:
1. Check webhook configuration in PayMongo dashboard
2. Verify webhook URL is accessible
3. Check server logs for webhook errors
4. Ensure `checkout_session.payment.paid` event is enabled

## Real Gateway Integration Notes (PayMongo)

✅ **Current Implementation**:
- Follows PayMongo's recommended checkout session flow
- Implements webhook signature verification
- Handles both `checkout_session.payment.paid` and `payment.paid` events
- Uses test mode for development

⚠️ **Before Going Live**:
- Switch to LIVE API keys (sk_live_) in production
- Update webhook URL to production domain
- Never expose secret keys in client-side code
- Implement proper error handling and logging
- Add idempotent webhook handling
- Test thoroughly with real GCash accounts

## Important production upgrades
- Add auth/roles for cashier/admin
- Add inventory decrement + audit logs
- Add official receipt numbering and tax logic
- Add idempotent webhook handling + signature verification
- Add retries for gateway/webhook failures
