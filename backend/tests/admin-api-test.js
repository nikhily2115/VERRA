const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let adminCookies = '';
let userCookies = '';
let vendorCookies = '';
let testUserId = '';
let testVendorId = '';
let testProductId = '';

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

// Setup
async function setup() {
  try {
    const timestamp = Date.now();
    const userEmail = `testuser${timestamp}@test.com`;
    const vendorEmail = `testvendor${timestamp}@test.com`;
    
    console.log('Setup: Creating test users...');
    
    // Create user
    const userRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: userEmail,
      password: 'Test123!@#',
      role: 'user'
    });
    testUserId = userRes.data.user._id;
    
    const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: userEmail,
      password: 'Test123!@#'
    });
    userCookies = userLogin.headers['set-cookie'];
    console.log('✅ Test user created');

    // Store user email for later tests
    global.testUserEmail = userEmail;

    // Create vendor
    const vendorRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Vendor',
      email: vendorEmail,
      password: 'Test123!@#',
      role: 'vendor'
    });
    testVendorId = vendorRes.data.user._id;
    
    const vendorLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: vendorEmail,
      password: 'Test123!@#'
    });
    vendorCookies = vendorLogin.headers['set-cookie'];
    console.log('✅ Test vendor created');

    // Login as admin
    const adminRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@verra.com',
      password: 'Admin123!@#'
    });
    adminCookies = adminRes.headers['set-cookie'];
    console.log('✅ Admin logged in');

    // Create and approve a product
    const productRes = await axios.post(
      `${BASE_URL}/products`,
      {
        title: 'Test Product',
        description: 'Test product for analytics',
        price: 50000,
        category: 'Watches',
        images: ['https://example.com/image1.jpg'],
        stock: 10
      },
      { headers: { Cookie: vendorCookies } }
    );
    testProductId = productRes.data.product._id;

    await axios.put(
      `${BASE_URL}/products/admin/approve/${testProductId}`,
      { isApproved: true },
      { headers: { Cookie: adminCookies } }
    );
    console.log('✅ Test product created and approved');

    // Create an order
    const orderRes = await axios.post(
      `${BASE_URL}/payment/create-order`,
      { amount: 50000, currency: 'INR' },
      { headers: { Cookie: userCookies } }
    );
    const razorpayOrderId = orderRes.data.data.orderId;
    const paymentId = `pay_${Date.now()}`;
    const signature = generateValidSignature(razorpayOrderId, paymentId);

    await axios.post(
      `${BASE_URL}/payment/verify`,
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        cartItems: [{ productId: testProductId, quantity: 1 }],
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
    console.log('✅ Test order created\n');
  } catch (error) {
    console.error('Setup failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Cleanup
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

// Test 1: Get dashboard statistics
async function testGetDashboardStats() {
  try {
    const res = await axios.get(`${BASE_URL}/admin/dashboard`, {
      headers: { Cookie: adminCookies }
    });

    console.log('✅ Dashboard stats retrieved');
    console.log(`✅ Total users: ${res.data.data.users.total}`);
    console.log(`✅ Total vendors: ${res.data.data.users.vendors}`);
    console.log(`✅ Total orders: ${res.data.data.orders.total}`);
    console.log(`✅ Total products: ${res.data.data.products.total}`);
    console.log(`✅ Total revenue: ₹${res.data.data.revenue.total}`);
  } catch (error) {
    handleError(error, 'Test 1: Get dashboard statistics');
  }
}

// Test 2: Get all users
async function testGetAllUsers() {
  try {
    const res = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Cookie: adminCookies }
    });

    console.log('✅ All users retrieved');
    console.log(`✅ User count: ${res.data.count}`);
  } catch (error) {
    handleError(error, 'Test 2: Get all users');
  }
}

// Test 3: Get all vendors
async function testGetAllVendors() {
  try {
    const res = await axios.get(`${BASE_URL}/admin/vendors`, {
      headers: { Cookie: adminCookies }
    });

    console.log('✅ All vendors retrieved');
    console.log(`✅ Vendor count: ${res.data.count}`);
  } catch (error) {
    handleError(error, 'Test 3: Get all vendors');
  }
}

// Test 4: Block user
async function testBlockUser() {
  try {
    const res = await axios.put(
      `${BASE_URL}/admin/users/block/${testUserId}`,
      {},
      { headers: { Cookie: adminCookies } }
    );

    console.log('✅ User blocked');
    console.log(`✅ Is blocked: ${res.data.data.isBlocked}`);
  } catch (error) {
    handleError(error, 'Test 4: Block user');
  }
}

// Test 5: Blocked user cannot login
async function testBlockedUserCannotLogin() {
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: global.testUserEmail,
      password: 'Test123!@#'
    });
    console.log('❌ Blocked user should not be able to login');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Blocked user login prevented');
      console.log(`✅ Error message: ${error.response.data.message}`);
    } else {
      handleError(error, 'Test 5: Blocked user cannot login');
    }
  }
}

// Test 6: Unblock user
async function testUnblockUser() {
  try {
    const res = await axios.put(
      `${BASE_URL}/admin/users/block/${testUserId}`,
      {},
      { headers: { Cookie: adminCookies } }
    );

    console.log('✅ User unblocked');
    console.log(`✅ Is blocked: ${res.data.data.isBlocked}`);
  } catch (error) {
    handleError(error, 'Test 6: Unblock user');
  }
}

// Test 7: Get total revenue
async function testGetTotalRevenue() {
  try {
    const res = await axios.get(`${BASE_URL}/admin/revenue`, {
      headers: { Cookie: adminCookies }
    });

    console.log('✅ Revenue data retrieved');
    console.log(`✅ Total revenue: ₹${res.data.data.totalRevenue}`);
    console.log(`✅ Total orders: ${res.data.data.totalOrders}`);
    console.log(`✅ Monthly data points: ${res.data.data.monthlyRevenue.length}`);
  } catch (error) {
    handleError(error, 'Test 7: Get total revenue');
  }
}

// Test 8: Get vendor statistics
async function testGetVendorStats() {
  try {
    const res = await axios.get(`${BASE_URL}/admin/vendor-stats/${testVendorId}`, {
      headers: { Cookie: adminCookies }
    });

    console.log('✅ Vendor stats retrieved');
    console.log(`✅ Vendor name: ${res.data.data.vendor.name}`);
    console.log(`✅ Total products: ${res.data.data.products.total}`);
    console.log(`✅ Sales count: ${res.data.data.sales.count}`);
    console.log(`✅ Total earnings: ₹${res.data.data.sales.earnings}`);
  } catch (error) {
    handleError(error, 'Test 8: Get vendor statistics');
  }
}

// Test 9: Non-admin cannot access dashboard
async function testNonAdminCannotAccessDashboard() {
  try {
    await axios.get(`${BASE_URL}/admin/dashboard`, {
      headers: { Cookie: userCookies }
    });
    console.log('❌ Should have been rejected');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Non-admin access rejected');
      console.log(`✅ Status: ${error.response.status}`);
    } else {
      handleError(error, 'Test 9: Non-admin cannot access dashboard');
    }
  }
}

// Test 10: Cannot block admin users
async function testCannotBlockAdmin() {
  try {
    // Get admin user ID
    const adminUser = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Cookie: adminCookies }
    });
    const adminId = adminUser.data.user._id;

    await axios.put(
      `${BASE_URL}/admin/users/block/${adminId}`,
      {},
      { headers: { Cookie: adminCookies } }
    );
    console.log('❌ Should not be able to block admin');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Admin blocking prevented');
      console.log(`✅ Error message: ${error.response.data.message}`);
    } else {
      handleError(error, 'Test 10: Cannot block admin users');
    }
  }
}

// Run all tests
async function runTests() {
  console.log('👑 Testing Admin Dashboard & Analytics...\n');

  await setup();

  console.log('Test 1: Get dashboard statistics');
  await testGetDashboardStats();

  console.log('\nTest 2: Get all users');
  await testGetAllUsers();

  console.log('\nTest 3: Get all vendors');
  await testGetAllVendors();

  console.log('\nTest 4: Block user');
  await testBlockUser();

  console.log('\nTest 5: Blocked user cannot login');
  await testBlockedUserCannotLogin();

  console.log('\nTest 6: Unblock user');
  await testUnblockUser();

  console.log('\nTest 7: Get total revenue');
  await testGetTotalRevenue();

  console.log('\nTest 8: Get vendor statistics');
  await testGetVendorStats();

  console.log('\nTest 9: Non-admin cannot access dashboard');
  await testNonAdminCannotAccessDashboard();

  console.log('\nTest 10: Cannot block admin users');
  await testCannotBlockAdmin();

  await cleanup();

  console.log('\n✅ All admin dashboard tests passed!\n');
}

runTests().catch((error) => {
  console.error('\n❌ Test suite failed');
  process.exit(1);
});
