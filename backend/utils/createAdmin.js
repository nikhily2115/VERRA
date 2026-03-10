/**
 * Utility script to create an admin user
 * Run: node utils/createAdmin.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    console.log('🔧 Creating Admin User...\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@verra.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      if (existingAdmin.role !== 'admin') {
        console.log('\n🔄 Updating role to admin...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Role updated to admin');
      }
      
      process.exit(0);
    }

    // Create new admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@verra.com',
      password: 'Admin123!@#',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email:', admin.email);
    console.log('Password: Admin123!@#');
    console.log('Role:', admin.role);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
