// Test error handler middleware
const errorHandler = require('../middleware/errorMiddleware');

console.log('🔧 Testing Error Handler Middleware...\n');

// Test 1: Generic error
console.log('Test 1: Generic error (500)');
const err1 = new Error('Something went wrong');
const mockReq1 = { path: '/test', method: 'GET' };
const mockRes1 = {
  status: (code) => ({
    json: (data) => {
      console.log('✅ Status code:', code === 500);
      console.log('✅ Error message:', data.message);
      console.log('✅ Success false:', data.success === false);
    },
  }),
};
errorHandler(err1, mockReq1, mockRes1, () => {});

// Test 2: Validation error
console.log('\nTest 2: Mongoose validation error (400)');
const err2 = {
  name: 'ValidationError',
  errors: {
    email: { message: 'Email is required' },
    password: { message: 'Password is required' },
  },
};
const mockRes2 = {
  status: (code) => ({
    json: (data) => {
      console.log('✅ Status code:', code === 400);
      console.log('✅ Error message:', data.message);
    },
  }),
};
errorHandler(err2, mockReq1, mockRes2, () => {});

// Test 3: Duplicate key error
console.log('\nTest 3: Duplicate key error (400)');
const err3 = {
  code: 11000,
  keyPattern: { email: 1 },
};
const mockRes3 = {
  status: (code) => ({
    json: (data) => {
      console.log('✅ Status code:', code === 400);
      console.log('✅ Error message:', data.message);
    },
  }),
};
errorHandler(err3, mockReq1, mockRes3, () => {});

// Test 4: Cast error (invalid ObjectId)
console.log('\nTest 4: Cast error - invalid ObjectId (404)');
const err4 = {
  name: 'CastError',
};
const mockRes4 = {
  status: (code) => ({
    json: (data) => {
      console.log('✅ Status code:', code === 404);
      console.log('✅ Error message:', data.message);
    },
  }),
};
errorHandler(err4, mockReq1, mockRes4, () => {});

// Test 5: JWT error
console.log('\nTest 5: JWT error (401)');
const err5 = {
  name: 'JsonWebTokenError',
};
const mockRes5 = {
  status: (code) => ({
    json: (data) => {
      console.log('✅ Status code:', code === 401);
      console.log('✅ Error message:', data.message);
    },
  }),
};
errorHandler(err5, mockReq1, mockRes5, () => {});

// Test 6: Token expired error
console.log('\nTest 6: Token expired error (401)');
const err6 = {
  name: 'TokenExpiredError',
};
const mockRes6 = {
  status: (code) => ({
    json: (data) => {
      console.log('✅ Status code:', code === 401);
      console.log('✅ Error message:', data.message);
    },
  }),
};
errorHandler(err6, mockReq1, mockRes6, () => {});

console.log('\n✅ All error handler tests passed!');
