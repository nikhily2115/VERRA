# VERRA LUXURY E-COMMERCE PLATFORM - COMPLETE CODE REFERENCE

**Version:** 1.0.0  
**Last Updated:** March 5, 2026  
**Platform:** MERN Stack (MongoDB, Express.js, React, Node.js)  
**Architecture:** Role-Based Access Control (User, Vendor, Admin)

---

## TABLE OF CONTENTS

1. [Database Schema & Models](#1-database-schema--models)
2. [Backend API & Services](#2-backend-api--services)
3. [Frontend Components](#3-frontend-components)
4. [State Management](#4-state-management)
5. [Authentication & Security](#5-authentication--security)
6. [Payment Integration](#6-payment-integration)
7. [Key Utilities](#7-key-utilities)
8. [Routing Configuration](#8-routing-configuration)
9. [Environment Configuration](#9-environment-configuration)
10. [Package Dependencies](#10-package-dependencies)

---

## 1. DATABASE SCHEMA & MODELS

### 1.1 User Model (`backend/models/User.js`)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for role-based queries
userSchema.index({ role: 1, isBlocked: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### 1.2 Product Model (`backend/models/Product.js`)

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Handbags',
        'Watches',
        'Jewelry',
        'Clothing',
        'Shoes',
        'Accessories',
        'Fragrances',
      ],
    },
    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0 && arr.length <= 5;
        },
        message: 'Product must have between 1 and 5 images',
      },
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
productSchema.index({ title: 'text', description: 'text' });

// Index for filtering
productSchema.index({ category: 1, isApproved: 1 });
productSchema.index({ vendor: 1 });

module.exports = mongoose.model('Product', productSchema);
```

### 1.3 Order Model (`backend/models/Order.js`)

```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for user order history
orderSchema.index({ user: 1, createdAt: -1 });

// Index for vendor orders
orderSchema.index({ 'products.vendor': 1 });

module.exports = mongoose.model('Order', orderSchema);
```

---

## 2. BACKEND API & SERVICES

### 2.1 Server Configuration (`backend/server.js`)

```javascript
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const morgan = require('morgan');
const { apiLimiter, authLimiter, paymentLimiter } = require('./config/rateLimiter');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware - Helmet with enhanced configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "https://checkout.razorpay.com"],
        frameSrc: ["'self'", "https://api.razorpay.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.razorpay.com"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny',
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  })
);

// Rate limiting (disabled in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use('/api', apiLimiter);
}

// CORS configuration with enhanced security
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CLIENT_URL 
      ? process.env.CLIENT_URL.split(',').map(url => url.trim())
      : ['http://localhost:3000'];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// API routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', paymentLimiter, require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handler middleware (must be last)
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    process.exit(1);
  });
}

module.exports = app;
```

### 2.2 Authentication Controller (`backend/controllers/authController.js`)

```javascript
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error('User already exists with this email');
    error.statusCode = 400;
    throw error;
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } else {
    const error = new Error('Invalid user data');
    error.statusCode = 400;
    throw error;
  }
});

/**
 * @desc    Login user and set JWT cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email (include password field)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Check if user is blocked
  if (user.isBlocked) {
    const error = new Error('Your account has been blocked');
    error.statusCode = 403;
    throw error;
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate token and set cookie
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @desc    Logout user and clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};
```


### 2.3 Product Controller (`backend/controllers/productController.js`)

**Public Endpoints:**
- `GET /api/products` - Get all approved products with filters
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/search?q=query` - Search products

**Vendor Endpoints:**
- `POST /api/products` - Create new product (requires approval)
- `PUT /api/products/:id` - Update own product
- `DELETE /api/products/:id` - Delete own product
- `GET /api/products/vendor/my-products` - Get vendor's products

**Admin Endpoints:**
- `GET /api/products/admin/all` - Get all products (including unapproved)
- `PUT /api/products/admin/approve/:id` - Approve/reject product

### 2.4 Payment Controller (`backend/controllers/paymentController.js`)

**Key Functions:**
- `createRazorpayOrder` - Creates Razorpay order with amount
- `verifyPayment` - Verifies payment signature and creates order
- Validates cart items and stock availability
- Updates product stock after successful payment
- Clears user cart after order creation

### 2.5 Order Controller (`backend/controllers/orderController.js`)

**User Endpoints:**
- `GET /api/orders/my-orders` - Get user's order history
- `GET /api/orders/:id` - Get single order details

**Vendor Endpoints:**
- `GET /api/orders/vendor/my-orders` - Get orders containing vendor's products

**Admin Endpoints:**
- `GET /api/orders/admin/all` - Get all orders
- `PUT /api/orders/admin/status/:id` - Update order status

---

## 3. FRONTEND COMPONENTS

### 3.1 Home Page (`frontend/src/pages/public/Home.jsx`)

**Sections:**
1. Hero Section - Full-screen banner with CTA buttons
2. Features Bar - 4 key features (Authenticity, Curated, Premium, Exclusive)
3. Categories Grid - 3 main categories (Jewelry, Watches, Handbags)
4. Trending Products - 8 featured products with filters
5. Offer Banner - Special promotion with 25% off badge
6. Testimonials - 3 customer reviews with 5-star ratings
7. Service Features - Free delivery, returns, secure payment, 24/7 support
8. Newsletter - Email subscription form

**Key Features:**
- Lazy loading for images
- Responsive grid layouts
- Hover animations and transitions
- Filter pills for product categories
- Dynamic product fetching from API

### 3.2 Product Card (`frontend/src/components/product/ProductCard.jsx`)

```javascript
// Key Features:
- Product image with hover zoom effect
- Wishlist button (heart icon)
- Stock badge for out-of-stock items
- Price formatting in INR
- Add to Cart button on hover
- Toast notifications for user feedback
- Role-based visibility (only users can add to cart)
```

### 3.3 Product Details (`frontend/src/components/product/ProductDetails.jsx`)

```javascript
// Features:
- Image gallery with thumbnail selection
- Quantity selector with stock validation
- Category badge
- Add to Cart with loading state
- Toast notifications for success/error
- Role-based access control
```

### 3.4 Navbar (`frontend/src/components/common/Navbar.jsx`)

**Desktop Navigation:**
- Logo (VERRA)
- Center links: Shop, Collections, New Arrivals, Brands, About
- Right icons: Search, Wishlist, Cart (with badge), User menu

**Mobile Navigation:**
- Hamburger menu
- Collapsible menu with all links
- Cart item count display

**Features:**
- Sticky positioning
- Role-based dashboard links
- Cart item count badge
- Logout functionality

### 3.5 Cart Page (`frontend/src/pages/user/Cart.jsx`)

**Features:**
- Cart items list with quantity controls
- Remove item functionality
- Cart summary with total calculation
- Shipping address form (7 fields)
- Razorpay payment integration
- Empty cart state with CTA

**Shipping Form Fields:**
- Full Name, Email, Phone Number
- Street Address, City, State, Pincode

---

## 4. STATE MANAGEMENT

### 4.1 Auth Context (`frontend/src/context/AuthContext.jsx`)

```javascript
// State:
- user: Current authenticated user object
- loading: Authentication loading state
- error: Authentication error messages

// Methods:
- login(email, password): Authenticate user
- register(userData): Create new user account
- logout(): Clear user session
- checkAuth(): Verify current authentication status

// Usage:
const { user, login, logout } = useAuth();
```

### 4.2 Cart Context (`frontend/src/context/CartContext.jsx`)

```javascript
// State:
- cartItems: Array of cart items with product details
- cartTotal: Total cart value in INR
- loading: Cart operation loading state
- error: Cart error messages

// Methods:
- addToCart(productId, quantity): Add product to cart
- updateCart(productId, quantity): Update item quantity
- removeFromCart(productId): Remove item from cart
- clearCart(): Empty the cart
- fetchCart(): Reload cart from server

// Usage:
const { cartItems, cartTotal, addToCart } = useCart();
```

### 4.3 Product Context (`frontend/src/context/ProductContext.jsx`)

```javascript
// State:
- filters: { category, search, sort, priceRange }

// Methods:
- updateCategory(category): Set category filter
- updateSearch(search): Set search query
- updateSort(sort): Set sort order
- updatePriceRange(range): Set price range
- resetFilters(): Clear all filters

// Usage:
const { filters, updateCategory } = useProduct();
```

### 4.4 Toast Context (`frontend/src/context/ToastContext.jsx`)

```javascript
// Methods:
- showSuccess(message): Display success toast
- showError(message): Display error toast
- showWarning(message): Display warning toast
- showInfo(message): Display info toast

// Features:
- Auto-dismiss after 3 seconds
- Multiple toast support
- Animated entrance/exit
- Color-coded by type

// Usage:
const { showSuccess, showError } = useToast();
```

---

## 5. AUTHENTICATION & SECURITY

### 5.1 JWT Token Management (`backend/utils/generateToken.js`)

```javascript
// Token Generation:
- Uses jsonwebtoken library
- Expires in 7 days
- Stored in HttpOnly cookie
- Includes user ID in payload

// Cookie Configuration:
- httpOnly: true (prevents XSS)
- secure: true (HTTPS only in production)
- sameSite: 'strict' (CSRF protection)
- maxAge: 7 days
```

### 5.2 Auth Middleware (`backend/middleware/authMiddleware.js`)

```javascript
// protect middleware:
1. Extract token from HttpOnly cookie
2. Verify JWT signature
3. Fetch user from database
4. Check if user is blocked
5. Attach user to req.user
6. Handle token expiration and invalid tokens
```

### 5.3 Role Middleware (`backend/middleware/roleMiddleware.js`)

```javascript
// authorize(...roles) middleware:
- Checks if req.user.role is in allowed roles
- Returns 403 Forbidden if unauthorized
- Must be used after protect middleware

// Usage:
router.post('/products', protect, authorize('vendor'), createProduct);
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
```

### 5.4 Password Hashing

```javascript
// bcryptjs configuration:
- Salt rounds: 10
- Pre-save hook in User model
- comparePassword method for verification
- Password field excluded from queries by default (select: false)
```

### 5.5 Security Headers (Helmet)

```javascript
// Configured headers:
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-XSS-Protection
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
```

### 5.6 Rate Limiting

```javascript
// Rate limits:
- API routes: 100 requests per 15 minutes
- Auth routes: 5 requests per 15 minutes
- Payment routes: 10 requests per 15 minutes
```

---

## 6. PAYMENT INTEGRATION

### 6.1 Razorpay Configuration

```javascript
// Environment Variables:
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

// Razorpay Instance:
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
```

### 6.2 Payment Flow

```javascript
// Step 1: Create Razorpay Order
POST /api/payment/create-order
Body: { amount: 50000, currency: 'INR' }
Response: { orderId, amount, currency, razorpayKeyId }

// Step 2: Open Razorpay Checkout Modal (Frontend)
const options = {
  key: razorpayKeyId,
  amount: amount,
  currency: currency,
  order_id: orderId,
  handler: function(response) {
    // Payment successful
    verifyPayment(response);
  }
};
const rzp = new window.Razorpay(options);
rzp.open();

// Step 3: Verify Payment Signature
POST /api/payment/verify
Body: {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  cartItems,
  shippingAddress
}
Response: { success, message, data: order }
```

### 6.3 Payment Verification (`backend/utils/verifyPayment.js`)

```javascript
const crypto = require('crypto');

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const text = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  
  return expectedSignature === signature;
};
```

### 6.4 Order Creation Process

```javascript
// After successful payment verification:
1. Validate cart items and stock
2. Calculate total amount
3. Create order in database
4. Update product stock (decrement)
5. Clear user's cart
6. Return order details with populated fields
```

---

## 7. KEY UTILITIES

### 7.1 Async Handler (`backend/utils/asyncHandler.js`)

```javascript
// Wraps async route handlers to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage:
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json({ success: true, products });
});
```

### 7.2 Error Middleware (`backend/middleware/errorMiddleware.js`)

```javascript
// Handles all errors:
- Mongoose validation errors (400)
- Duplicate key errors (400)
- Cast errors / Invalid ObjectId (404)
- JWT errors (401)
- Generic server errors (500)

// Returns consistent error format:
{
  success: false,
  message: "Error message",
  stack: "..." // Only in development
}
```

### 7.3 Input Sanitization (`backend/utils/sanitize.js`)

```javascript
// Protection against:
- NoSQL injection (express-mongo-sanitize)
- XSS attacks (removes script tags)
- Removes $ and . from user input
```

### 7.4 Database Connection (`backend/config/db.js`)

```javascript
// Features:
- Auto-reconnect on failure
- Test database support
- Connection pooling
- Error logging
```

### 7.5 Logger (`backend/utils/logger.js`)

```javascript
// Winston logger configuration:
- Console logging in development
- File logging in production
- Separate error log file
- Timestamp and log levels
- HTTP request logging via Morgan
```

---

## 8. ROUTING CONFIGURATION

### 8.1 Backend Routes

```javascript
// Auth Routes (/api/auth)
POST   /register          - Register new user
POST   /login             - Login user
POST   /logout            - Logout user
GET    /me                - Get current user

// Product Routes (/api/products)
GET    /                  - Get all approved products
GET    /search            - Search products
GET    /:id               - Get single product
POST   /                  - Create product (vendor)
PUT    /:id               - Update product (vendor)
DELETE /:id               - Delete product (vendor)
GET    /vendor/my-products - Get vendor's products
GET    /admin/all         - Get all products (admin)
PUT    /admin/approve/:id - Approve product (admin)

// User Routes (/api/users)
GET    /profile           - Get user profile
PUT    /profile           - Update profile
POST   /cart/add          - Add to cart
PUT    /cart/update       - Update cart item
DELETE /cart/remove/:id   - Remove from cart
GET    /cart              - Get cart
POST   /wishlist/add      - Add to wishlist
DELETE /wishlist/remove/:id - Remove from wishlist
GET    /wishlist          - Get wishlist

// Order Routes (/api/orders)
GET    /my-orders         - Get user orders
GET    /:id               - Get order details
GET    /vendor/my-orders  - Get vendor orders
GET    /admin/all         - Get all orders (admin)
PUT    /admin/status/:id  - Update order status (admin)

// Payment Routes (/api/payment)
POST   /create-order      - Create Razorpay order
POST   /verify            - Verify payment
```

### 8.2 Frontend Routes (`frontend/src/App.jsx`)

```javascript
// Public Routes
/                    - Home page
/products            - Products listing
/products/:id        - Product details
/collections         - Collections page
/new-arrivals        - New arrivals page
/brands              - Brands page
/login               - Login page
/register            - Register page
/about               - About page
/contact             - Contact page
/faq                 - FAQ page
/privacy             - Privacy policy
/terms               - Terms of service

// User Routes (Protected)
/user/dashboard      - User dashboard
/user/cart           - Shopping cart
/user/wishlist       - Wishlist
/user/orders         - Order history
/user/profile        - User profile

// Vendor Routes (Protected)
/vendor/dashboard    - Vendor dashboard
/vendor/products     - My products
/vendor/products/add - Add product
/vendor/products/edit/:id - Edit product
/vendor/orders       - Vendor orders

// Admin Routes (Protected)
/admin/dashboard     - Admin dashboard
/admin/products      - Manage products
/admin/users         - Manage users
/admin/vendors       - Manage vendors
/admin/orders        - All orders
/orders/:id          - Order details
```

### 8.3 Protected Route Component (`frontend/src/utils/ProtectedRoute.jsx`)

```javascript
// Features:
- Checks user authentication
- Validates user role
- Redirects to login if not authenticated
- Redirects to home if wrong role
- Shows loader during auth check
```

---

## 9. ENVIRONMENT CONFIGURATION

### 9.1 Backend Environment Variables (`.env`)

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://admin_verra:verra%40111@cluster0.1qmwpyp.mongodb.net/verra

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=test_secret_key_here
```

### 9.2 Frontend Environment Variables (`.env`)

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Razorpay (loaded from backend response)
# RAZORPAY_KEY_ID is fetched from /api/payment/create-order
```

---

## 10. PACKAGE DEPENDENCIES

### 10.1 Backend Dependencies (`backend/package.json`)

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",           // Password hashing
    "cookie-parser": "^1.4.6",      // Parse cookies
    "cors": "^2.8.5",                // CORS middleware
    "dotenv": "^16.3.1",             // Environment variables
    "express": "^4.18.2",            // Web framework
    "express-mongo-sanitize": "^2.2.0", // NoSQL injection prevention
    "express-rate-limit": "^7.5.1",  // Rate limiting
    "express-validator": "^7.0.1",   // Input validation
    "helmet": "^7.1.0",              // Security headers
    "jsonwebtoken": "^9.0.2",        // JWT authentication
    "mongoose": "^8.0.3",            // MongoDB ODM
    "morgan": "^1.10.1",             // HTTP logging
    "razorpay": "^2.9.2",            // Payment gateway
    "winston": "^3.19.0",            // Logging
    "xss-clean": "^0.1.4"            // XSS prevention
  },
  "devDependencies": {
    "fast-check": "^3.15.0",         // Property-based testing
    "jest": "^29.7.0",               // Testing framework
    "nodemon": "^3.0.2",             // Auto-restart server
    "supertest": "^6.3.3"            // API testing
  }
}
```

### 10.2 Frontend Dependencies (`frontend/package.json`)

```json
{
  "dependencies": {
    "axios": "^1.13.6",              // HTTP client
    "react": "^19.2.4",              // UI library
    "react-dom": "^19.2.4",          // React DOM
    "react-router-dom": "^7.13.1",   // Routing
    "react-scripts": "5.0.1",        // Build scripts
    "web-vitals": "^2.1.4"           // Performance metrics
  },
  "devDependencies": {
    "autoprefixer": "^10.4.17",      // CSS autoprefixer
    "postcss": "^8.4.35",            // CSS processing
    "tailwindcss": "^3.4.1",         // Utility-first CSS
    "@testing-library/react": "^16.3.2", // React testing
    "@testing-library/jest-dom": "^6.9.1", // Jest matchers
    "@testing-library/user-event": "^13.5.0" // User event simulation
  }
}
```

---

## DESIGN SYSTEM

### Color Palette

```css
/* Tailwind Configuration */
colors: {
  background: '#0B0B0B',    /* Main background */
  card: '#111111',          /* Card background */
  border: '#1F1F1F',        /* Border color */
  primary: '#FFFFFF',       /* Primary text */
  secondary: '#A0A0A0',     /* Secondary text */
  gold: '#C6A75E',          /* Accent/brand color */
}
```

### Typography

```css
/* Font Families */
font-playfair: 'Playfair Display', serif;  /* Headings */
font-inter: 'Inter', sans-serif;           /* Body text */

/* Font Sizes */
- Hero: 6xl-8xl (72px-96px)
- Headings: 4xl-6xl (36px-60px)
- Body: base-lg (16px-18px)
- Small: sm-xs (12px-14px)
```

### Spacing & Layout

```css
/* Container */
max-width: 1280px (7xl)
padding: 4-8 (16px-32px)

/* Grid */
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

/* Gaps */
- Small: 4-6 (16px-24px)
- Medium: 8-12 (32px-48px)
- Large: 16-24 (64px-96px)
```

---

## API RESPONSE FORMATS

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "count": 10  // For list responses
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "stack": "..." // Only in development
}
```

### Product List Response

```json
{
  "success": true,
  "count": 25,
  "products": [
    {
      "_id": "...",
      "title": "Luxury Watch",
      "description": "...",
      "price": 50000,
      "category": "Watches",
      "images": ["url1", "url2"],
      "vendor": { "_id": "...", "name": "Vendor Name" },
      "stock": 10,
      "ratings": 4.5,
      "isApproved": true,
      "createdAt": "2026-03-05T..."
    }
  ]
}
```

### Cart Response

```json
{
  "success": true,
  "data": {
    "cart": [
      {
        "product": {
          "_id": "...",
          "title": "Product Name",
          "price": 25000,
          "images": ["url"]
        },
        "quantity": 2
      }
    ],
    "total": 50000
  }
}
```

---

## TEST CREDENTIALS

```javascript
// Admin Account
Email: admin@verra.com
Password: Admin123!@#
Role: admin

// Customer Account
Email: customer@verra.com
Password: Customer123!@#
Role: user

// Vendor Account
Email: vendor@verra.com
Password: Vendor123!@#
Role: vendor
```

---

## PROJECT STATISTICS

```
Total Files: 150+
Total Lines of Code: ~15,000

Backend:
- Models: 3 files (~400 lines)
- Controllers: 5 files (~1,200 lines)
- Routes: 6 files (~300 lines)
- Middleware: 4 files (~250 lines)
- Utils: 8 files (~400 lines)
- Tests: 20+ files (~2,500 lines)

Frontend:
- Pages: 25 files (~4,000 lines)
- Components: 20 files (~2,500 lines)
- Context: 4 files (~600 lines)
- Services: 5 files (~300 lines)
- Layouts: 4 files (~400 lines)

Documentation: 10+ files (~2,000 lines)
```

---

## DEPLOYMENT CHECKLIST

### Backend Deployment
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB URI
- [ ] Set secure JWT_SECRET
- [ ] Configure production Razorpay credentials
- [ ] Set CLIENT_URL to production frontend URL
- [ ] Enable HTTPS
- [ ] Configure production logging
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)

### Frontend Deployment
- [ ] Set REACT_APP_API_URL to production backend
- [ ] Build production bundle (npm run build)
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Set up SSL certificate
- [ ] Configure caching headers
- [ ] Test Razorpay integration

### Database
- [ ] Create production database
- [ ] Set up database backups
- [ ] Configure indexes
- [ ] Seed initial data (admin user)
- [ ] Set up monitoring

---

**END OF CODE REFERENCE**

*This document contains the complete codebase reference for the VERRA Luxury E-Commerce Platform. For implementation details, refer to the actual source files in the repository.*

*Last Updated: March 5, 2026*
*Version: 1.0.0*
*Total Documentation Lines: ~1,200*
