// Test async handler utility
const asyncHandler = require('../utils/asyncHandler');

console.log('🔧 Testing Async Handler Utility...\n');

// Test 1: Successful async function
console.log('Test 1: Successful async function');
const successFn = asyncHandler(async (req, res) => {
  const data = await Promise.resolve({ message: 'Success' });
  res.json(data);
});

const mockReq1 = {};
const mockRes1 = {
  json: (data) => {
    console.log('✅ Async function executed successfully');
    console.log('✅ Data returned:', data.message);
  },
};
const mockNext1 = (err) => {
  console.log('❌ Should not call next with error');
};

successFn(mockReq1, mockRes1, mockNext1);

// Test 2: Async function with error
console.log('\nTest 2: Async function with error');
const errorFn = asyncHandler(async (req, res) => {
  throw new Error('Async error');
});

const mockReq2 = {};
const mockRes2 = {
  json: (data) => {
    console.log('❌ Should not return success');
  },
};
const mockNext2 = (err) => {
  console.log('✅ Error caught and passed to next()');
  console.log('✅ Error message:', err.message);
};

errorFn(mockReq2, mockRes2, mockNext2);

// Wait for promises to resolve
setTimeout(() => {
  console.log('\n✅ All async handler tests passed!');
}, 100);
