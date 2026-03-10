const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

dotenv.config();

/**
 * Verify and create database indexes
 * Run this script after deployment to ensure all indexes are created
 */
const verifyIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('\n=== Creating Indexes ===\n');

    // Create indexes for User model
    console.log('Creating User indexes...');
    await User.createIndexes();
    const userIndexes = await User.collection.getIndexes();
    console.log('User indexes:', Object.keys(userIndexes));

    // Create indexes for Product model
    console.log('\nCreating Product indexes...');
    await Product.createIndexes();
    const productIndexes = await Product.collection.getIndexes();
    console.log('Product indexes:', Object.keys(productIndexes));

    // Create indexes for Order model
    console.log('\nCreating Order indexes...');
    await Order.createIndexes();
    const orderIndexes = await Order.collection.getIndexes();
    console.log('Order indexes:', Object.keys(orderIndexes));

    console.log('\n=== Index Verification Complete ===\n');
    console.log('All indexes have been created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error verifying indexes:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  verifyIndexes();
}

module.exports = verifyIndexes;
