// Test bcrypt password hashing
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const testPasswordHashing = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🔐 Testing password hashing...\n');
    
    // Create a test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123',
      role: 'user',
    });
    
    const plainPassword = testUser.password;
    console.log('📝 Plain password:', plainPassword);
    
    // Save user (this triggers the pre-save hook)
    await testUser.save();
    
    // Fetch user with password field
    const savedUser = await User.findById(testUser._id).select('+password');
    
    console.log('🔒 Hashed password:', savedUser.password);
    console.log('✅ Password is hashed:', savedUser.password !== plainPassword);
    console.log('✅ Hash starts with $2a$ (bcrypt):', savedUser.password.startsWith('$2a$'));
    
    // Test password comparison
    const isMatch = await savedUser.comparePassword('TestPassword123');
    console.log('✅ Correct password matches:', isMatch);
    
    const isWrongMatch = await savedUser.comparePassword('WrongPassword');
    console.log('✅ Wrong password rejected:', !isWrongMatch);
    
    // Clean up
    await User.deleteOne({ _id: testUser._id });
    
    console.log('\n✅ All password hashing tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testPasswordHashing();
