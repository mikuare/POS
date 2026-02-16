// Test script to verify GCash checkout functionality
const BASE_URL = 'http://localhost:4000';

async function testGcashCheckout() {
  console.log('🧪 Testing GCash Checkout Flow...\n');

  try {
    // Step 1: Get products
    console.log('1️⃣ Fetching products...');
    const productsRes = await fetch(`${BASE_URL}/api/products`);
    const { products } = await productsRes.json();
    console.log(`✅ Found ${products.length} products\n`);

    // Step 2: Create invoice with GCash payment
    console.log('2️⃣ Creating invoice with GCash payment...');
    const invoiceRes = await fetch(`${BASE_URL}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { productId: products[0].id, qty: 2 },
          { productId: products[1].id, qty: 1 }
        ],
        paymentMethod: 'gcash'
      })
    });

    if (!invoiceRes.ok) {
      const error = await invoiceRes.json();
      console.error('❌ Failed to create invoice:', error);
      return;
    }

    const { invoice } = await invoiceRes.json();
    console.log(`✅ Invoice created: ${invoice.reference}`);
    console.log(`   Total: PHP ${invoice.total}`);
    console.log(`   Status: ${invoice.status}\n`);

    // Step 3: Create GCash checkout
    console.log('3️⃣ Creating GCash checkout session...');
    const checkoutRes = await fetch(`${BASE_URL}/api/payments/gcash/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId: invoice.id })
    });

    if (!checkoutRes.ok) {
      const error = await checkoutRes.json();
      console.error('❌ Failed to create checkout:', error);
      
      if (error.error && error.error.includes('PAYMONGO_SECRET_KEY')) {
        console.error('\n⚠️  ISSUE FOUND: PayMongo Secret Key is not configured properly!');
        console.error('   Please check your .env file.');
      }
      return;
    }

    const { checkout } = await checkoutRes.json();
    console.log('✅ Checkout session created successfully!');
    console.log(`   Provider: ${checkout.provider}`);
    console.log(`   Reference: ${checkout.reference}`);
    console.log(`   Amount: PHP ${checkout.amount}`);
    console.log(`   Status: ${checkout.status}`);
    console.log(`   Checkout URL: ${checkout.checkoutUrl}\n`);

    console.log('🎉 SUCCESS! GCash checkout is working correctly!');
    console.log('\n📝 Next steps:');
    console.log('   1. Open the checkout URL in a browser');
    console.log('   2. Use test credentials:');
    console.log('      - GCash Number: 09123456789');
    console.log('      - OTP: 123456');
    console.log('   3. Complete the payment');
    console.log('   4. Check if the invoice updates to PAID status');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testGcashCheckout();
