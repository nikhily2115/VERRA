const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getMyProductById,
  getAllProductsAdmin,
  approveProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  validateProduct,
  validateObjectId,
  checkValidation,
} = require('../middleware/validateMiddleware');

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/products/search
 * @desc    Search products
 * @access  Public
 */
router.get('/search', searchProducts);

/**
 * @route   GET /api/products
 * @desc    Get all approved products
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Public
 */
router.get('/:id', validateObjectId, checkValidation, getProductById);

// ==================== VENDOR ROUTES ====================

/**
 * @route   GET /api/products/vendor/my-products
 * @desc    Get vendor's own products
 * @access  Private/Vendor
 */
router.get('/vendor/my-products', protect, authorize('vendor'), getMyProducts);

/**
 * @route   GET /api/products/vendor/:id
 * @desc    Get vendor's single product by ID
 * @access  Private/Vendor
 */
router.get('/vendor/:id', protect, authorize('vendor'), validateObjectId, checkValidation, getMyProductById);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private/Vendor
 */
router.post(
  '/',
  protect,
  authorize('vendor'),
  validateProduct,
  checkValidation,
  createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private/Vendor
 */
router.put(
  '/:id',
  protect,
  authorize('vendor'),
  validateObjectId,
  validateProduct,
  checkValidation,
  updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private/Vendor
 */
router.delete(
  '/:id',
  protect,
  authorize('vendor'),
  validateObjectId,
  checkValidation,
  deleteProduct
);

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET /api/products/admin/all
 * @desc    Get all products (including unapproved)
 * @access  Private/Admin
 */
router.get('/admin/all', protect, authorize('admin'), getAllProductsAdmin);

/**
 * @route   PUT /api/products/admin/approve/:id
 * @desc    Approve or reject product
 * @access  Private/Admin
 */
router.put(
  '/admin/approve/:id',
  protect,
  authorize('admin'),
  validateObjectId,
  checkValidation,
  approveProduct
);

module.exports = router;
