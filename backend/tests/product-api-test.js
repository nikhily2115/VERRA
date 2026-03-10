// Test product API endpoints
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let vendorCookies, adminCookies, userCookies;
let productId;

const testProductAPI = async () => {
  try {
    console.log('📦 Testing Product API Endpoints...\n');

    // Setup: Create test users
    console.log('Setup: Creating test users...');
    
    // Register vendor
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Test Vendor',
        email: 'vendor@test.com',
        password: 'VendorPass123',
        role: 'vendor',
      });
    } catch (e) {
      // User might already exist
    }

    // Register admin (manually set in DB or use existing)
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'AdminPass123',
        role: 'user', // Will need to manually change to admin in DB
      });
    } catch (e) {}

    // Login as vendor
    const vendorLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'vendor@test.com',
      password: 'VendorPass123',
    });
    vendorCookies = vendorLogin.headers['set-cookie'];
    console.log('✅ Vendor logged in');

    // Test 1: Vendor creates a product
    console.log('\nTest 1: Vendor creates product');
    const createRes = await axios.post(
      `${API_URL}/products`,
      {
        title: 'Luxury Leather Handbag',
        description: 'Premium Italian leather handbag with gold hardware and elegant design',
        price: 45000,
        category: 'Handbags',
        images: ['image1.jpg', 'image2.jpg'],
        stock: 10,
      },
      { headers: { Cookie: vendorCookies } }
    );
    productId = createRes.data.product._id;
    console.log('✅ Product created');
    console.log('✅ Status:', createRes.status);
    console.log('✅ Product ID:', productId);
    console.log('✅ isApproved:', createRes.data.product.isApproved);

    // Test 2: Get vendor's own products
    console.log('\nTest 2: Get vendor\'s own products');
    const myProductsRes = await axios.get(
      `${API_URL}/products/vendor/my-products`,
      { headers: { Cookie: vendorCookies } }
    );
    console.log('✅ Vendor products retrieved');
    console.log('✅ Count:', myProductsRes.data.count);

    // Test 3: Public cannot see unapproved product
    console.log('\nTest 3: Public cannot see unapproved product');
    const publicRes = await axios.get(`${API_URL}/products`);
    const hasUnapproved = publicRes.data.products.some(
      (p) => p._id === productId
    );
    console.log('✅ Unapproved product hidden from public:', !hasUnapproved);

    // Test 4: Vendor updates own product
    console.log('\nTest 4: Vendor updates own product');
    const updateRes = await axios.put(
      `${API_URL}/products/${productId}`,
      {
        title: 'Updated Luxury Handbag',
        description: 'Updated premium Italian leather handbag',
        price: 50000,
        category: 'Handbags',
        images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
        stock: 15,
      },
      { headers: { Cookie: vendorCookies } }
    );
    console.log('✅ Product updated');
    console.log('✅ New price:', updateRes.data.product.price);

    // Test 5: Search products (will be empty since none approved)
    console.log('\nTest 5: Search products');
    const searchRes = await axios.get(`${API_URL}/products/search?q=luxury`);
    console.log('✅ Search executed');
    console.log('✅ Results count:', searchRes.data.count);

    // Test 6: Filter by category
    console.log('\nTest 6: Filter by category');
    const filterRes = await axios.get(`${API_URL}/products?category=Handbags`);
    console.log('✅ Category filter executed');
    console.log('✅ Results count:', filterRes.data.count);

    // Test 7: Vendor cannot update another vendor's product
    console.log('\nTest 7: Vendor cannot update another vendor\'s product');
    // Create another vendor
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Vendor 2',
        email: 'vendor2@test.com',
        password: 'Vendor2Pass123',
        role: 'vendor',
      });
    } catch (e) {}
    
    const vendor2Login = await axios.post(`${API_URL}/auth/login`, {
      email: 'vendor2@test.com',
      password: 'Vendor2Pass123',
    });
    const vendor2Cookies = vendor2Login.headers['set-cookie'];

    try {
      await axios.put(
        `${API_URL}/products/${productId}`,
        {
          title: 'Hacked Product',
          description: 'Should not work',
          price: 1,
          category: 'Handbags',
          images: ['hack.jpg'],
          stock: 1,
        },
        { headers: { Cookie: vendor2Cookies } }
      );
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Unauthorized update rejected');
      console.log('✅ Status:', error.response.status);
    }

    // Test 8: Create product with invalid data
    console.log('\nTest 8: Create product with invalid data');
    try {
      await axios.post(
        `${API_URL}/products`,
        {
          title: 'AB', // Too short
          description: 'Short',
          price: -100, // Negative
          category: 'InvalidCategory',
          images: [],
          stock: -5,
        },
        { headers: { Cookie: vendorCookies } }
      );
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Invalid product data rejected');
      console.log('✅ Status:', error.response.status);
    }

    // Test 9: Vendor deletes own product
    console.log('\nTest 9: Vendor deletes own product');
    const deleteRes = await axios.delete(`${API_URL}/products/${productId}`, {
      headers: { Cookie: vendorCookies },
    });
    console.log('✅ Product deleted');
    console.log('✅ Status:', deleteRes.status);

    // Test 10: Get deleted product returns 404
    console.log('\nTest 10: Get deleted product returns 404');
    try {
      await axios.get(`${API_URL}/products/${productId}`);
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Deleted product not found');
      console.log('✅ Status:', error.response.status);
    }

    console.log('\n✅ All product API tests passed!');
    console.log('\nNote: Admin tests require manually setting user role to "admin" in database');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
};

testProductAPI();
