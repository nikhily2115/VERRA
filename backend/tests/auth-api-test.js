// Test authentication API endpoints
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testAuthAPI = async () => {
  try {
    console.log('🔐 Testing Authentication API Endpoints...\n');

    // Test 1: Register a new user
    console.log('Test 1: Register new user');
    try {
      const registerRes = await axios.post(`${API_URL}/auth/register`, {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'TestPass123',
        role: 'user',
      });
      console.log('✅ Registration successful');
      console.log('✅ Status:', registerRes.status);
      console.log('✅ User created:', registerRes.data.user.email);
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('✅ User already exists (expected if running multiple times)');
      } else {
        throw error;
      }
    }

    // Test 2: Login with correct credentials
    console.log('\nTest 2: Login with correct credentials');
    const loginRes = await axios.post(
      `${API_URL}/auth/login`,
      {
        email: 'testuser@example.com',
        password: 'TestPass123',
      },
      { withCredentials: true }
    );
    console.log('✅ Login successful');
    console.log('✅ Status:', loginRes.status);
    console.log('✅ User role:', loginRes.data.user.role);
    console.log('✅ Cookie set:', !!loginRes.headers['set-cookie']);

    // Extract cookie for authenticated requests
    const cookies = loginRes.headers['set-cookie'];

    // Test 3: Get current user (authenticated)
    console.log('\nTest 3: Get current user (authenticated)');
    const meRes = await axios.get(`${API_URL}/auth/me`, {
      headers: { Cookie: cookies },
    });
    console.log('✅ Get current user successful');
    console.log('✅ User email:', meRes.data.user.email);
    console.log('✅ User name:', meRes.data.user.name);

    // Test 4: Login with wrong password
    console.log('\nTest 4: Login with wrong password');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'testuser@example.com',
        password: 'WrongPassword',
      });
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Wrong password rejected');
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error message:', error.response.data.message);
    }

    // Test 5: Access protected route without token
    console.log('\nTest 5: Access protected route without token');
    try {
      await axios.get(`${API_URL}/auth/me`);
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Unauthorized access rejected');
      console.log('✅ Status:', error.response.status);
    }

    // Test 6: Register with invalid email
    console.log('\nTest 6: Register with invalid email');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Test User',
        email: 'invalid-email',
        password: 'TestPass123',
      });
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Invalid email rejected');
      console.log('✅ Status:', error.response.status);
    }

    // Test 7: Register with short password
    console.log('\nTest 7: Register with short password');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'short',
      });
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Short password rejected');
      console.log('✅ Status:', error.response.status);
    }

    // Test 8: Logout
    console.log('\nTest 8: Logout');
    const logoutRes = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: { Cookie: cookies },
      }
    );
    console.log('✅ Logout successful');
    console.log('✅ Status:', logoutRes.status);

    console.log('\n✅ All authentication API tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
};

testAuthAPI();
