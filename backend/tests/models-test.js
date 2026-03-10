// Quick test to verify models load correctly
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

console.log('✅ User model loaded:', User.modelName);
console.log('✅ Product model loaded:', Product.modelName);
console.log('✅ Order model loaded:', Order.modelName);

// Test User schema fields
const userFields = Object.keys(User.schema.paths);
console.log('\n📋 User model fields:', userFields.filter(f => !f.startsWith('_')));

// Test Product schema fields
const productFields = Object.keys(Product.schema.paths);
console.log('📋 Product model fields:', productFields.filter(f => !f.startsWith('_')));

// Test Order schema fields
const orderFields = Object.keys(Order.schema.paths);
console.log('📋 Order model fields:', orderFields.filter(f => !f.startsWith('_')));

console.log('\n✅ All models loaded successfully!');
process.exit(0);
