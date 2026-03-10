const { connectDB, clearDB, closeDB } = require('./setup');
const mongoose = require('mongoose');

// Set test environment BEFORE any imports
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(30000);

// Connect to database before all tests
beforeAll(async () => {
  await connectDB();
});

// Clear database before each test
beforeEach(async () => {
  await clearDB();
});

// Close database connection after all tests
afterAll(async () => {
  await closeDB();
});

// Global error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection in tests:', error);
});
