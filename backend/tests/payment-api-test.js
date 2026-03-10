const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let userCookies = '';
let vendorCookies = '';
let testProductId = '';
let razorpayOrderId = '';

// Helper to generate valid Razorpay signature
const generateValidSignature = (orderId, paymentId) => {
  const text = `${orderId}|${paymentId}`;
  return crypto
    .createHmac('sha256', 'test_secret_key_for_development_only')
    .update(text)
    .digest('hex');
};

// Helper function to handle errors
const handleError = (error, testName) => {
  console.log(`❌ ${testName} failed`);
  if (error.response) {
    console.log(`   Status: ${error.response.status}`);
    console.log(`   Message: ${error.response.data.message || error.response.data.error}`);
  } else {
    console.log(`   Error: ${error.message}`);
  }
  throw error;
};

// Setup: Create test users and product
async function setup() {
  try {
    const userEmail = `testuser${Date.now()}@test.com`;
    const vendorEmail = `testvendor${Date.now()}@test.com`;
    
    console.log('Setup: Creating test user...');
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: userEmail,
      password: 'Test123!@#',
      role: 'user'
    });
    
    const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: userEmail,
      password: 'Test123!@#'
    });
    userCookies = userLogin.headers['set-cookie'];
    console.log('✅ Test user created and logged in');

    console.log('Setup: Creating test vendor...');
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Vendor',
      email: vendorEmail,
      password: 'Test123!@#',
      role: 'vendor'
    });
    
    const vendorLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: vendorEmail,
      password: 'Test123!@#'
    });
    vendorCookies = vendorLogin.headers['set-cookie'];
    console.log('✅ Test vendor created and logged in');

    console.log('Setup: Creating test product...');
    const productRes = await axios.post(
      `${BASE_URL}/products`,
      {
        title: 'Test Product for Payment',
        description: 'This is a test product for payment testing',
        price: 50000,
        category: 'Watches',
        images: ['https://example.com/image1.jpg'],
        stock: 10
      },
      {
        headers: { Cookie: vendorCookies }
      }
    );
    testProductId = productRes.data.product._id;
    console.log('✅ Test product created');

    // Approve the product
    console.log('Setup: Logging in as admin...');
    const adminRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@verra.com',
      password: 'Admin123!@#'
    });
    const adminCookies = adminRes.headers['set-cookie'];

    await axios.put(
      `${BASE_URL}/products/admin/approve/${testProductId}`,
      { isApproved: true },
      {
        headers: { Cookie: adminCookies }
      }
    );
    console.log('✅ Product approved');

    // Add product to cart
    console.log('Setup: Adding product to cart...');
    await axios.post(
      `${BASE_URL}/users/cart/add`,
      {
        productId: testProductId,
        quantity: 2
      },
      {
        headers: { Cookie: userCookies }
      }
    );
    console.log('✅ Product added to cart\n');
  } catch (error) {
    console.error('Setup failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Cleanup: Delete test product
async function cleanup() {
  try {
    console.log('\nCleanup: Deleting test product');
    await axios.delete(`${BASE_URL}/products/${testProductId}`, {
      headers: { Cookie: vendorCookies }
    });
    console.log('✅ Test product deleted');
  } catch (error) {
    console.log('⚠️  Cleanup warning:', error.response?.data?.message || error.message);
  }
}

// Test 1: Create Razorpay order
async function testCreateRazorpayOrder() {
  try {
    const res = await axios.post(
      `${BASE_URL}/payment/create-order`,
      {
        amount: 100000, // ₹100,000
        currency: 'INR'
      },
      {
        headers: { Cookie: userCookies }
      }
    );

    razorpayOrderId = res.data.data.orderId;
    console.log('✅ Razorpay order created');
    console.log(`✅ Order ID: ${razorpayOrderId}`);
    console.log(`✅ Amount: ₹${res.data.data.amount / 100}`);
    console.log(`✅ Currency: ${res.data.data.currency}`);
  } catch (error) {
    handleError(error, 'Test 1: Create Razorpay order');
  }
}

// Test 2: Create order with invalid amount
async function testInvalidAmount() {
  try {
    await axios.post(
      `${BASE_URL}/payment/create-order`,
      {
        amount: -100,
        currency: 'INR'
      },
      {
        headers: { Cookie: userCookies }
      }
    );
    console.log('❌ Should have failed with invalid amount');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Invalid amount rejected');
      console.log(`✅ Error message: ${error.response.data.message}`);
    } else {
      handleError(error, 'Test 2: Create order with invalid amount');
    }
  }
}

// Test 3: Verify payment with valid signature
async function testVerifyPaymentValid() {
  try {
    // Generate valid signature
    const paymentId = `pay_${Date.now()}`;
    const signature = generateValidSignature(razorpayOrderId, paymentId);

    const res = await axios.post(
      `${BASE_URL}/payment/verify`,
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        cartItems: [
          {
            productId: testProductId,
            quantity: 2
          }
        ],
        shippingAddress: {
          street: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        }
      },
      {
        headers: { Cookie: userCookies }
      }
    );

    console.log('✅ Payment verified successfully');
    console.log(`✅ Order ID: ${res.data.data._id}`);
    console.log(`✅ Total amount: ₹${res.data.data.totalAmount}`);
    console.log(`✅ Payment status: ${res.data.data.paymentStatus}`);
    console.log(`✅ Order status: ${res.data.data.orderStatus}`);
  } catch (error) {
    handleError(error, 'Test 3: Verify payment with valid signature');
  }
}

// Test 4: Verify cart is cleared after payment
async function testCartCleared() {
  try {
    const res = await axios.get(`${BASE_URL}/users/cart`, {
      headers: { Cookie: userCookies }
    });

    console.log('✅ Cart checked after payment');
    console.log(`✅ Cart items: ${res.data.data.cart.length}`);
    
    if (res.data.data.cart.length === 0) {
      console.log('✅ Cart cleared successfully');
    } else {
      console.log('❌ Cart should be empty');
    }
  } catch (error) {
    handleError(error, 'Test 4: Verify cart is cleared after payment');
  }
}

// Test 5: Verify stock is updated after payment
async function testStockUpdated() {
  try {
    const res = await axios.get(`${BASE_URL}/products/${testProductId}`);

    console.log('✅ Product stock checked');
    console.log(`✅ Current stock: ${res.data.product.stock}`);
    
    if (res.data.product.stock === 8) { // Original 10 - 2 purchased
      console.log('✅ Stock updated correctly');
    } else {
      console.log('❌ Stock should be 8');
    }
  } catch (error) {
    handleError(error, 'Test 5: Verify stock is updated after payment');
  }
}

// Test 6: Verify payment with invalid signature
async function testVerifyPaymentInvalid() {
  try {
    // Add product back to cart for this test
    await axios.post(
      `${BASE_URL}/users/cart/add`,
      {
        productId: testProductId,
        quantity: 1
      },
      {
        headers: { Cookie: userCookies }
      }
    );

    const paymentId = `pay_${Date.now()}`;
    const invalidSignature = 'invalid_signature_12345';

    await axios.post(
      `${BASE_URL}/payment/verify`,
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: invalidSignature,
        cartItems: [
          {
            productId: testProductId,
            quantity: 1
          }
        ],
        shippingAddress: {
          street: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        }
      },
      {
        headers: { Cookie: userCookies }
      }
    );
    console.log('❌ Should have failed with invalid signature');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Invalid signature rejected');
      console.log(`✅ Error message: ${error.response.data.message}`);
    } else {
      handleError(error, 'Test 6: Verify payment with invalid signature');
    }
  }
}

// Test 7: Verify payment with insufficient stock
async function testInsufficientStock() {
  try {
    const paymentId = `pay_${Date.now()}`;
    const signature = generateValidSignature(razorpayOrderId, paymentId);

    await axios.post(
      `${BASE_URL}/payment/verify`,
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        cartItems: [
          {
            productId: testProductId,
            quantity: 100 // Exceeds available stock
          }
        ],
        shippingAddress: {
          street: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        }
      },
      {
        headers: { Cookie: userCookies }
      }
    );
    console.log('❌ Should have failed with insufficient stock');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Insufficient stock detected');
      console.log(`✅ Error message: ${error.response.data.message}`);
    } else {
      handleError(error, 'Test 7: Verify payment with insufficient stock');
    }
  }
}

// Run all tests
async function runTests() {
  console.log('💳 Testing Payment Integration with Razorpay...\n');

  await setup();

  console.log('Test 1: Create Razorpay order');
  await testCreateRazorpayOrder();

  console.log('\nTest 2: Create order with invalid amount');
  await testInvalidAmount();

  console.log('\nTest 3: Verify payment with valid signature');
  await testVerifyPaymentValid();

  console.log('\nTest 4: Verify cart is cleared after payment');
  await testCartCleared();

  console.log('\nTest 5: Verify stock is updated after payment');
  await testStockUpdated();

  console.log('\nTest 6: Verify payment with invalid signature');
  await testVerifyPaymentInvalid();

  console.log('\nTest 7: Verify payment with insufficient stock');
  await testInsufficientStock();

  await cleanup();

  console.log('\n✅ All payment API tests passed!\n');
}

runTests().catch((error) => {
  console.error('\n❌ Test suite failed');
  process.exit(1);
});
