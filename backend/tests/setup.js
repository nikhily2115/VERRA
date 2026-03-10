const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Connect to test database
 */
const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Test database already connected');
      return;
    }

    // Close any existing connections first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    // Use MONGODB_URI_TEST from .env file
    const testDbUri = process.env.MONGODB_URI_TEST || process.env.TEST_MONGODB_URI || 
                      process.env.MONGODB_URI.replace(/\/([^/]+)(\?|$)/, '/$1-test$2');
    
    await mongoose.connect(testDbUri);
    console.log('Test database connected');
  } catch (error) {
    console.error('Test database connection error:', error.message);
    // Don't exit in test environment, let Jest handle it
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

/**
 * Close database connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database:', error.message);
  }
};

/**
 * Clear all collections in the database
 */
const clearDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    
    console.log('Test database cleared');
  } catch (error) {
    console.error('Error clearing test database:', error.message);
    throw error;
  }
};

/**
 * Drop the entire test database
 */
const dropDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log('Test database dropped');
  } catch (error) {
    console.error('Error dropping test database:', error.message);
    throw error;
  }
};

module.exports = {
  connectDB,
  closeDB,
  clearDB,
  dropDB,
};
