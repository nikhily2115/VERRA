const { body, param, validationResult } = require('express-validator');

/**
 * Validation rules for user registration
 */
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isIn(['user', 'vendor'])
    .withMessage('Role must be either user or vendor'),
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for password reset
 */
const validatePasswordReset = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

/**
 * Validation rules for product creation/update
 */
const validateProduct = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Handbags', 'Watches', 'Jewelry', 'Clothing', 'Shoes', 'Accessories', 'Fragrances'])
    .withMessage('Invalid category'),
  body('images')
    .isArray({ min: 1, max: 5 })
    .withMessage('Product must have between 1 and 5 images'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
];

/**
 * Validation rules for MongoDB ObjectId parameters
 */
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

/**
 * Validation rules for cart operations
 */
const validateCartAdd = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

/**
 * Validation rules for cart update
 */
const validateCartUpdate = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

/**
 * Validation rules for wishlist operations
 */
const validateWishlistAdd = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
];

/**
 * Validation rules for profile update
 */
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

/**
 * Validation rules for order status update
 */
const validateOrderStatus = [
  body('orderStatus')
    .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

/**
 * Validation rules for payment creation
 */
const validatePaymentCreate = [
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be greater than 0'),
];

/**
 * Validation rules for payment verification
 */
const validatePaymentVerify = [
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  body('razorpay_signature')
    .notEmpty()
    .withMessage('Razorpay signature is required'),
  body('cartItems')
    .isArray({ min: 1 })
    .withMessage('Cart items are required'),
];

/**
 * Middleware to check validation results
 * Returns 400 with validation errors if validation fails
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  validateProduct,
  validateObjectId,
  validateCartAdd,
  validateCartUpdate,
  validateWishlistAdd,
  validateProfileUpdate,
  validateOrderStatus,
  validatePaymentCreate,
  validatePaymentVerify,
  checkValidation,
};
