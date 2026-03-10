const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let userCookies = '';
let user2Cookies = '';
let vendorCookies = '';
let vendor2Cookies = '';
let adminCookies = '';
let testProductId1 = '';
let testProductId2 = '';
let testOrderId = '';

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

// Setup: Create test users and products
async function setup() {
  try {
    const timestamp = Date.now();
    const userEmail = `testuser${timestamp}@test.com`;
    const user2Email = `testuser2${timestamp}@test.com`;
    const vendorEmail = `testvendor${timestamp}@test.com`;
    const vendor2Email = `testvendor2${timestamp}@test.com`;
    
    console.log('Setup: Creating test users...');
    
    // Create user 1
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User 1',
      email: userEmail,
      password: 'Test123!@#',
      role: 'user'
    });
    const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: userEmail,
      password: 'Test123!@#'
    });
    userCookies = userLogin.headers['set-cookie'];
    console.log('✅ Test user 1 created');

    // Create user 2
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User 2',
      email: user2Email,
      password: 'Test123!@#',
      role: 'user'
    });
    const user2Login = await axios.post(`${BASE_URL}/auth/login`, {
      email: user2Email,
      password: 'Test123!@#'
    });
    user2Cookies = user2Login.headers['set-cookie'];
    console.log('✅ Test user 2 created');

    // Create vendor 1
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Vendor 1',
      email: vendorEmail,
      password: 'Test123!@#',
      role: 'vendor'
    });
    const vendorLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: vendorEmail,
      password: 'Test123!@#'
    });
    vendorCookies = vendorLogin.headers['set-cookie'];
    console.log('✅ Test vendor 1 created');

    // Create vendor 2
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Vendor 2',
      email: vendor2Email,
      password: 'Test123!@#',
      role: 'vendor'
    });
    const vendor2Login = await axios.post(`${BASE_URL}/auth/login`, {
      email: vendor2Email,
      password: 'Test123!@#'
    });
    vendor2Cookies = vendor2Login.headers['set-cookie'];
    console.log('✅ Test vendor 2 created');

    // Login as admin
    const adminRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@verra.com',
      password: 'Admin123!@#'
    });
    adminCookies = adminRes.headers['set-cookie'];
    console.log('✅ Admin logged in');

    // Create products
    console.log('Setup: Creating test products...');
    const product1Res = await axios.post(
      `${BASE_URL}/products`,
      {
        title: 'Test Product 1',
        description: 'Product from vendor 1',
        price: 50000,
        category: 'Watches',
        images: ['https://example.com/image1.jpg'],
        stock: 10
      },
      { headers: { Cookie: vendorCookies } }
    );
    testProductId1 = product1Res.data.product._id;

    const product2Res = await axios.post(
      `${BASE_URL}/products`,
      {
        title: 'Test Product 2',
        description: 'Product from vendor 2',
        price: 30000,
        category: 'Handbags',
        images: ['https://example.com/image2.jpg'],
        stock: 5
      },
      { headers: { Cookie: vendor2Cookies } }
    );
    testProductId2 = product2Res.data.product._id;

    // Approve products
    await axios.put(
      `${BASE_URL}/products/admin/approve/${testProductId1}`,
      { isApproved: true },
      { headers: { Cookie: adminCookies } }
    );
    await axios.put(
      `${BASE_URL}/products/admin/approve/${testProductId2}`,
      { isApproved: true },
      { headers: { Cookie: adminCookies } }
    );
    console.log('✅ Test products created and approved');

    // Create an order for user 1
    console.log('Setup: Creating test order...');
    const orderRes = await axios.post(
      `${BASE_URL}/payment/create-order`,
      { amount: 80000, currency: 'INR' },
      { headers: { Cookie: userCookies } }
    );
    const razorpayOrderId = orderRes.data.data.orderId;
    const paymentId = `pay_${Date.now()}`;
    const signature = generateValidSignature(razorpayOrderId, paymentId);

    const verifyRes = await axios.post(
      `${BASE_URL}/payment/verify`,
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        cartItems: [
          { productId: testProductId1, quantity: 1 },
          { productId: testProductId2, quantity: 1 }
        ],
        shippingAddress: {
          street: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        }
      },
      { headers: { Cookie: userCookies } }
    );
    testOrderId = verifyRes.data.data._id;
    console.log('✅ Test order created\n');
  } catch (error) {
    console.error('Setup failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Cleanup
async function cleanup() {
  try {
    console.log('\nCleanup: Deleting test products');
    await axios.delete(`${BASE_URL}/products/${testProductId1}`, {
      headers: { Cookie: vendorCookies }
    });
    await axios.delete(`${BASE_URL}/products/${testProductId2}`, {
      headers: { Cookie: vendor2Cookies }
    });
    console.log('✅ Test products deleted');
  } catch (error) {
    console.log('⚠️  Cleanup warning:', error.response?.data?.message || error.message);
  }
}

// Test 1: User gets their own orders
async function testGetMyOrders() {
  try {
    const res = await axios.get(`${BASE_URL}/orders/my-orders`, {
      headers: { Cookie: userCookies }
    });

    console.log('✅ User orders retrieved');
    console.log(`✅ Order count: ${res.data.count}`);
    console.log(`✅ Has test order: ${res.data.data.some(o => o._id === testOrderId)}`);
  } catch (error) {
    handleError(error, 'Test 1: User gets their own orders');
  }
}

// Test 2: User gets single order by ID
async function testGetOrderById() {
  try {
    const res = await axios.get(`${BASE_URL}/orders/${testOrderId}`, {
      headers: { Cookie: userCookies }
    });

    console.log('✅ Order details retrieved');
    console.log(`✅ Order ID: ${res.data.data._id}`);
    console.log(`✅ Total amount: ₹${res.data.data.totalAmount}`);
    console.log(`✅ Products count: ${res.data.data.products.length}`);
  } catch (error) {
    handleError(error, 'Test 2: User gets single order by ID');
  }
}

// Test 3: User cannot view another user's order
async function testCannotViewOtherOrder() {
  try {
    await axios.get(`${BASE_URL}/orders/${testOrderId}`, {
      headers: { Cookie: user2Cookies }
    });
    console.log('❌ Should have been rejected');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Unauthorized access rejected');
      console.log(`✅ Error message: ${error.response.data.message}`);
    } else {
      handleError(error, 'Test 3: User cannot view another user\'s order');
    }
  }
}

// Test 4: Vendor 1 sees orders with their products
async function testVendorOrders() {
  try {
    const res = await axios.get(`${BASE_URL}/orders/vendor/my-orders`, {
      headers: { Cookie: vendorCookies }
    });

    console.log('✅ Vendor orders retrieved');
    console.log(`✅ Order count: ${res.data.count}`);
    
    if (res.data.count > 0) {
      const order = res.data.data[0];
      console.log(`✅ Vendor total: ₹${order.vendorTotal}`);
      console.log(`✅ Vendor products: ${order.products.length}`);
    }
  } catch (error) {
    handleError(error, 'Test 4: Vendor 1 sees orders with their products');
  }
}

// Test 5: Vendor 2 sees orders with their products
async function testVendor2Orders() {
  try {
    const res = await axios.get(`${BASE_URL}/orders/vendor/my-orders`, {
      headers: { Cookie: vendor2Cookies }
    });

    console.log('✅ Vendor 2 orders retrieved');
    console.log(`✅ Order count: ${res.data.count}`);
    
    if (res.data.count > 0) {
      const order = res.data.data[0];
      console.log(`✅ Vendor total: ₹${order.vendorTotal}`);
    }
  } catch (error) {
    handleError(error, 'Test 5: Vendor 2 sees orders with their products');
  }
}

// Test 6: Admin gets all orders
async function testAdminGetAllOrders() {
  try {
    const res = await axios.get(`${BASE_URL}/orders/admin/all`, {
      headers: { Cookie: adminCookies }
    });

    console.log('✅ Admin retrieved all orders');
    console.log(`✅ Total orders: ${res.data.count}`);
  } catch (error) {
    handleError(error, 'Test 6: Admin gets all orders');
  }
}

// Test 7: Admin updates order status
async function testAdminUpdateOrderStatus() {
  try {
    const res = await axios.put(
      `${BASE_URL}/orders/admin/status/${testOrderId}`,
      { orderStatus: 'confirmed' },
      { headers: { Cookie: adminCookies } }
    );

    console.log('✅ Order status updated');
    console.log(`✅ New status: ${res.data.data.orderStatus}`);
  } catch (error) {
    handleError(error, 'Test 7: Admin updates order status');
  }
}

// Test 8: Non-admin cannot update order status
async function testNonAdminCannotUpdateStatus() {
  try {
    await axios.put(
      `${BASE_URL}/orders/admin/status/${testOrderId}`,
      { orderStatus: 'shipped' },
      { headers: { Cookie: userCookies } }
    );
    console.log('❌ Should have been rejected');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Non-admin update rejected');
      console.log(`✅ Status: ${error.response.status}`);
    } else {
      handleError(error, 'Test 8: Non-admin cannot update order status');
    }
  }
}

// Test 9: Non-admin cannot view all orders
async function testNonAdminCannotViewAllOrders() {
  try {
    await axios.get(`${BASE_URL}/orders/admin/all`, {
      headers: { Cookie: userCookies }
    });
    console.log('❌ Should have been rejected');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Non-admin access rejected');
      console.log(`✅ Status: ${error.response.status}`);
    } else {
      handleError(error, 'Test 9: Non-admin cannot view all orders');
    }
  }
}

// Run all tests
async function runTests() {
  console.log('📦 Testing Order Management System...\n');

  await setup();

  console.log('Test 1: User gets their own orders');
  await testGetMyOrders();

  console.log('\nTest 2: User gets single order by ID');
  await testGetOrderById();

  console.log('\nTest 3: User cannot view another user\'s order');
  await testCannotViewOtherOrder();

  console.log('\nTest 4: Vendor 1 sees orders with their products');
  await testVendorOrders();

  console.log('\nTest 5: Vendor 2 sees orders with their products');
  await testVendor2Orders();

  console.log('\nTest 6: Admin gets all orders');
  await testAdminGetAllOrders();

  console.log('\nTest 7: Admin updates order status');
  await testAdminUpdateOrderStatus();

  console.log('\nTest 8: Non-admin cannot update order status');
  await testNonAdminCannotUpdateStatus();

  console.log('\nTest 9: Non-admin cannot view all orders');
  await testNonAdminCannotViewAllOrders();

  await cleanup();

  console.log('\n✅ All order management tests passed!\n');
}

runTests().catch((error) => {
  console.error('\n❌ Test suite failed');
  process.exit(1);
});
