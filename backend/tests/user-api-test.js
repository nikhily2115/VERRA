const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let userCookies = '';
let vendorCookies = '';
let testProductId = '';

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
    
    // Login to get cookies
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
    
    // Login to get cookies
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
        title: 'Test Product for Cart',
        description: 'This is a test product for cart and wishlist testing',
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
    console.log(`✅ Product ID: ${testProductId}`);

    // Approve the product (using admin user)
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
    console.log('✅ Product approved\n');
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

// Test 1: Get user profile
async function testGetProfile() {
  try {
    const res = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Cookie: userCookies }
    });

    console.log('✅ Profile retrieved');
    console.log(`✅ User name: ${res.data.data.name}`);
    console.log(`✅ User role: ${res.data.data.role}`);
  } catch (error) {
    handleError(error, 'Test 1: Get user profile');
  }
}

// Test 2: Update user profile
async function testUpdateProfile() {
  try {
    const res = await axios.put(
      `${BASE_URL}/users/profile`,
      {
        name: 'Updated Test User'
      },
      {
        headers: { Cookie: userCookies }
      }
    );

    console.log('✅ Profile updated');
    console.log(`✅ New name: ${res.data.data.name}`);
  } catch (error) {
    handleError(error, 'Test 2: Update user profile');
  }
}

// Test 3: Prevent role modification
async function testPreventRoleModification() {
  try {
    await axios.put(
      `${BASE_URL}/users/profile`,
      {
        role: 'admin'
      },
      {
        headers: { Cookie: userCookies }
      }
    );
    console.log('❌ Role modification should have been prevented');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Role modification prevented');
      console.log(`✅ Status: ${error.response.status}`);
    } else {
      handleError(error, 'Test 3: Prevent role modification');
    }
  }
}

// Test 4: Add product to cart
async function testAddToCart() {
  try {
    const res = await axios.post(
      `${BASE_URL}/users/cart/add`,
      {
        productId: testProductId,
        quantity: 2
      },
      {
        headers: { Cookie: userCookies }
      }
    );

    console.log('✅ Product added to cart');
    console.log(`✅ Cart items: ${res.data.data.length}`);
    console.log(`✅ Quantity: ${res.data.data[0].quantity}`);
  } catch (error) {
    handleError(error, 'Test 4: Add product to cart');
  }
}

// Test 5: Update cart quantity
async function testUpdateCart() {
  try {
    const res = await axios.put(
      `${BASE_URL}/users/cart/update`,
      {
        productId: testProductId,
        quantity: 3
      },
      {
        headers: { Cookie: userCookies }
      }
    );

    console.log('✅ Cart quantity updated');
    console.log(`✅ New quantity: ${res.data.data[0].quantity}`);
  } catch (error) {
    handleError(error, 'Test 5: Update cart quantity');
  }
}

// Test 6: Get cart with total
async function testGetCart() {
  try {
    const res = await axios.get(`${BASE_URL}/users/cart`, {
      headers: { Cookie: userCookies }
    });

    console.log('✅ Cart retrieved');
    console.log(`✅ Cart items: ${res.data.data.cart.length}`);
    console.log(`✅ Cart total: ₹${res.data.data.total}`);
  } catch (error) {
    handleError(error, 'Test 6: Get cart with total');
  }
}

// Test 7: Stock validation on cart add
async function testCartStockValidation() {
  try {
    await axios.post(
      `${BASE_URL}/users/cart/add`,
      {
        productId: testProductId,
        quantity: 100 // Exceeds stock
      },
      {
        headers: { Cookie: userCookies }
      }
    );
    console.log('❌ Stock validation should have failed');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Stock validation working');
      console.log(`✅ Error message: ${error.response.data.message}`);
    } else {
      handleError(error, 'Test 7: Stock validation on cart add');
    }
  }
}

// Test 8: Add product to wishlist
async function testAddToWishlist() {
  try {
    const res = await axios.post(
      `${BASE_URL}/users/wishlist/add`,
      {
        productId: testProductId
      },
      {
        headers: { Cookie: userCookies }
      }
    );

    console.log('✅ Product added to wishlist');
    console.log(`✅ Wishlist items: ${res.data.data.length}`);
  } catch (error) {
    handleError(error, 'Test 8: Add product to wishlist');
  }
}

// Test 9: Prevent duplicate in wishlist
async function testWishlistDuplicatePrevention() {
  try {
    await axios.post(
      `${BASE_URL}/users/wishlist/add`,
      {
        productId: testProductId
      },
      {
        headers: { Cookie: userCookies }
      }
    );
    console.log('❌ Duplicate prevention should have worked');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Duplicate prevention working');
      console.log(`✅ Error message: ${error.response.data.message}`);
    } else {
      handleError(error, 'Test 9: Prevent duplicate in wishlist');
    }
  }
}

// Test 10: Get wishlist
async function testGetWishlist() {
  try {
    const res = await axios.get(`${BASE_URL}/users/wishlist`, {
      headers: { Cookie: userCookies }
    });

    console.log('✅ Wishlist retrieved');
    console.log(`✅ Wishlist items: ${res.data.data.length}`);
  } catch (error) {
    handleError(error, 'Test 10: Get wishlist');
  }
}

// Test 11: Remove from wishlist
async function testRemoveFromWishlist() {
  try {
    const res = await axios.delete(
      `${BASE_URL}/users/wishlist/remove/${testProductId}`,
      {
        headers: { Cookie: userCookies }
      }
    );

    console.log('✅ Product removed from wishlist');
    console.log(`✅ Remaining items: ${res.data.data.length}`);
  } catch (error) {
    handleError(error, 'Test 11: Remove from wishlist');
  }
}

// Test 12: Remove from cart
async function testRemoveFromCart() {
  try {
    const res = await axios.delete(
      `${BASE_URL}/users/cart/remove/${testProductId}`,
      {
        headers: { Cookie: userCookies }
      }
    );

    console.log('✅ Product removed from cart');
    console.log(`✅ Remaining items: ${res.data.data.length}`);
  } catch (error) {
    handleError(error, 'Test 12: Remove from cart');
  }
}

// Run all tests
async function runTests() {
  console.log('👤 Testing User Profile, Cart & Wishlist Endpoints...\n');

  await setup();

  console.log('Test 1: Get user profile');
  await testGetProfile();

  console.log('\nTest 2: Update user profile');
  await testUpdateProfile();

  console.log('\nTest 3: Prevent role modification');
  await testPreventRoleModification();

  console.log('\nTest 4: Add product to cart');
  await testAddToCart();

  console.log('\nTest 5: Update cart quantity');
  await testUpdateCart();

  console.log('\nTest 6: Get cart with total');
  await testGetCart();

  console.log('\nTest 7: Stock validation on cart add');
  await testCartStockValidation();

  console.log('\nTest 8: Add product to wishlist');
  await testAddToWishlist();

  console.log('\nTest 9: Prevent duplicate in wishlist');
  await testWishlistDuplicatePrevention();

  console.log('\nTest 10: Get wishlist');
  await testGetWishlist();

  console.log('\nTest 11: Remove from wishlist');
  await testRemoveFromWishlist();

  console.log('\nTest 12: Remove from cart');
  await testRemoveFromCart();

  await cleanup();

  console.log('\n✅ All user API tests passed!\n');
}

runTests().catch((error) => {
  console.error('\n❌ Test suite failed');
  process.exit(1);
});
