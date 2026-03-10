const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// Helper function to create error with status code
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private (admin role only)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // Count users by role
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalVendors = await User.countDocuments({ role: 'vendor' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });

  // Count orders
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
  const completedOrders = await Order.countDocuments({ paymentStatus: 'completed' });

  // Count products
  const totalProducts = await Product.countDocuments();
  const approvedProducts = await Product.countDocuments({ isApproved: true });
  const pendingProducts = await Product.countDocuments({ isApproved: false });

  // Calculate revenue
  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        vendors: totalVendors,
        admins: totalAdmins,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
      },
      products: {
        total: totalProducts,
        approved: approvedProducts,
        pending: pendingProducts,
      },
      revenue: {
        total: totalRevenue,
      },
    },
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (admin role only)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 * @desc    Get all vendors
 * @route   GET /api/admin/vendors
 * @access  Private (admin role only)
 */
const getAllVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor' })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: vendors.length,
    data: vendors,
  });
});

/**
 * @desc    Block/unblock user
 * @route   PUT /api/admin/users/block/:id
 * @access  Private (admin role only)
 */
const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw createError('User not found', 404);
  }

  // Prevent blocking admin users
  if (user.role === 'admin') {
    throw createError('Cannot block admin users', 403);
  }

  // Toggle isBlocked status
  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isBlocked: user.isBlocked,
    },
  });
});

/**
 * @desc    Get total revenue
 * @route   GET /api/admin/revenue
 * @access  Private (admin role only)
 */
const getTotalRevenue = asyncHandler(async (req, res) => {
  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 },
      },
    },
  ]);

  const result = revenueData.length > 0 ? revenueData[0] : { totalRevenue: 0, orderCount: 0 };

  // Get revenue by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'completed',
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalRevenue: result.totalRevenue,
      totalOrders: result.orderCount,
      monthlyRevenue,
    },
  });
});

/**
 * @desc    Get vendor statistics
 * @route   GET /api/admin/vendor-stats/:id
 * @access  Private (admin role only)
 */
const getVendorStats = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;

  // Verify vendor exists
  const vendor = await User.findOne({ _id: vendorId, role: 'vendor' });
  if (!vendor) {
    throw createError('Vendor not found', 404);
  }

  // Count vendor's products
  const totalProducts = await Product.countDocuments({ vendor: vendorId });
  const approvedProducts = await Product.countDocuments({ vendor: vendorId, isApproved: true });

  // Find all completed orders containing vendor's products
  const orders = await Order.find({
    'products.vendor': vendorId,
    paymentStatus: 'completed',
  });

  // Calculate sales count and earnings
  let salesCount = 0;
  let totalEarnings = 0;

  orders.forEach((order) => {
    order.products.forEach((item) => {
      if (item.vendor.toString() === vendorId) {
        salesCount += item.quantity;
        totalEarnings += item.price * item.quantity;
      }
    });
  });

  res.status(200).json({
    success: true,
    data: {
      vendor: {
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email,
      },
      products: {
        total: totalProducts,
        approved: approvedProducts,
      },
      sales: {
        count: salesCount,
        earnings: totalEarnings,
        orders: orders.length,
      },
    },
  });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllVendors,
  blockUser,
  getTotalRevenue,
  getVendorStats,
};
