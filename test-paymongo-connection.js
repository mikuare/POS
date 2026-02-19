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
