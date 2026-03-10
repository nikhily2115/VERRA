const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Skip if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    // Use test database in test environment
    let dbUri = process.env.MONGODB_URI;
    if (process.env.NODE_ENV === 'test') {
      dbUri = process.env.TEST_MONGODB_URI || 
              process.env.MONGODB_URI.replace(/\/([^/]+)(\?|$)/, '/$1-test$2');
    }

    const conn = await mongoose.connect(dbUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Retry connection after 5 seconds (only in non-test environment)
    if (process.env.NODE_ENV !== 'test') {
      setTimeout(connectDB, 5000);
    }
  }
};

module.exports = connectDB;
