const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

// Helper function to create error with status code
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// ==================== USER ENDPOINTS ====================

/**
 * @desc    Get user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private (user role only)
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('products.product', 'title images price')
    .populate('products.vendor', 'name email')
    .sort({ createdAt: -1 }); // Newest first

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (user role only)
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('products.product', 'title images price description')
    .populate('products.vendor', 'name email');

  if (!order) {
    throw createError('Order not found', 404);
  }

  // Check if user owns this order
  if (order.user.toString() !== req.user._id.toString()) {
    throw createError('Not authorized to view this order', 403);
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// ==================== VENDOR ENDPOINTS ====================

/**
 * @desc    Get vendor's orders (orders containing their products)
 * @route   GET /api/orders/vendor/my-orders
 * @access  Private (vendor role only)
 */
const getVendorOrders = asyncHandler(async (req, res) => {
  // Find all orders that contain products from this vendor
  const orders = await Order.find({
    'products.vendor': req.user._id,
  })
    .populate('user', 'name email')
    .populate('products.product', 'title images price')
    .sort({ createdAt: -1 });

  // Filter each order to show only vendor's products and calculate vendor-specific totals
  const vendorOrders = orders.map((order) => {
    const vendorProducts = order.products.filter(
      (item) => item.vendor.toString() === req.user._id.toString()
    );

    const vendorTotal = vendorProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return {
      _id: order._id,
      user: order.user,
      products: vendorProducts,
      vendorTotal,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  });

  res.status(200).json({
    success: true,
    count: vendorOrders.length,
    data: vendorOrders,
  });
});

// ==================== ADMIN ENDPOINTS ====================

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders/admin/all
 * @access  Private (admin role only)
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('products.product', 'title images price')
    .populate('products.vendor', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @desc    Update order status (admin)
 * @route   PUT /api/orders/admin/status/:id
 * @access  Private (admin role only)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw createError('Order not found', 404);
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
});

module.exports = {
  // User
  getMyOrders,
  getOrderById,
  // Vendor
  getVendorOrders,
  // Admin
  getAllOrders,
  updateOrderStatus,
};
