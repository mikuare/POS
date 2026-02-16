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

## Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   copy .env.example .env
   ```
3. Start:
   ```bash
   npm run dev
   ```
4. Open POS UI:
   - `http://localhost:4000`

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

## Real gateway integration notes (PayMongo)
- Keep the same `create checkout -> show QR/link -> webhook -> mark PAID` flow.
- Add your PayMongo API calls in `src/providers/paymongoProvider.js`.
- Verify webhook signatures before updating invoice status.
- Never trust browser callback alone for payment confirmation.

## Important production upgrades
- Add auth/roles for cashier/admin
- Add inventory decrement + audit logs
- Add official receipt numbering and tax logic
- Add idempotent webhook handling + signature verification
- Add retries for gateway/webhook failures
