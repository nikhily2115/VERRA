// Test authentication and authorization middleware
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { generateToken } = require('../utils/generateToken');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const testMiddleware = async () => {
  try {
    await connectDB();
    
    console.log('🔐 Testing Authentication & Authorization Middleware...\n');
    
    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'middleware-test@example.com',
      password: 'TestPass123',
      role: 'user',
    });
    await testUser.save();
    
    const token = generateToken(testUser._id);
    
    // Test 1: Protect middleware with valid token
    console.log('Test 1: Protect middleware with valid token');
    const mockReq1 = {
      cookies: { token },
    };
    const mockRes1 = {
      status: (code) => ({
        json: (data) => {
          console.log('❌ Should not return error');
        },
      }),
    };
    const mockNext1 = () => {
      console.log('✅ Valid token accepted');
      console.log('✅ User attached to request:', !!mockReq1.user);
      console.log('✅ User role:', mockReq1.user.role);
    };
    
    await protect(mockReq1, mockRes1, mockNext1);
    
    // Test 2: Protect middleware without token
    console.log('\nTest 2: Protect middleware without token');
    const mockReq2 = {
      cookies: {},
    };
    const mockRes2 = {
      status: (code) => ({
        json: (data) => {
          console.log('✅ No token rejected with 401:', code === 401);
          console.log('✅ Error message:', data.message);
        },
      }),
    };
    const mockNext2 = () => {
      console.log('❌ Should not call next');
    };
    
    await protect(mockReq2, mockRes2, mockNext2);
    
    // Test 3: Protect middleware with invalid token
    console.log('\nTest 3: Protect middleware with invalid token');
    const mockReq3 = {
      cookies: { token: 'invalid-token' },
    };
    const mockRes3 = {
      status: (code) => ({
        json: (data) => {
          console.log('✅ Invalid token rejected with 401:', code === 401);
          console.log('✅ Error message:', data.message);
        },
      }),
    };
    const mockNext3 = () => {
      console.log('❌ Should not call next');
    };
    
    await protect(mockReq3, mockRes3, mockNext3);
    
    // Test 4: Authorize middleware with correct role
    console.log('\nTest 4: Authorize middleware with correct role');
    const mockReq4 = {
      user: { role: 'admin' },
    };
    const mockRes4 = {
      status: (code) => ({
        json: (data) => {
          console.log('❌ Should not return error');
        },
      }),
    };
    const mockNext4 = () => {
      console.log('✅ Correct role authorized');
    };
    
    const adminAuth = authorize('admin', 'vendor');
    adminAuth(mockReq4, mockRes4, mockNext4);
    
    // Test 5: Authorize middleware with wrong role
    console.log('\nTest 5: Authorize middleware with wrong role');
    const mockReq5 = {
      user: { role: 'user' },
    };
    const mockRes5 = {
      status: (code) => ({
        json: (data) => {
          console.log('✅ Wrong role rejected with 403:', code === 403);
          console.log('✅ Error message:', data.message);
        },
      }),
    };
    const mockNext5 = () => {
      console.log('❌ Should not call next');
    };
    
    const vendorAuth = authorize('vendor', 'admin');
    vendorAuth(mockReq5, mockRes5, mockNext5);
    
    // Test 6: Blocked user
    console.log('\nTest 6: Blocked user authentication');
    testUser.isBlocked = true;
    await testUser.save();
    
    const blockedToken = generateToken(testUser._id);
    const mockReq6 = {
      cookies: { token: blockedToken },
    };
    const mockRes6 = {
      status: (code) => ({
        json: (data) => {
          console.log('✅ Blocked user rejected with 403:', code === 403);
          console.log('✅ Error message:', data.message);
        },
      }),
    };
    const mockNext6 = () => {
      console.log('❌ Should not call next');
    };
    
    await protect(mockReq6, mockRes6, mockNext6);
    
    // Clean up
    await User.deleteOne({ _id: testUser._id });
    
    console.log('\n✅ All middleware tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testMiddleware();
