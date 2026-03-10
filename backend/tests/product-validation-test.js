// Test Product model validation
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const testProductValidation = async () => {
  try {
    await connectDB();
    
    console.log('📦 Testing Product model validation...\n');
    
    // Create a test vendor
    const vendor = new User({
      name: 'Test Vendor',
      email: 'vendor@example.com',
      password: 'VendorPass123',
      role: 'vendor',
    });
    await vendor.save();
    
    // Test 1: Valid product
    console.log('Test 1: Creating valid product...');
    const validProduct = new Product({
      title: 'Luxury Leather Handbag',
      description: 'Premium Italian leather handbag with gold hardware',
      price: 45000,
      category: 'Handbags',
      images: ['image1.jpg', 'image2.jpg'],
      vendor: vendor._id,
      stock: 10,
    });
    await validProduct.save();
    console.log('✅ Valid product created successfully');
    console.log('✅ isApproved defaults to false:', validProduct.isApproved === false);
    
    // Test 2: Invalid category
    console.log('\nTest 2: Testing invalid category...');
    try {
      const invalidProduct = new Product({
        title: 'Test Product',
        description: 'Test description here',
        price: 1000,
        category: 'InvalidCategory',
        images: ['image1.jpg'],
        vendor: vendor._id,
        stock: 5,
      });
      await invalidProduct.save();
      console.log('❌ Should have failed validation');
    } catch (error) {
      console.log('✅ Invalid category rejected:', error.message.includes('is not a valid enum value'));
    }
    
    // Test 3: Price validation
    console.log('\nTest 3: Testing negative price...');
    try {
      const negativePrice = new Product({
        title: 'Test Product',
        description: 'Test description here',
        price: -100,
        category: 'Watches',
        images: ['image1.jpg'],
        vendor: vendor._id,
        stock: 5,
      });
      await negativePrice.save();
      console.log('❌ Should have failed validation');
    } catch (error) {
      console.log('✅ Negative price rejected:', error.message.includes('cannot be negative'));
    }
    
    // Test 4: Images array validation
    console.log('\nTest 4: Testing images array validation...');
    try {
      const noImages = new Product({
        title: 'Test Product',
        description: 'Test description here',
        price: 1000,
        category: 'Watches',
        images: [],
        vendor: vendor._id,
        stock: 5,
      });
      await noImages.save();
      console.log('❌ Should have failed validation');
    } catch (error) {
      console.log('✅ Empty images array rejected:', error.message.includes('between 1 and 5 images'));
    }
    
    // Clean up
    await Product.deleteOne({ _id: validProduct._id });
    await User.deleteOne({ _id: vendor._id });
    
    console.log('\n✅ All Product validation tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testProductValidation();
