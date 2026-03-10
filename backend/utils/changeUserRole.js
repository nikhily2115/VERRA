/**
 * Utility script to change a user's role
 * Run: node utils/changeUserRole.js <email> <role>
 * Example: node utils/changeUserRole.js user@example.com admin
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const changeUserRole = async () => {
  try {
    const email = process.argv[2];
    const newRole = process.argv[3];

    if (!email || !newRole) {
      console.log('❌ Usage: node utils/changeUserRole.js <email> <role>');
      console.log('Example: node utils/changeUserRole.js user@example.com admin');
      console.log('\nValid roles: user, vendor, admin');
      process.exit(1);
    }

    if (!['user', 'vendor', 'admin'].includes(newRole)) {
      console.log('❌ Invalid role. Valid roles: user, vendor, admin');
      process.exit(1);
    }

    await connectDB();

    console.log(`🔧 Changing role for ${email}...\n`);

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    console.log('✅ User role updated successfully!');
    console.log('\nUser Details:');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Old Role:', oldRole);
    console.log('New Role:', user.role);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

changeUserRole();
