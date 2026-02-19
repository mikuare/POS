# Troubleshooting GCash Checkout Error

## Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error means PayMongo API is returning an HTML error page instead of JSON. This typically happens due to:

1. Invalid or missing API key
2. Wrong API endpoint
3. Network/CORS issues
4. PayMongo service issues

## Quick Diagnosis Steps

### Step 1: Verify Your PayMongo Secret Key

Open `.env.development` and check:

```env
PAYMONGO_SECRET_KEY=sk_test_your_actual_key_here
```

**Common Issues:**
- ❌ Key is empty or missing
- ❌ Key has extra spaces or quotes
- ❌ Using LIVE key (sk_live_*) instead of TEST key (sk_test_*)
- ❌ Key is incomplete or corrupted

**How to Fix:**
1. Go to: https://dashboard.paymongo.com/developers/api-keys
2. Switch to **TEST MODE** (toggle in top-right)
3. Copy the **Secret Key** (starts with `sk_test_`)
4. Update `.env.development`:
   ```env
   PAYMONGO_SECRET_KEY=sk_test_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   ```
5. **Important**: No quotes, no spaces, just the key
6. Restart server: `Ctrl+C` then `npm run dev`

### Step 2: Test PayMongo API Connection

Create a test file to verify your API key works:

**Create: `test-paymongo-connection.js`**
```javascript
require('dotenv').config({ path: '.env.development' });

const secretKey = process.env.PAYMONGO_SECRET_KEY;

console.log('Testing PayMongo Connection...');
console.log('Secret Key:', secretKey ? `${secretKey.substring(0, 15)}...` : 'MISSING!');

if (!secretKey) {
  console.error('❌ PAYMONGO_SECRET_KEY is not set in .env.development');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;

async function testConnection() {
  try {
    console.log('\n1. Testing API connection...');
    const response = await fetch('https://api.paymongo.com/v1/payment_methods', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': authHeader
      }
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log('\nResponse Body (first 500 chars):', text.substring(0, 500));

    if (response.status === 401) {
      console.error('\n❌ Authentication Failed!');
      console.error('Your API key is invalid or expired.');
      console.error('Please check:');
      console.error('1. You copied the correct SECRET KEY (not PUBLIC KEY)');
      console.error('2. You are in TEST MODE in PayMongo dashboard');
      console.error('3. The key has no extra spaces or quotes');
      return;
    }

    if (response.ok) {
      console.log('\n✅ Connection successful!');
      console.log('Your PayMongo API key is working correctly.');
    } else {
      console.error('\n❌ Connection failed with status:', response.status);
      console.error('Response:', text);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('This might be a network issue or PayMongo service is down.');
  }
}

testConnection();
```

**Run the test:**
```bash
node test-paymongo-connection.js
```

**Expected Output (Success):**
```
Testing PayMongo Connection...
Secret Key: sk_test_AbCdEf...
Response Status: 200
✅ Connection successful!
```

**Expected Output (Failed - Invalid Key):**
```
Testing PayMongo Connection...
Secret Key: sk_test_AbCdEf...
Response Status: 401
❌ Authentication Failed!
```

### Step 3: Check Server Logs

When you get the error, check your terminal for detailed logs:

```bash
npm run dev
```

Look for:
- `[PayMongo] Failed to create customer:` - Customer creation failed
- `Failed to create PayMongo checkout session` - Checkout creation failed
- Any error messages with details

### Step 4: Verify Environment File is Loaded

Add this to your server startup to verify:

**Edit `src/server.js`** (temporarily for debugging):

Add after line 16 (after `const providerName = ...`):
```javascript
console.log('=== ENVIRONMENT CHECK ===');
console.log('APP_BASE_URL:', baseUrl);
console.log('PAYMENT_PROVIDER:', providerName);
console.log('PAYMONGO_SECRET_KEY:', process.env.PAYMONGO_SECRET_KEY ? 
  `${process.env.PAYMONGO_SECRET_KEY.substring(0, 15)}...` : 'MISSING!');
console.log('========================');
```

Restart server and check output:
```
=== ENVIRONMENT CHECK ===
APP_BASE_URL: http://localhost:4000
PAYMENT_PROVIDER: paymongo
PAYMONGO_SECRET_KEY: sk_test_AbCdEf...
========================
```

If you see `MISSING!`, the environment file is not being loaded.

### Step 5: Common Fixes

#### Fix 1: Restart Server
```bash
# Stop server
Ctrl+C

# Start again
npm run dev
```

#### Fix 2: Clear Node Cache
```bash
# Windows
rd /s /q node_modules
del package-lock.json
npm install
npm run dev
```

#### Fix 3: Check .env.development Format

Your `.env.development` should look like this (no quotes):
```env
PORT=4000
APP_BASE_URL=http://localhost:4000
PAYMENT_PROVIDER=paymongo
PAYMONGO_SECRET_KEY=sk_test_your_actual_key_here
PAYMONGO_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PAYMONGO_SUCCESS_URL=http://localhost:4000/
PAYMONGO_CANCEL_URL=http://localhost:4000/
SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key
```

**Common Mistakes:**
```env
# ❌ WRONG - Has quotes
PAYMONGO_SECRET_KEY="sk_test_..."

# ❌ WRONG - Has spaces
PAYMONGO_SECRET_KEY = sk_test_...

# ❌ WRONG - Missing sk_test_ prefix
PAYMONGO_SECRET_KEY=AbCdEfGhIjKlMnOp...

# ✅ CORRECT
PAYMONGO_SECRET_KEY=sk_test_AbCdEfGhIjKlMnOp...
```

#### Fix 4: Verify Node Version

PayMongo requires Node.js 18 or higher for native fetch support:

```bash
node --version
```

Should show: `v18.x.x` or higher

If lower, update Node.js: https://nodejs.org/

### Step 6: Test with Minimal Code

Create a minimal test to isolate the issue:

**Create: `test-minimal-checkout.js`**
```javascript
require('dotenv').config({ path: '.env.development' });

const secretKey = process.env.PAYMONGO_SECRET_KEY;

if (!secretKey) {
  console.error('PAYMONGO_SECRET_KEY not found!');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;

async function createMinimalCheckout() {
  const body = {
    data: {
      attributes: {
        billing: {
          name: 'Test Customer',
          email: 'test@example.com'
        },
        send_email_receipt: false,
        show_description: true,
        show_line_items: true,
        line_items: [{
          name: 'Test Item',
          quantity: 1,
          amount: 10000, // 100.00 PHP
          currency: 'PHP'
        }],
        payment_method_types: ['gcash'],
        description: 'Test Checkout',
        success_url: 'http://localhost:4000/',
        cancel_url: 'http://localhost:4000/'
      }
    }
  };

  try {
    console.log('Creating checkout session...');
    console.log('API Key:', secretKey.substring(0, 15) + '...');
    
    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': authHeader
      },
      body: JSON.stringify(body)
    });

    console.log('Response Status:', response.status);
    
    const text = await response.text();
    console.log('Response (first 1000 chars):', text.substring(0, 1000));

    if (response.ok) {
      const data = JSON.parse(text);
      console.log('\n✅ Success!');
      console.log('Checkout URL:', data.data.attributes.checkout_url);
    } else {
      console.error('\n❌ Failed!');
      try {
        const errorData = JSON.parse(text);
        console.error('Error:', errorData.errors?.[0]?.detail || 'Unknown error');
      } catch {
        console.error('Raw response:', text);
      }
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

createMinimalCheckout();
```

**Run:**
```bash
node test-minimal-checkout.js
```

## Specific Error Messages

### "401 Unauthorized"
**Cause**: Invalid API key
**Fix**: 
1. Get new key from PayMongo dashboard
2. Make sure you're in TEST mode
3. Copy SECRET key (not PUBLIC key)
4. Update `.env.development`

### "404 Not Found"
**Cause**: Wrong API endpoint
**Fix**: Check `PAYMONGO_API_BASE_URL` in `.env.development`
Should be: `https://api.paymongo.com/v1`

### "Network request failed"
**Cause**: Internet connection or firewall
**Fix**:
1. Check internet connection
2. Try: `ping api.paymongo.com`
3. Check firewall settings
4. Try different network

### "Invalid request body"
**Cause**: Malformed request data
**Fix**: Check invoice data format, ensure amounts are valid

## Still Not Working?

### Check PayMongo Status
Visit: https://status.paymongo.com/
Check if PayMongo services are operational

### Enable Debug Logging

Add to `src/providers/paymongoProvider.js` after line 145:

```javascript
console.log('[DEBUG] Creating checkout with body:', JSON.stringify(body, null, 2));
console.log('[DEBUG] Auth header:', this.getAuthHeader().substring(0, 20) + '...');
```

### Contact Support

If nothing works:
1. Take screenshot of error
2. Copy your test results
3. Note your Node.js version
4. Contact PayMongo support: support@paymongo.com

## Quick Checklist

Before asking for help, verify:

- [ ] `.env.development` file exists
- [ ] `PAYMONGO_SECRET_KEY` starts with `sk_test_`
- [ ] No quotes or spaces around the key
- [ ] Server restarted after changing `.env.development`
- [ ] Node.js version is 18 or higher
- [ ] Internet connection is working
- [ ] PayMongo dashboard shows TEST mode
- [ ] API key is not expired or revoked
- [ ] Test script (`test-paymongo-connection.js`) passes

## Summary

The most common cause is an **invalid or missing API key**. 

**Quick fix:**
1. Go to PayMongo dashboard (TEST mode)
2. Copy SECRET key
3. Update `.env.development` (no quotes)
4. Restart server
5. Try again

If that doesn't work, run the test scripts above to diagnose the exact issue.
