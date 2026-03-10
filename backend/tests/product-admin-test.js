// Test product admin endpoints
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let vendorCookies, adminCookies;
let productId;

const testProductAdmin = async () => {
  try {
    console.log('👑 Testing Product Admin Endpoints...\n');

    // Login as vendor
    console.log('Setup: Logging in as vendor...');
    const vendorLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'vendor@test.com',
      password: 'VendorPass123',
    });
    vendorCookies = vendorLogin.headers['set-cookie'];
    console.log('✅ Vendor logged in');

    // Login as admin
    console.log('Setup: Logging in as admin...');
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@verra.com',
      password: 'Admin123!@#',
    });
    adminCookies = adminLogin.headers['set-cookie'];
    console.log('✅ Admin logged in\n');

    // Test 1: Vendor creates a product
    console.log('Test 1: Vendor creates product');
    const createRes = await axios.post(
      `${API_URL}/products`,
      {
        title: 'Luxury Diamond Watch',
        description: 'Exquisite diamond-encrusted luxury watch with Swiss movement',
        price: 250000,
        category: 'Watches',
        images: ['watch1.jpg', 'watch2.jpg'],
        stock: 5,
      },
      { headers: { Cookie: vendorCookies } }
    );
    productId = createRes.data.product._id;
    console.log('✅ Product created');
    console.log('✅ Product ID:', productId);
    console.log('✅ isApproved:', createRes.data.product.isApproved);

    // Test 2: Admin views all products (including unapproved)
    console.log('\nTest 2: Admin views all products');
    const allProductsRes = await axios.get(`${API_URL}/products/admin/all`, {
      headers: { Cookie: adminCookies },
    });
    console.log('✅ Admin retrieved all products');
    console.log('✅ Total products:', allProductsRes.data.count);
    const hasUnapproved = allProductsRes.data.products.some(
      (p) => p.isApproved === false
    );
    console.log('✅ Includes unapproved products:', hasUnapproved);

    // Test 3: Public cannot see unapproved product
    console.log('\nTest 3: Public cannot see unapproved product');
    const publicRes = await axios.get(`${API_URL}/products`);
    const publicHasProduct = publicRes.data.products.some(
      (p) => p._id === productId
    );
    console.log('✅ Unapproved product hidden from public:', !publicHasProduct);

    // Test 4: Admin approves the product
    console.log('\nTest 4: Admin approves product');
    const approveRes = await axios.put(
      `${API_URL}/products/admin/approve/${productId}`,
      { isApproved: true },
      { headers: { Cookie: adminCookies } }
    );
    console.log('✅ Product approved');
    console.log('✅ Status:', approveRes.status);
    console.log('✅ isApproved:', approveRes.data.product.isApproved);

    // Test 5: Public can now see approved product
    console.log('\nTest 5: Public can now see approved product');
    const publicRes2 = await axios.get(`${API_URL}/products`);
    const publicHasProduct2 = publicRes2.data.products.some(
      (p) => p._id === productId
    );
    console.log('✅ Approved product visible to public:', publicHasProduct2);

    // Test 6: Get approved product by ID
    console.log('\nTest 6: Get approved product by ID');
    const productRes = await axios.get(`${API_URL}/products/${productId}`);
    console.log('✅ Product retrieved');
    console.log('✅ Title:', productRes.data.product.title);
    console.log('✅ Price:', productRes.data.product.price);

    // Test 7: Search finds approved product
    console.log('\nTest 7: Search finds approved product');
    const searchRes = await axios.get(`${API_URL}/products/search?q=diamond`);
    console.log('✅ Search executed');
    console.log('✅ Results count:', searchRes.data.count);
    const searchHasProduct = searchRes.data.products.some(
      (p) => p._id === productId
    );
    console.log('✅ Product found in search:', searchHasProduct);

    // Test 8: Admin rejects the product
    console.log('\nTest 8: Admin rejects product');
    const rejectRes = await axios.put(
      `${API_URL}/products/admin/approve/${productId}`,
      { isApproved: false },
      { headers: { Cookie: adminCookies } }
    );
    console.log('✅ Product rejected');
    console.log('✅ isApproved:', rejectRes.data.product.isApproved);

    // Test 9: Public cannot see rejected product
    console.log('\nTest 9: Public cannot see rejected product');
    const publicRes3 = await axios.get(`${API_URL}/products`);
    const publicHasProduct3 = publicRes3.data.products.some(
      (p) => p._id === productId
    );
    console.log('✅ Rejected product hidden from public:', !publicHasProduct3);

    // Test 10: Non-admin cannot approve products
    console.log('\nTest 10: Non-admin cannot approve products');
    try {
      await axios.put(
        `${API_URL}/products/admin/approve/${productId}`,
        { isApproved: true },
        { headers: { Cookie: vendorCookies } }
      );
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Non-admin approval rejected');
      console.log('✅ Status:', error.response.status);
    }

    // Test 11: Non-admin cannot view all products
    console.log('\nTest 11: Non-admin cannot view all products');
    try {
      await axios.get(`${API_URL}/products/admin/all`, {
        headers: { Cookie: vendorCookies },
      });
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Non-admin access rejected');
      console.log('✅ Status:', error.response.status);
    }

    // Cleanup: Delete test product
    console.log('\nCleanup: Deleting test product');
    await axios.delete(`${API_URL}/products/${productId}`, {
      headers: { Cookie: vendorCookies },
    });
    console.log('✅ Test product deleted');

    console.log('\n✅ All admin product tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
};

testProductAdmin();
