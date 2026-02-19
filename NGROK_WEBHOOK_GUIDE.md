# ngrok Webhook Setup Guide for Development

## Your Current Setup (Correct! ✅)

You're doing it correctly! Here's what you're doing:

**Terminal 1:**
```bash
npm run dev
```
Server runs on: `http://localhost:4000`

**Terminal 2:**
```bash
ngrok http 4000
```
Creates tunnel: `https://fatigued-lashon-nonostensively.ngrok-free.dev`

**PayMongo Webhook:**
```
https://fatigued-lashon-nonostensively.ngrok-free.dev/api/webhooks/payments
```

**Events Selected:**
- ✅ `payment.paid`
- ✅ `checkout_session.payment.paid`
- ✅ `payment.failed`
- ✅ `payment.refunded`
- ✅ `payment.refund.updated`

This is **perfect**! ✅

## Important: About ngrok URLs

### ⚠️ ngrok URLs Change Every Time

**Key Point**: Every time you restart ngrok, you get a **NEW URL**.

**Example:**
- First run: `https://fatigued-lashon-nonostensively.ngrok-free.dev`
- Stop ngrok
- Start again: `https://different-name-here.ngrok-free.dev` ← **NEW URL!**

### When You Need to Update PayMongo Webhook

**Scenario 1: Just Restarting Dev Server**
```bash
# Terminal 1: Stop and restart
Ctrl+C
npm run dev
```
**ngrok status**: Still running in Terminal 2
**Webhook URL**: Still the same ✅
**Action needed**: None! Keep working.

**Scenario 2: Restarting ngrok**
```bash
# Terminal 2: Stop and restart
Ctrl+C
ngrok http 4000
```
**ngrok status**: New URL generated ⚠️
**Webhook URL**: Changed! Old webhook won't work ❌
**Action needed**: Update PayMongo webhook with new URL

**Scenario 3: Restarting Computer**
- Both terminals closed
- ngrok URL will be different
**Action needed**: 
1. Start ngrok: `ngrok http 4000`
2. Copy new URL
3. Update PayMongo webhook
4. Start dev server: `npm run dev`

## Best Practice Workflow

### Daily Development Session

**Step 1: Start ngrok (Do this FIRST)**
```bash
# Terminal 2
ngrok http 4000
```

**Step 2: Copy the URL**
```
Forwarding: https://your-new-url.ngrok-free.dev -> http://localhost:4000
```

**Step 3: Check if webhook needs updating**
- Go to: https://dashboard.paymongo.com/developers/webhooks
- Check if your webhook URL matches the new ngrok URL
- If different, update it

**Step 4: Start dev server**
```bash
# Terminal 1
npm run dev
```

**Step 5: Work all day**
- Keep both terminals running
- Don't close ngrok
- You can restart `npm run dev` as many times as needed
- ngrok URL stays the same ✅

**Step 6: End of day**
- Stop both terminals
- Tomorrow, repeat from Step 1

### When to Update PayMongo Webhook

**Update webhook when:**
- ❌ ngrok was restarted (new URL)
- ❌ Computer was restarted
- ❌ ngrok crashed or closed
- ❌ You see a different ngrok URL

**Don't update webhook when:**
- ✅ Only restarting `npm run dev`
- ✅ Making code changes
- ✅ ngrok is still running with same URL

## How to Update PayMongo Webhook

### Option A: Edit Existing Webhook (Recommended)

1. Go to: https://dashboard.paymongo.com/developers/webhooks
2. Find your TEST mode webhook
3. Click **Edit** (pencil icon)
4. Update URL to new ngrok URL:
   ```
   https://your-new-ngrok-url.ngrok-free.dev/api/webhooks/payments
   ```
5. Click **Save**
6. Done! ✅

### Option B: Delete and Create New

1. Go to: https://dashboard.paymongo.com/developers/webhooks
2. Delete old webhook
3. Click **Add Webhook**
4. Enter new ngrok URL
5. Select events (same as before)
6. Save webhook secret to `.env.development`

## Pro Tips

### Tip 1: Keep ngrok Running

**Best practice**: Keep ngrok running all day while developing

```bash
# Terminal 2 - Start once in the morning
ngrok http 4000

# Leave it running!
# Don't close this terminal
```

**Benefits:**
- ✅ Webhook URL stays the same
- ✅ No need to update PayMongo
- ✅ Webhooks keep working

### Tip 2: Use ngrok Free Static Domain (Optional)

ngrok offers a free static domain that doesn't change:

1. Sign up at: https://ngrok.com/
2. Get your free static domain (e.g., `your-name.ngrok-free.app`)
3. Use it:
   ```bash
   ngrok http --domain=your-name.ngrok-free.app 4000
   ```
4. Set webhook once, never update again! ✅

**Benefits:**
- ✅ Same URL every time
- ✅ Set webhook once
- ✅ Never update again

### Tip 3: Save Your ngrok URL

Create a file to track your current ngrok URL:

**Create: `CURRENT_NGROK_URL.txt`**
```
Current ngrok URL: https://fatigued-lashon-nonostensively.ngrok-free.dev
Last updated: 2024-01-15
PayMongo webhook: Updated ✅
```

Update this file when ngrok URL changes.

### Tip 4: Check Webhook Status

Test if your webhook is working:

```bash
# In Terminal 3
curl -X POST http://localhost:4000/api/webhooks/payments \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

Check Terminal 1 (dev server) for logs.

## Common Scenarios

### Scenario: "Webhook not receiving events"

**Checklist:**
1. ✅ Is ngrok running? Check Terminal 2
2. ✅ Is dev server running? Check Terminal 1
3. ✅ Does PayMongo webhook URL match current ngrok URL?
4. ✅ Are the correct events selected in PayMongo?
5. ✅ Is webhook secret correct in `.env.development`?

**Quick test:**
```bash
# Check if ngrok is accessible
curl https://your-ngrok-url.ngrok-free.dev/health
```

Should return: `{"ok":true,...}`

### Scenario: "ngrok terminal closed accidentally while dev server is running"

**What happens:**
- ❌ Dev server still running on `http://localhost:4000`
- ❌ ngrok tunnel is CLOSED
- ❌ PayMongo webhooks CANNOT reach your server
- ❌ GCash payments will complete but webhook won't update your POS
- ⚠️ Transactions will appear as "Waiting for payment" even if paid

**Symptoms:**
- Dev server works fine locally
- You can access `http://localhost:4000` in browser ✅
- But PayMongo webhooks fail ❌
- GCash checkout completes but POS doesn't update ❌
- Console shows: "Waiting for payment webhook..."

**What to do:**

**Option 1: Restart ngrok (Recommended)**
```bash
# Terminal 2 (or open new terminal)
ngrok http 4000
```

**Steps:**
1. Start ngrok again
2. Copy the NEW ngrok URL (it will be different!)
3. Go to PayMongo dashboard: https://dashboard.paymongo.com/developers/webhooks
4. Edit your TEST webhook
5. Update URL to new ngrok URL:
   ```
   https://new-ngrok-url.ngrok-free.dev/api/webhooks/payments
   ```
6. Save webhook
7. Test a new transaction
8. Webhook should work now! ✅

**Option 2: Restart both (Clean start)**
```bash
# Terminal 1: Stop dev server
Ctrl+C

# Terminal 2: Start ngrok
ngrok http 4000

# Copy new ngrok URL
# Update PayMongo webhook

# Terminal 1: Start dev server
npm run dev

# Test transaction
```

**Important Notes:**
- ⚠️ Old transactions (before ngrok closed) won't auto-update
- ✅ New transactions (after ngrok restarted) will work
- 💡 You can manually verify old payments using the "Verify Payment" feature

**Prevention:**
- Keep ngrok terminal visible
- Don't close ngrok terminal
- Pin ngrok terminal so you don't close it by accident
- Consider using ngrok's free static domain (URL never changes)

### Scenario: "ngrok URL changed, what do I do?"

**Steps:**
1. Copy new ngrok URL from Terminal 2
2. Go to PayMongo dashboard
3. Edit webhook with new URL
4. Test a transaction
5. Verify webhook works

**Time needed**: 2 minutes

### Scenario: "Can I use the same webhook for multiple days?"

**Answer**: Only if ngrok URL hasn't changed.

**If ngrok is still running**: Yes! ✅
**If ngrok was restarted**: No, update webhook ❌

### Scenario: "Dev server running, ngrok closed, what's the impact?"

**Impact on your system:**

**What still works:**
- ✅ Dev server accessible at `http://localhost:4000`
- ✅ You can browse the POS UI
- ✅ You can add items to cart
- ✅ Cash payments work fine
- ✅ GCash checkout creation works
- ✅ PayMongo checkout page opens

**What doesn't work:**
- ❌ Webhooks from PayMongo cannot reach your server
- ❌ POS won't auto-update when payment completes
- ❌ Transactions stuck on "Waiting for payment webhook"
- ❌ You won't see payment confirmation automatically

**Visual example:**

```
Without ngrok:
┌─────────────┐
│   PayMongo  │
│   Webhook   │ ──X──> Cannot reach localhost
└─────────────┘

With ngrok:
┌─────────────┐
│   PayMongo  │
│   Webhook   │ ──✓──> ngrok tunnel ──✓──> localhost:4000
└─────────────┘
```

**How to detect this issue:**
1. Complete a GCash payment
2. Payment succeeds on PayMongo
3. But POS still shows "Waiting for payment"
4. Check Terminal 2 - ngrok is not running!

**Quick fix:**
1. Restart ngrok
2. Update PayMongo webhook URL
3. For stuck transactions, use "Verify Payment" button in POS

## Your Events Selection

You selected these events (all good! ✅):

```
✅ payment.paid              - Payment successful
✅ checkout_session.payment.paid - Checkout completed
✅ payment.failed            - Payment failed
✅ payment.refunded          - Payment refunded
✅ payment.refund.updated    - Refund status changed
```

**Recommendation**: For basic POS, you only need:
- `payment.paid`
- `checkout_session.payment.paid`

The others are optional but good to have for future features.

## Quick Reference

### Daily Workflow

```bash
# Morning - Start ngrok first
ngrok http 4000

# Copy URL, update webhook if needed

# Start dev server
npm run dev

# Work all day (keep both running)

# Evening - Stop both
Ctrl+C (in both terminals)
```

### When ngrok URL Changes

```bash
# 1. Get new URL from ngrok terminal
# 2. Update PayMongo webhook
# 3. Continue working
```

### Verify Setup

```bash
# Check dev server
curl http://localhost:4000/health

# Check ngrok tunnel
curl https://your-ngrok-url.ngrok-free.dev/health

# Both should return same response
```

## Emergency: ngrok Closed While Working

### What Happened
You were working, dev server running fine, then accidentally closed ngrok terminal.

### Immediate Impact
```
Before (Working):
Dev Server ✅ → ngrok ✅ → PayMongo ✅

After (Broken):
Dev Server ✅ → ngrok ❌ → PayMongo ❌
```

### Quick Recovery Steps

**Step 1: Don't panic!** Your dev server is fine, just the tunnel is closed.

**Step 2: Restart ngrok**
```bash
# Open new terminal or use Terminal 2
ngrok http 4000
```

**Step 3: Copy new URL**
```
Forwarding: https://new-random-name.ngrok-free.dev -> http://localhost:4000
```

**Step 4: Update PayMongo webhook (2 minutes)**
1. Go to: https://dashboard.paymongo.com/developers/webhooks
2. Find your TEST webhook
3. Click Edit
4. Change URL to new ngrok URL
5. Save

**Step 5: Test**
- Create new GCash transaction
- Complete payment
- Webhook should work now ✅

### For Stuck Transactions

If you have transactions that completed while ngrok was closed:

**Option 1: Use Verify Payment Feature**
1. Go to transaction in POS
2. Click "Verify Payment" button
3. System checks PayMongo directly
4. Updates status if paid

**Option 2: Check PayMongo Dashboard**
1. Go to: https://dashboard.paymongo.com/payments
2. Find the payment
3. If status is "paid", manually mark in your system

**Option 3: Wait for next transaction**
- Old transactions may stay stuck
- New transactions will work fine
- Focus on new transactions

### Prevention Tips

**Tip 1: Keep ngrok visible**
- Don't minimize ngrok terminal
- Keep it on second monitor if available
- Pin the terminal window

**Tip 2: Use terminal tabs**
```
Terminal Window:
├── Tab 1: npm run dev
├── Tab 2: ngrok http 4000  ← Keep this visible!
└── Tab 3: git commands
```

**Tip 3: Add a reminder**
Create a sticky note on your screen:
```
⚠️ DON'T CLOSE NGROK TERMINAL! ⚠️
```

**Tip 4: Use ngrok static domain (Best solution)**
Sign up at ngrok.com for free static domain:
```bash
ngrok http --domain=yourname.ngrok-free.app 4000
```
- Same URL every time
- Set webhook once
- Never update again!

## Summary

**Your current setup is correct! ✅**

**Key points:**
1. ✅ Run ngrok in separate terminal
2. ✅ Keep ngrok running while developing
3. ⚠️ Update webhook when ngrok URL changes
4. ✅ Don't need to restart ngrok when restarting dev server
5. ✅ Events selection is good

**When to restart ngrok:**
- Only if it crashes
- Only if you closed it accidentally
- Only if you need to (usually not needed)

**When to update webhook:**
- Only when ngrok URL changes
- Not when just restarting dev server

**If ngrok closes while dev server is running:**
1. ⚠️ Webhooks will stop working
2. ✅ Dev server still works locally
3. 🔧 Restart ngrok and update webhook
4. ✅ New transactions will work
5. 💡 Use "Verify Payment" for stuck transactions

**Best practice:** Keep ngrok running all day, don't close it! 🎉
