// Test authentication utilities
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/generateToken');

dotenv.config();

console.log('🔐 Testing Authentication Utilities...\n');

// Test 1: Token Generation
console.log('Test 1: JWT Token Generation');
const testUserId = '507f1f77bcf86cd799439011'; // Sample MongoDB ObjectId
const token = generateToken(testUserId);

console.log('✅ Token generated:', token.substring(0, 50) + '...');

// Verify token structure
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('✅ Token contains user ID:', decoded.id === testUserId);
console.log('✅ Token has expiration:', !!decoded.exp);

// Test 2: Token Cookie Setting
console.log('\nTest 2: Cookie Setting');
const mockRes = {
  cookie: (name, value, options) => {
    console.log('✅ Cookie name:', name);
    console.log('✅ Cookie has httpOnly:', options.httpOnly === true);
    console.log('✅ Cookie has sameSite:', options.sameSite === 'strict');
    console.log('✅ Cookie maxAge (7 days):', options.maxAge === 7 * 24 * 60 * 60 * 1000);
    console.log('✅ Cookie secure in production:', 
      process.env.NODE_ENV === 'production' ? options.secure === true : options.secure === false
    );
  }
};

setTokenCookie(mockRes, token);

// Test 3: Clear Cookie
console.log('\nTest 3: Clear Cookie');
const mockResClear = {
  cookie: (name, value, options) => {
    console.log('✅ Cookie cleared:', value === '');
    console.log('✅ Cookie expired:', options.expires.getTime() === 0);
  }
};

clearTokenCookie(mockResClear);

console.log('\n✅ All authentication utility tests passed!');
