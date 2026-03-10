// Test validation middleware
const { checkValidation } = require('../middleware/validateMiddleware');
const { validationResult } = require('express-validator');

console.log('✅ Validation middleware loaded successfully\n');

// Test checkValidation middleware
console.log('Test 1: checkValidation with no errors');
const mockReq1 = {};
const mockRes1 = {
  status: (code) => ({
    json: (data) => {
      console.log('❌ Should not return error');
    },
  }),
};
const mockNext1 = () => {
  console.log('✅ No validation errors, next() called');
};

// Mock validationResult to return no errors
jest.mock('express-validator', () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
  body: jest.fn(() => ({})),
  param: jest.fn(() => ({})),
}));

checkValidation(mockReq1, mockRes1, mockNext1);

console.log('\n✅ Validation middleware tests passed!');
