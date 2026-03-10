const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

const sampleUsers = [
  {
    name: 'John Customer',
    email: 'customer@verra.com',
    password: 'Customer123!@#',
    role: 'user'
  },
  {
    name: 'Sarah Vendor',
    email: 'vendor@verra.com',
    password: 'Vendor123!@#',
    role: 'vendor'
  },
  {
    name: 'Mike Vendor',
    email: 'vendor2@verra.com',
    password: 'Vendor123!@#',
    role: 'vendor'
  }
];

const sampleProducts = [
  {
    title: 'Luxury Diamond Necklace',
    description: 'Exquisite 18K white gold necklace featuring a stunning 2-carat diamond centerpiece. Handcrafted by master jewelers with attention to every detail.',
    price: 125000,
    category: 'Jewelry',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    stock: 5,
    isApproved: true
  },
  {
    title: 'Swiss Luxury Watch',
    description: 'Premium Swiss-made automatic watch with sapphire crystal and genuine leather strap. Limited edition timepiece for the discerning collector.',
    price: 85000,
    category: 'Watches',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'],
    stock: 10,
    isApproved: true
  },
  {
    title: 'Designer Leather Handbag',
    description: 'Handcrafted Italian leather handbag with gold-plated hardware. Timeless elegance meets modern functionality.',
    price: 45000,
    category: 'Handbags',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'],
    stock: 15,
    isApproved: true
  },
  {
    title: 'Silk Evening Gown',
    description: 'Elegant floor-length evening gown crafted from pure silk. Perfect for gala events and special occasions.',
    price: 65000,
    category: 'Clothing',
    images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'],
    stock: 8,
    isApproved: true
  },
  {
    title: 'Gold Cufflinks Set',
    description: '24K gold-plated cufflinks with diamond accents. Comes in a luxury presentation box.',
    price: 15000,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
    stock: 20,
    isApproved: true
  },
  {
    title: 'Pearl Earrings',
    description: 'Cultured South Sea pearl earrings set in platinum. Classic beauty that never goes out of style.',
    price: 35000,
    category: 'Jewelry',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
    stock: 12,
    isApproved: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing sample data...');
    await User.deleteMany({ email: { $in: sampleUsers.map(u => u.email) } });
    await Product.deleteMany({ title: { $in: sampleProducts.map(p => p.title) } });

    // Create sample users
    console.log('👥 Creating sample users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users:`);
    createdUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Get vendor IDs for products
    const vendors = createdUsers.filter(u => u.role === 'vendor');
    
    // Assign products to vendors
    console.log('\n📦 Creating sample products...');
    const productsWithVendors = sampleProducts.map((product, index) => ({
      ...product,
      vendor: vendors[index % vendors.length]._id
    }));

    const createdProducts = await Product.create(productsWithVendors);
    console.log(`✅ Created ${createdProducts.length} products:`);
    createdProducts.forEach(product => {
      console.log(`   - ${product.title} (₹${product.price.toLocaleString('en-IN')})`);
    });

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📋 Sample Credentials:');
    console.log('   Customer:');
    console.log('   - Email: customer@verra.com');
    console.log('   - Password: Customer123!@#\n');
    console.log('   Vendor:');
    console.log('   - Email: vendor@verra.com');
    console.log('   - Password: Vendor123!@#\n');
    console.log('   Admin (already exists):');
    console.log('   - Email: admin@verra.com');
    console.log('   - Password: Admin123!@#\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
