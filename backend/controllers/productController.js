const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// ==================== PUBLIC ENDPOINTS ====================

/**
 * @desc    Get all approved products with optional filters
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const { category, sort } = req.query;

  // Build query - only approved products
  const query = { isApproved: true };

  // Add category filter if provided
  if (category) {
    query.category = category;
  }

  // Build sort options
  let sortOptions = {};
  if (sort === 'price-asc') {
    sortOptions = { price: 1 };
  } else if (sort === 'price-desc') {
    sortOptions = { price: -1 };
  } else if (sort === 'rating') {
    sortOptions = { ratings: -1 };
  } else {
    sortOptions = { createdAt: -1 }; // Newest first by default
  }

  const products = await Product.find(query)
    .populate('vendor', 'name email')
    .sort(sortOptions);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'vendor',
    'name email'
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Only show approved products to public
  if (!product.isApproved) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/**
 * @desc    Search products by title or description
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    res.status(400);
    throw new Error('Search query is required');
  }

  // Use MongoDB text search
  const products = await Product.find({
    $text: { $search: q },
    isApproved: true,
  })
    .populate('vendor', 'name email')
    .sort({ score: { $meta: 'textScore' } });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// ==================== VENDOR ENDPOINTS ====================

/**
 * @desc    Create new product (vendor)
 * @route   POST /api/products
 * @access  Private/Vendor
 */
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, images, stock } = req.body;

  const product = await Product.create({
    title,
    description,
    price,
    category,
    images,
    stock,
    vendor: req.user._id,
    isApproved: false, // Requires admin approval
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully. Pending admin approval.',
    product,
  });
});

/**
 * @desc    Update product (vendor - own products only)
 * @route   PUT /api/products/:id
 * @access  Private/Vendor
 */
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if vendor owns this product
  if (product.vendor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  const { title, description, price, category, images, stock } = req.body;

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      price,
      category,
      images,
      stock,
      isApproved: false, // Reset approval status on update
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Product updated successfully. Pending admin approval.',
    product,
  });
});

/**
 * @desc    Delete product (vendor - own products only)
 * @route   DELETE /api/products/:id
 * @access  Private/Vendor
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if vendor owns this product
  if (product.vendor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

/**
 * @desc    Get vendor's own products
 * @route   GET /api/products/vendor/my-products
 * @access  Private/Vendor
 */
const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendor: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * @desc    Get vendor's single product by ID
 * @route   GET /api/products/vendor/:id
 * @access  Private/Vendor
 */
const getMyProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    vendor: req.user._id
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found or you do not have permission to access it');
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// ==================== ADMIN ENDPOINTS ====================

/**
 * @desc    Get all products (admin - including unapproved)
 * @route   GET /api/products/admin/all
 * @access  Private/Admin
 */
const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate('vendor', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * @desc    Approve or reject product (admin)
 * @route   PUT /api/products/admin/approve/:id
 * @access  Private/Admin
 */
const approveProduct = asyncHandler(async (req, res) => {
  const { isApproved } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.isApproved = isApproved;
  await product.save();

  res.status(200).json({
    success: true,
    message: `Product ${isApproved ? 'approved' : 'rejected'} successfully`,
    product,
  });
});

module.exports = {
  // Public
  getAllProducts,
  getProductById,
  searchProducts,
  // Vendor
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getMyProductById,
  // Admin
  getAllProductsAdmin,
  approveProduct,
};
