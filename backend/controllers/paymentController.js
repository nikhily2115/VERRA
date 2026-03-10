const Razorpay = require('razorpay');
const asyncHandler = require('../utils/asyncHandler');
const { verifyRazorpaySignature } = require('../utils/verifyPayment');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Helper function to create error with status code
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Initialize Razorpay instance (lazy initialization)
let razorpayInstance = null;
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw createError('Razorpay credentials not configured', 500);
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payment/create-order
 * @access  Private (user role only)
 */
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  // Validate amount
  if (!amount || amount <= 0) {
    throw createError('Invalid amount', 400);
  }

  // In test/development mode with test credentials, create a mock order
  if (process.env.RAZORPAY_KEY_ID === 'rzp_test_1234567890') {
    const mockOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      status: 'created',
    };

    return res.status(200).json({
      success: true,
      data: {
        orderId: mockOrder.id,
        amount: mockOrder.amount,
        currency: mockOrder.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  }

  // Get Razorpay instance for production
  const razorpay = getRazorpayInstance();

  // Create Razorpay order
  const options = {
    amount: amount * 100, // Convert to paise
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    },
  });
});

/**
 * @desc    Verify payment and create order
 * @route   POST /api/payment/verify
 * @access  Private (user role only)
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    cartItems,
    shippingAddress,
  } = req.body;

  // For test credentials, skip signature verification
  let isValid = true;
  if (process.env.RAZORPAY_KEY_ID !== 'rzp_test_your_actual_key_id_here') {
    // Verify signature only with real credentials
    isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
  }

  if (!isValid) {
    throw createError('Invalid payment signature', 400);
  }

  // Validate cart items
  if (!cartItems || cartItems.length === 0) {
    throw createError('Cart is empty', 400);
  }

  // Validate and calculate total amount
  let totalAmount = 0;
  const orderProducts = [];

  for (const item of cartItems) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw createError(`Product ${item.productId} not found`, 404);
    }

    if (!product.isApproved) {
      throw createError(`Product ${product.title} is not available`, 400);
    }

    if (product.stock < item.quantity) {
      throw createError(
        `Insufficient stock for ${product.title}. Available: ${product.stock}`,
        400
      );
    }

    // Calculate item total
    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    orderProducts.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
      vendor: product.vendor,
    });
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    products: orderProducts,
    totalAmount,
    paymentStatus: 'completed',
    orderStatus: 'pending',
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    shippingAddress,
  });

  // Update product stock
  for (const item of cartItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear user's cart
  await User.findByIdAndUpdate(req.user._id, {
    cart: [],
  });

  // Populate order details
  await order.populate('products.product', 'title images');
  await order.populate('products.vendor', 'name email');

  res.status(201).json({
    success: true,
    message: 'Payment verified and order created successfully',
    data: order,
  });
});

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
