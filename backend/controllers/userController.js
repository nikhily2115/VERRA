const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');

// Helper function to create error with status code
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private (all authenticated users)
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (all authenticated users)
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  // Prevent role modification by users
  if (role !== undefined) {
    const error = new Error('Cannot modify role field');
    error.statusCode = 403;
    throw error;
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Check for duplicate email if email is being updated
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      const error = new Error('Email already in use');
      error.statusCode = 400;
      throw error;
    }
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    }
  });
});

// @desc    Add product to cart
// @route   POST /api/users/cart/add
// @access  Private (user role only)
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw createError('Product not found', 404);
  }

  // Check if product is approved
  if (!product.isApproved) {
    throw createError('Product is not available', 400);
  }

  // Validate stock
  if (product.stock < quantity) {
    throw createError('Insufficient stock', 400);
  }

  const user = await User.findById(req.user._id);

  // Check if product already in cart
  const existingItem = user.cart.find(
    item => item.product.toString() === productId
  );

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw createError('Insufficient stock', 400);
    }
    existingItem.quantity = newQuantity;
  } else {
    // Add new item
    user.cart.push({ product: productId, quantity });
  }

  await user.save();

  // Populate cart for response
  await user.populate('cart.product');

  res.status(200).json({
    success: true,
    data: user.cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/users/cart/update
// @access  Private (user role only)
const updateCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    throw createError('Quantity must be at least 1', 400);
  }

  // Validate product and stock
  const product = await Product.findById(productId);
  if (!product) {
    throw createError('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw createError('Insufficient stock', 400);
  }

  const user = await User.findById(req.user._id);

  const cartItem = user.cart.find(
    item => item.product.toString() === productId
  );

  if (!cartItem) {
    throw createError('Product not in cart', 404);
  }

  cartItem.quantity = quantity;
  await user.save();

  await user.populate('cart.product');

  res.status(200).json({
    success: true,
    data: user.cart
  });
});

// @desc    Remove product from cart
// @route   DELETE /api/users/cart/remove/:productId
// @access  Private (user role only)
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  const itemIndex = user.cart.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw createError('Product not in cart', 404);
  }

  user.cart.splice(itemIndex, 1);
  await user.save();

  await user.populate('cart.product');

  res.status(200).json({
    success: true,
    data: user.cart
  });
});

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private (user role only)
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');

  // Calculate cart total
  const cartTotal = user.cart.reduce((total, item) => {
    if (item.product) {
      return total + (item.product.price * item.quantity);
    }
    return total;
  }, 0);

  res.status(200).json({
    success: true,
    data: {
      cart: user.cart,
      total: cartTotal
    }
  });
});

module.exports = {
  getProfile,
  updateProfile,
  addToCart,
  updateCart,
  removeFromCart,
  getCart
};

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/add
// @access  Private (user role only)
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw createError('Product not found', 404);
  }

  const user = await User.findById(req.user._id);

  // Check if product already in wishlist
  const alreadyInWishlist = user.wishlist.some(
    id => id.toString() === productId
  );

  if (alreadyInWishlist) {
    throw createError('Product already in wishlist', 400);
  }

  user.wishlist.push(productId);
  await user.save();

  await user.populate('wishlist');

  res.status(200).json({
    success: true,
    data: user.wishlist
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/remove/:productId
// @access  Private (user role only)
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  const itemIndex = user.wishlist.findIndex(
    id => id.toString() === productId
  );

  if (itemIndex === -1) {
    throw createError('Product not in wishlist', 404);
  }

  user.wishlist.splice(itemIndex, 1);
  await user.save();

  await user.populate('wishlist');

  res.status(200).json({
    success: true,
    data: user.wishlist
  });
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private (user role only)
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    success: true,
    data: user.wishlist
  });
});

module.exports = {
  getProfile,
  updateProfile,
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist
};
