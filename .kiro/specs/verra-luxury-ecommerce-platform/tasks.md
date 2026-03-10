# Implementation Plan: VERRA Luxury E-Commerce Platform

## Overview

This implementation plan breaks down the VERRA luxury e-commerce platform into discrete, actionable coding tasks. The platform is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Razorpay payment integration. Tasks are organized to build incrementally, starting with backend infrastructure, then core features, and finally frontend implementation.

The implementation follows a bottom-up approach: database models → authentication → business logic → API endpoints → frontend services → UI components → integration.

## Tasks

- [x] 1. Backend project initialization and configuration
  - [x] 1.1 Initialize Node.js project and install dependencies
    - Create backend directory and initialize npm project
    - Install core dependencies: express, mongoose, bcryptjs, jsonwebtoken, cookie-parser, dotenv, cors
    - Install dev dependencies: nodemon, jest, supertest, fast-check
    - Create package.json scripts for dev, start, and test
    - _Requirements: System Architecture_

  - [x] 1.2 Configure MongoDB connection
    - Create config/db.js with MongoDB connection logic
    - Implement connection error handling and retry logic
    - Add connection success/failure logging
    - _Requirements: System Architecture_

  - [x] 1.3 Set up Express server with middleware
    - Create server.js with Express app initialization
    - Configure body-parser for JSON requests
    - Configure cookie-parser for HttpOnly cookies
    - Configure CORS with credentials support
    - Set up express-mongo-sanitize for NoSQL injection prevention
    - Set up xss-clean for XSS protection
    - Add request logging middleware
    - _Requirements: 13.1, 13.2_

  - [x] 1.4 Configure Razorpay instance
    - Create config/razorpay.js with Razorpay initialization
    - Load Razorpay key ID and secret from environment variables
    - Export configured Razorpay instance
    - _Requirements: 8.1_

  - [x] 1.5 Create environment configuration template
    - Create .env.example with all required environment variables
    - Document each variable's purpose and format
    - Include MongoDB URI, JWT secret, Razorpay keys, port, and CORS settings
    - _Requirements: System Architecture_


- [x] 2. Database models implementation
  - [x] 2.1 Create User model with validation and bcrypt integration
    - Define User schema with name, email, password, role, isBlocked, cart, wishlist fields
    - Add field validation (email format, password length, role enum)
    - Implement pre-save hook for password hashing with bcrypt (10 salt rounds)
    - Implement comparePassword method for password verification
    - Add timestamps and indexes
    - _Requirements: 1.1, 1.5, 1.6, 1.7, 2.1_

  - [ ]* 2.2 Write property test for User model password hashing
    - **Property 1: User Registration Creates Hashed Account**
    - **Validates: Requirements 1.1, 1.5**

  - [x] 2.3 Create Product model with validation
    - Define Product schema with title, description, price, category, images, vendor, stock, ratings, isApproved fields
    - Add field validation (title length, price minimum, category enum, images array length)
    - Add text indexes for search functionality (title, description)
    - Add indexes for filtering (category, isApproved, vendor)
    - Add timestamps
    - _Requirements: 3.1, 3.4, 5.3_

  - [ ]* 2.4 Write property test for Product model validation
    - **Property 9: Product Creation Stores All Fields**
    - **Validates: Requirements 3.1, 3.4**

  - [x] 2.5 Create Order model with relationships
    - Define Order schema with user, products array, totalAmount, paymentStatus, orderStatus, Razorpay fields, shippingAddress
    - Add field validation (status enums, amount minimum)
    - Add indexes for user order history and vendor order filtering
    - Add timestamps
    - _Requirements: 8.6, 9.1, 9.3, 9.4_

  - [ ]* 2.6 Write property test for Order model structure
    - **Property 25: Verified Payment Creates Order**
    - **Validates: Requirements 8.6, 9.1**

- [x] 3. Authentication utilities and middleware
  - [x] 3.1 Create JWT token generation utility
    - Create utils/generateToken.js with token generation function
    - Implement setTokenCookie function with HttpOnly, secure, sameSite options
    - Configure token expiration (7 days default)
    - _Requirements: 1.2_

  - [x] 3.2 Create authentication middleware
    - Create middleware/authMiddleware.js with protect function
    - Extract JWT token from HttpOnly cookie
    - Verify token signature and expiration
    - Fetch user from database and attach to request object
    - Check if user is blocked
    - Handle JWT errors (invalid token, expired token)
    - _Requirements: 1.2, 2.2, 11.4_

  - [ ]* 3.3 Write property test for authentication middleware
    - **Property 2: Login Returns JWT in HttpOnly Cookie**
    - **Validates: Requirements 1.2**

  - [x] 3.4 Create role-based authorization middleware
    - Create middleware/roleMiddleware.js with authorize function
    - Accept array of allowed roles as parameter
    - Verify user role matches allowed roles
    - Return 403 for unauthorized roles
    - _Requirements: 2.3, 2.6_

  - [ ]* 3.5 Write property test for role-based authorization
    - **Property 8: Protected Endpoint Role Verification**
    - **Validates: Requirements 2.3, 13.5**


- [x] 4. Input validation and error handling
  - [x] 4.1 Create validation middleware
    - Create middleware/validateMiddleware.js with validation rules
    - Implement validateRegistration rules (name, email, password, role)
    - Implement validateProduct rules (title, description, price, category, images, stock)
    - Implement validateObjectId rule for MongoDB IDs
    - Implement checkValidation middleware to process validation results
    - _Requirements: 13.1, 13.6_

  - [ ]* 4.2 Write property tests for validation rules
    - **Property 5: Invalid Email Format Rejected**
    - **Property 6: Short Password Rejected**
    - **Validates: Requirements 1.6, 1.7, 12.2**

  - [x] 4.3 Create global error handler middleware
    - Create middleware/errorMiddleware.js with error handler
    - Handle Mongoose validation errors (400)
    - Handle duplicate key errors (400)
    - Handle cast errors for invalid ObjectIds (404)
    - Handle JWT errors (401)
    - Return consistent error response format
    - Prevent sensitive error exposure in production
    - _Requirements: 13.3, 13.4, 13.5, 13.6_

  - [x] 4.4 Create input sanitization utilities
    - Create utils/sanitize.js with sanitization functions
    - Implement sanitizeInput function for XSS prevention
    - Export middleware setup function for mongo-sanitize and xss-clean
    - _Requirements: 13.2_

  - [x] 4.5 Create async error wrapper utility
    - Create utils/asyncHandler.js with async wrapper function
    - Wrap async route handlers to catch errors and pass to error middleware
    - _Requirements: Error Handling_

- [x] 5. Authentication controller and routes
  - [x] 5.1 Create authentication controller
    - Create controllers/authController.js with register, login, logout, getMe functions
    - Implement register: validate input, check duplicate email, hash password, create user, return success
    - Implement login: validate credentials, compare password, generate JWT, set cookie, return user data
    - Implement logout: clear HttpOnly cookie, return success
    - Implement getMe: return current authenticated user data
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 5.2 Write property tests for authentication controller
    - **Property 3: Login-Logout Round Trip Clears Authentication**
    - **Property 4: Duplicate Email Registration Rejected**
    - **Property 33: Authentication Failure Returns 401**
    - **Validates: Requirements 1.3, 1.4, 13.4**

  - [x] 5.3 Create authentication routes
    - Create routes/authRoutes.js with route definitions
    - POST /api/auth/register with validation middleware
    - POST /api/auth/login with validation middleware
    - POST /api/auth/logout with protect middleware
    - GET /api/auth/me with protect middleware
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 5.4 Write unit tests for authentication routes
    - Test successful registration with valid data
    - Test registration with invalid email format
    - Test registration with short password
    - Test successful login with correct credentials
    - Test login with wrong password
    - Test logout clears cookie
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7_


- [x] 6. Checkpoint - Verify authentication system
  - Ensure all tests pass for authentication
  - Test registration, login, and logout flows manually
  - Verify JWT tokens are set in HttpOnly cookies
  - Ask the user if questions arise

- [x] 7. Product controller and routes
  - [x] 7.1 Create product controller for public endpoints
    - Create controllers/productController.js
    - Implement getAllProducts: return approved products with optional category filter
    - Implement getProductById: return single product details
    - Implement searchProducts: search by title/description using text index
    - _Requirements: 4.2, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.2 Write property tests for product filtering
    - **Property 12: Public Product Filtering by Approval**
    - **Property 13: Category Filtering Accuracy**
    - **Property 14: Search Query Matching**
    - **Validates: Requirements 4.2, 5.1, 5.2, 5.3**

  - [x] 7.3 Create product controller for vendor endpoints
    - Implement createProduct: create product with vendor reference, set isApproved=false
    - Implement updateProduct: update only if product.vendor matches req.user._id
    - Implement deleteProduct: delete only if product.vendor matches req.user._id
    - Implement getMyProducts: return products where vendor equals req.user._id
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 7.4 Write property tests for vendor product ownership
    - **Property 10: Vendor Product Ownership Enforcement**
    - **Validates: Requirements 3.2, 3.3**

  - [x] 7.5 Create product controller for admin endpoints
    - Implement getAllProductsAdmin: return all products regardless of approval status
    - Implement approveProduct: update isApproved field for any product
    - _Requirements: 4.1, 4.3_

  - [ ]* 7.6 Write property test for admin product approval
    - **Property 11: Admin Product Approval Toggle**
    - **Validates: Requirements 4.1**

  - [x] 7.7 Create product routes
    - Create routes/productRoutes.js with route definitions
    - GET /api/products (public)
    - GET /api/products/search (public)
    - GET /api/products/:id (public)
    - POST /api/products (vendor only, with validation)
    - PUT /api/products/:id (vendor only, with validation)
    - DELETE /api/products/:id (vendor only)
    - GET /api/products/vendor/my-products (vendor only)
    - GET /api/products/admin/all (admin only)
    - PUT /api/products/admin/approve/:id (admin only)
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 5.1, 5.2, 5.3_

  - [ ]* 7.8 Write unit tests for product routes
    - Test public product listing returns only approved products
    - Test category filtering
    - Test search functionality
    - Test vendor can create product
    - Test vendor cannot update other vendor's product
    - Test admin can approve/reject products
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2, 5.3_


- [x] 8. User profile and cart management
  - [x] 8.1 Create user controller for profile management
    - Create controllers/userController.js
    - Implement getProfile: return current user profile data
    - Implement updateProfile: update name and email with validation
    - Prevent role field modification by users
    - Check for duplicate email on update
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 8.2 Write property tests for profile management
    - **Property 31: Profile Update Persistence**
    - **Property 32: Role Field Immutability for Self**
    - **Validates: Requirements 12.1, 12.5**

  - [x] 8.3 Create user controller for cart operations
    - Implement addToCart: add product and quantity to user's cart array
    - Validate product exists and stock is sufficient
    - Update quantity if product already in cart
    - Implement updateCart: modify quantity for existing cart item
    - Implement removeFromCart: remove product from cart array
    - Implement getCart: return user's cart with populated product details
    - Calculate cart total
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 8.4 Write property tests for cart operations
    - **Property 15: Cart Addition Stores Product and Quantity**
    - **Property 16: Cart Quantity Update Modifies Existing Item**
    - **Property 17: Cart Removal Deletes Product**
    - **Property 18: Cart Total Calculation Accuracy**
    - **Property 19: Cart Stock Validation**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.6**

  - [x] 8.5 Create user controller for wishlist operations
    - Implement addToWishlist: add product reference to wishlist array
    - Prevent duplicate products in wishlist
    - Implement removeFromWishlist: remove product reference from wishlist
    - Implement getWishlist: return wishlist with populated product details
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 8.6 Write property tests for wishlist operations
    - **Property 20: Wishlist Addition Stores Product Reference**
    - **Property 21: Wishlist Removal Deletes Product Reference**
    - **Property 22: Wishlist Uniqueness Constraint**
    - **Validates: Requirements 7.1, 7.2, 7.4**

  - [x] 8.7 Create user routes
    - Create routes/userRoutes.js with route definitions
    - GET /api/users/profile (all authenticated users)
    - PUT /api/users/profile (all authenticated users)
    - POST /api/users/cart/add (user role only)
    - PUT /api/users/cart/update (user role only)
    - DELETE /api/users/cart/remove/:productId (user role only)
    - GET /api/users/cart (user role only)
    - POST /api/users/wishlist/add (user role only)
    - DELETE /api/users/wishlist/remove/:productId (user role only)
    - GET /api/users/wishlist (user role only)
    - _Requirements: 6.1, 6.2, 6.3, 7.1, 7.2, 12.1_

  - [ ]* 8.8 Write unit tests for user routes
    - Test profile retrieval and update
    - Test cart add, update, remove operations
    - Test cart stock validation
    - Test wishlist add and remove operations
    - Test wishlist duplicate prevention
    - _Requirements: 6.1, 6.2, 6.3, 6.6, 7.1, 7.2, 7.4, 12.1_


- [x] 9. Payment integration with Razorpay
  - [x] 9.1 Create payment signature verification utility
    - Create utils/verifyPayment.js
    - Implement verifyRazorpaySignature function
    - Use crypto.createHmac with sha256 algorithm
    - Verify signature matches expected hash of "orderId|paymentId"
    - _Requirements: 8.4, 8.5_

  - [ ]* 9.2 Write property tests for payment signature verification
    - **Property 23: Payment Signature Verification Accuracy**
    - **Property 24: Invalid Payment Signature Rejection**
    - **Validates: Requirements 8.4, 8.5**

  - [x] 9.3 Create payment controller
    - Create controllers/paymentController.js
    - Implement createRazorpayOrder: create Razorpay order with amount in paise
    - Return order ID, amount, currency, and Razorpay key to frontend
    - Implement verifyPayment: verify signature, validate cart items, check stock
    - Calculate total amount from cart items
    - Create order record with payment details
    - Update product stock quantities
    - Clear user's cart after successful payment
    - Handle payment verification failures
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 16.1_

  - [ ]* 9.4 Write property test for payment verification and order creation
    - **Property 34: Stock Decrease After Order Completion**
    - **Validates: Requirements 16.1**

  - [x] 9.5 Create payment routes
    - Create routes/paymentRoutes.js
    - POST /api/payment/create-order (user role only)
    - POST /api/payment/verify (user role only)
    - _Requirements: 8.1, 8.4_

  - [ ]* 9.6 Write unit tests for payment routes
    - Test Razorpay order creation
    - Test payment verification with valid signature
    - Test payment verification with invalid signature
    - Test stock update after payment
    - Test cart clearing after payment
    - _Requirements: 8.1, 8.4, 8.5, 8.6, 16.1_

- [x] 10. Checkpoint - Verify payment integration
  - Ensure all payment tests pass
  - Test Razorpay order creation and verification flow
  - Verify stock updates and cart clearing
  - Ask the user if questions arise


- [x] 11. Order management system
  - [x] 11.1 Create order controller for user operations
    - Create controllers/orderController.js
    - Implement createOrder: create order record after payment verification (called from payment controller)
    - Implement getMyOrders: return orders where user equals req.user._id
    - Implement getOrderById: return single order details if user owns it
    - Sort orders by creation date (newest first)
    - _Requirements: 9.1, 9.2, 9.4, 9.5_

  - [ ]* 11.2 Write property tests for order operations
    - **Property 26: User Order History Isolation**
    - **Property 27: Order Initial Status**
    - **Validates: Requirements 9.2, 9.4**

  - [x] 11.3 Create order controller for vendor operations
    - Implement getVendorOrders: return orders containing products where vendor equals req.user._id
    - Filter and return only relevant product items from each order
    - Calculate vendor-specific totals
    - _Requirements: 10.5_

  - [x] 11.4 Create order controller for admin operations
    - Implement getAllOrders: return all orders across platform
    - Implement updateOrderStatus: update order status (pending, confirmed, shipped, delivered, cancelled)
    - _Requirements: 9.3, 11.6_

  - [x] 11.5 Create order routes
    - Create routes/orderRoutes.js
    - POST /api/orders/create (user role only)
    - GET /api/orders/my-orders (user role only)
    - GET /api/orders/:id (user role only)
    - GET /api/orders/vendor/my-orders (vendor role only)
    - GET /api/orders/admin/all (admin role only)
    - PUT /api/orders/admin/status/:id (admin role only)
    - _Requirements: 9.1, 9.2, 9.3, 10.5, 11.6_

  - [ ]* 11.6 Write unit tests for order routes
    - Test user can view their own orders
    - Test user cannot view other user's orders
    - Test vendor sees only orders with their products
    - Test admin can view all orders
    - Test admin can update order status
    - _Requirements: 9.2, 9.3, 10.5, 11.6_

- [x] 12. Analytics and admin dashboard
  - [x] 12.1 Create admin controller for platform statistics
    - Create controllers/adminController.js
    - Implement getDashboardStats: count total users, vendors, orders
    - Implement getAllUsers: return all users with role 'user'
    - Implement getAllVendors: return all users with role 'vendor'
    - Implement blockUser: toggle isBlocked field for user account
    - Implement getTotalRevenue: sum totalAmount from all completed orders
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 12.2 Write property test for admin user blocking
    - **Property 30: Admin User Blocking Prevents Login**
    - **Validates: Requirements 11.4**

  - [x] 12.3 Create vendor analytics functions
    - Add getVendorStats function to calculate sales count and earnings
    - Count orders containing vendor's products with paymentStatus='completed'
    - Sum (price × quantity) for vendor's products in completed orders
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 12.4 Write property tests for vendor analytics
    - **Property 28: Vendor Sales Count Accuracy**
    - **Property 29: Vendor Earnings Calculation**
    - **Validates: Requirements 10.1, 10.2, 10.4**

  - [x] 12.5 Create admin routes
    - Create routes/adminRoutes.js
    - GET /api/admin/dashboard (admin role only)
    - GET /api/admin/users (admin role only)
    - GET /api/admin/vendors (admin role only)
    - PUT /api/admin/users/block/:id (admin role only)
    - GET /api/admin/revenue (admin role only)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 12.6 Write unit tests for admin routes
    - Test dashboard statistics retrieval
    - Test user and vendor listing
    - Test user blocking functionality
    - Test revenue calculation
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_


- [x] 13. Backend integration and server setup
  - [x] 13.1 Wire all routes to Express app
    - Import all route modules in server.js
    - Mount routes: /api/auth, /api/products, /api/users, /api/orders, /api/payment, /api/admin
    - Add global error handler as last middleware
    - _Requirements: System Architecture_

  - [x] 13.2 Create test database setup utilities
    - Create tests/setup.js with database connection helpers
    - Implement connectDB, closeDB, clearDB functions for testing
    - Configure test database connection
    - _Requirements: Testing Strategy_

  - [x] 13.3 Configure Jest for backend testing
    - Create jest.config.js with Node environment
    - Configure test scripts in package.json
    - Set up test coverage thresholds
    - _Requirements: Testing Strategy_

  - [ ]* 13.4 Write integration tests for complete user flows
    - Test complete registration → login → browse → add to cart → checkout → order flow
    - Test vendor flow: register → login → create product → view analytics
    - Test admin flow: login → approve product → view dashboard → block user
    - _Requirements: All Requirements_

- [x] 14. Checkpoint - Verify complete backend functionality
  - Run all unit tests and ensure they pass
  - Run all property tests and ensure they pass
  - Run all integration tests and ensure they pass
  - Test all API endpoints manually using Postman or similar tool
  - Verify error handling and validation
  - Ask the user if questions arise

- [x] 15. Frontend project initialization
  - [x] 15.1 Initialize React project with Create React App
    - Create frontend directory
    - Initialize React app with TypeScript support (optional) or JavaScript
    - Install dependencies: react-router-dom, axios
    - Install Tailwind CSS and configure
    - _Requirements: System Architecture_

  - [x] 15.2 Configure Tailwind CSS with custom theme
    - Create tailwind.config.js with dark luxury theme
    - Configure colors: dark backgrounds (#0A0A0A, #1A1A1A), gold accent (#C6A75E)
    - Configure fonts: Playfair Display for headings, Inter for body
    - Add custom animations and transitions
    - Create index.css with Tailwind imports and custom styles
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 15.3 Set up React Router structure
    - Install react-router-dom v6
    - Create basic App.jsx with BrowserRouter
    - Define route structure for public, user, vendor, and admin sections
    - _Requirements: 2.5_

  - [x] 15.4 Create environment configuration
    - Create .env file with REACT_APP_API_URL and REACT_APP_RAZORPAY_KEY_ID
    - Create .env.example template
    - _Requirements: System Architecture_


- [x] 16. Frontend services and API integration
  - [x] 16.1 Create Axios API service configuration
    - Create services/api.js with Axios instance
    - Configure baseURL from environment variable
    - Enable withCredentials for cookie support
    - Add response interceptor for error handling
    - Handle 401 errors with redirect to login
    - _Requirements: System Architecture_

  - [x] 16.2 Create authentication service
    - Create services/authService.js
    - Implement register, login, logout, getCurrentUser functions
    - Use api instance for all requests
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 16.3 Create product service
    - Create services/productService.js
    - Implement getAllProducts, getProductById, searchProducts (public)
    - Implement createProduct, updateProduct, deleteProduct, getMyProducts (vendor)
    - Implement getAllProductsAdmin, approveProduct (admin)
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 5.1, 5.2, 5.3_

  - [x] 16.4 Create user service
    - Create services/userService.js
    - Implement profile management functions
    - Implement cart operations (add, update, remove, get)
    - Implement wishlist operations (add, remove, get)
    - _Requirements: 6.1, 6.2, 6.3, 7.1, 7.2, 12.1_

  - [x] 16.5 Create order service
    - Create services/orderService.js
    - Implement getMyOrders, getOrderById (user)
    - Implement getVendorOrders (vendor)
    - Implement getAllOrders, updateOrderStatus (admin)
    - _Requirements: 9.2, 9.5, 10.5, 11.6_

  - [x] 16.6 Create payment service
    - Create services/paymentService.js
    - Implement createOrder and verifyPayment functions
    - _Requirements: 8.1, 8.4_

  - [x] 16.7 Create admin service
    - Create services/adminService.js
    - Implement getDashboardStats, getAllUsers, getAllVendors, blockUser, getTotalRevenue
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 17. Context API state management
  - [x] 17.1 Create AuthContext for authentication state
    - Create context/AuthContext.jsx
    - Implement AuthProvider with user state, loading state
    - Implement login, register, logout, checkAuth functions
    - Use authService for API calls
    - Provide useAuth hook for consuming context
    - Check authentication on mount
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 17.2 Create CartContext for cart state
    - Create context/CartContext.jsx
    - Implement CartProvider with cart items state
    - Implement addToCart, updateCart, removeFromCart, clearCart functions
    - Calculate cart total
    - Provide useCart hook
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 17.3 Create ProductContext for product filtering state
    - Create context/ProductContext.jsx
    - Implement ProductProvider with filters state (category, search, sort)
    - Implement filter update functions
    - Provide useProduct hook
    - _Requirements: 5.2, 5.3, 5.5_


- [x] 18. Common UI components
  - [x] 18.1 Create Navbar component
    - Create components/common/Navbar.jsx
    - Display logo, navigation links, user menu
    - Show different links based on user role
    - Implement logout functionality
    - Style with dark luxury theme and gold accents
    - _Requirements: 14.1, 14.2_

  - [x] 18.2 Create Footer component
    - Create components/common/Footer.jsx
    - Display copyright, links, social media icons
    - Style with dark theme
    - _Requirements: 14.1_

  - [x] 18.3 Create Loader component
    - Create components/common/Loader.jsx
    - Animated loading spinner with gold color
    - _Requirements: 14.4_

  - [x] 18.4 Create ErrorMessage component
    - Create components/common/ErrorMessage.jsx
    - Display error messages with styling
    - _Requirements: 13.6_

  - [x] 18.5 Create Button component
    - Create components/common/Button.jsx
    - Reusable button with variants (primary, secondary, danger)
    - Gold accent for primary buttons
    - Hover and active states with animations
    - _Requirements: 14.2, 14.4_

  - [x] 18.6 Create Input component
    - Create components/common/Input.jsx
    - Reusable form input with label and error display
    - Dark theme styling with gold focus border
    - _Requirements: 14.1, 14.2_

- [x] 19. Product components
  - [x] 19.1 Create ProductCard component
    - Create components/product/ProductCard.jsx
    - Display product image, title, price, rating
    - Add to cart and wishlist buttons
    - Link to product detail page
    - Hover effects and animations
    - _Requirements: 5.4, 14.4_

  - [x] 19.2 Create ProductGrid component
    - Create components/product/ProductGrid.jsx
    - Display grid of ProductCard components
    - Responsive layout (1-4 columns based on screen size)
    - _Requirements: 5.1_

  - [x] 19.3 Create ProductDetails component
    - Create components/product/ProductDetails.jsx
    - Display full product information with image gallery
    - Quantity selector and add to cart button
    - Add to wishlist button
    - Product description and specifications
    - _Requirements: 5.4_

  - [x] 19.4 Create ProductFilter component
    - Create components/product/ProductFilter.jsx
    - Category filter dropdown
    - Price range filter
    - Sort options (price, rating, newest)
    - _Requirements: 5.2, 5.5_

  - [x] 19.5 Create SearchBar component
    - Create components/product/SearchBar.jsx
    - Search input with icon
    - Trigger search on enter or button click
    - _Requirements: 5.3_


- [x] 20. Cart and wishlist components
  - [x] 20.1 Create CartItem component
    - Create components/cart/CartItem.jsx
    - Display product image, title, price, quantity
    - Quantity update controls (increment/decrement)
    - Remove from cart button
    - Calculate item subtotal
    - _Requirements: 6.2, 6.3, 6.5_

  - [x] 20.2 Create CartSummary component
    - Create components/cart/CartSummary.jsx
    - Display cart total, tax, shipping (if applicable)
    - Proceed to payment button
    - _Requirements: 6.4_

  - [x] 20.3 Create WishlistItem component
    - Create components/wishlist/WishlistItem.jsx
    - Display product image, title, price
    - Move to cart button
    - Remove from wishlist button
    - _Requirements: 7.2, 7.3_

- [x] 21. Dashboard components
  - [x] 21.1 Create StatCard component
    - Create components/dashboard/StatCard.jsx
    - Display statistic with icon, label, and value
    - Reusable for different dashboard metrics
    - Gold accent styling
    - _Requirements: 10.1, 10.2, 11.1_

  - [x] 21.2 Create OrderTable component
    - Create components/dashboard/OrderTable.jsx
    - Display orders in table format
    - Show order ID, date, total, status
    - Clickable rows for order details
    - Status badges with color coding
    - _Requirements: 9.2, 9.5, 10.5_

  - [x] 21.3 Create ProductTable component
    - Create components/dashboard/ProductTable.jsx
    - Display products in table format
    - Show title, price, stock, approval status
    - Action buttons (edit, delete, approve/reject)
    - _Requirements: 3.5, 4.4_

  - [x] 21.4 Create UserTable component
    - Create components/dashboard/UserTable.jsx
    - Display users in table format
    - Show name, email, role, status
    - Block/unblock action button
    - _Requirements: 11.2, 11.3, 11.4_

- [x] 22. Protected route component
  - [x] 22.1 Create ProtectedRoute component
    - Create utils/ProtectedRoute.jsx
    - Check if user is authenticated using AuthContext
    - Check if user role matches allowedRoles prop
    - Redirect to login if not authenticated
    - Redirect to home if role doesn't match
    - Show loader while checking authentication
    - _Requirements: 2.3, 2.5_

  - [ ]* 22.2 Write property test for role-based routing
    - **Property 7: User Role Assignment Validity**
    - **Validates: Requirements 2.1**


- [x] 23. Layout components
  - [x] 23.1 Create PublicLayout component
    - Create layouts/PublicLayout.jsx
    - Include Navbar and Footer
    - Render children (Outlet from react-router)
    - _Requirements: System Architecture_

  - [x] 23.2 Create UserLayout component
    - Create layouts/UserLayout.jsx
    - Include user-specific Navbar with cart icon
    - Sidebar with user navigation links
    - Render children (Outlet)
    - _Requirements: 2.5_

  - [x] 23.3 Create VendorLayout component
    - Create layouts/VendorLayout.jsx
    - Include vendor-specific Navbar
    - Sidebar with vendor navigation links
    - Render children (Outlet)
    - _Requirements: 2.5_

  - [x] 23.4 Create AdminLayout component
    - Create layouts/AdminLayout.jsx
    - Include admin-specific Navbar
    - Sidebar with admin navigation links
    - Render children (Outlet)
    - _Requirements: 2.5_

- [x] 24. Public pages
  - [x] 24.1 Create Home page
    - Create pages/public/Home.jsx
    - Hero section with luxury branding
    - Featured categories grid
    - Trending products section
    - Call-to-action sections
    - Dark luxury styling with gold accents
    - _Requirements: 14.1, 14.2, 14.3_

  - [x] 24.2 Create Products page
    - Create pages/public/Products.jsx
    - ProductFilter component for filtering
    - SearchBar component for search
    - ProductGrid component for product display
    - Pagination or infinite scroll
    - Fetch products from API on mount and filter changes
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [x] 24.3 Create ProductDetail page
    - Create pages/public/ProductDetail.jsx
    - ProductDetails component
    - Fetch product by ID from URL params
    - Add to cart functionality
    - Add to wishlist functionality
    - Related products section
    - _Requirements: 5.4, 6.1, 7.1_

  - [x] 24.4 Create Login page
    - Create pages/public/Login.jsx
    - Login form with email and password inputs
    - Submit handler using AuthContext login function
    - Error message display
    - Link to register page
    - Redirect to role-specific dashboard on success
    - Dark luxury styling
    - _Requirements: 1.2, 14.1, 14.2_

  - [x] 24.5 Create Register page
    - Create pages/public/Register.jsx
    - Registration form with name, email, password, role inputs
    - Submit handler using AuthContext register function
    - Form validation
    - Error message display
    - Link to login page
    - Redirect to login on success
    - _Requirements: 1.1, 14.1, 14.2_


- [x] 25. User dashboard pages
  - [x] 25.1 Create UserDashboard page
    - Create pages/user/UserDashboard.jsx
    - Display welcome message with user name
    - StatCard components for order count, wishlist count
    - Recent orders section with OrderTable
    - Quick links to cart, wishlist, orders
    - _Requirements: 2.5_

  - [x] 25.2 Create Cart page
    - Create pages/user/Cart.jsx
    - Display CartItem components for each cart item
    - CartSummary component with total and checkout button
    - Handle quantity updates and item removal
    - Integrate Razorpay payment on checkout
    - Redirect to orders page on successful payment
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.3_

  - [x] 25.3 Create Wishlist page
    - Create pages/user/Wishlist.jsx
    - Display WishlistItem components for each wishlist item
    - Handle move to cart and remove from wishlist
    - Empty state message if wishlist is empty
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 25.4 Create Orders page
    - Create pages/user/Orders.jsx
    - Display OrderTable with user's order history
    - Fetch orders from API on mount
    - Order detail modal or link to detail page
    - Filter by order status
    - _Requirements: 9.2, 9.5_

  - [x] 25.5 Create Profile page
    - Create pages/user/Profile.jsx
    - Display current profile information
    - Edit form for name and email
    - Submit handler to update profile
    - Success and error message display
    - _Requirements: 12.1, 12.4_

- [x] 26. Vendor dashboard pages
  - [x] 26.1 Create VendorDashboard page
    - Create pages/vendor/VendorDashboard.jsx
    - StatCard components for total products, sales count, total earnings
    - Fetch vendor analytics from API
    - Recent orders section
    - Quick links to products and orders
    - _Requirements: 2.5, 10.1, 10.2, 10.3, 10.4_

  - [x] 26.2 Create MyProducts page
    - Create pages/vendor/MyProducts.jsx
    - ProductTable component with vendor's products
    - Fetch vendor products from API on mount
    - Edit and delete action buttons
    - Add new product button linking to AddProduct page
    - Approval status indicator for each product
    - _Requirements: 3.5, 4.4_

  - [x] 26.3 Create AddProduct page
    - Create pages/vendor/AddProduct.jsx
    - Product form with title, description, price, category, images, stock inputs
    - Image upload handling (URL input or file upload)
    - Form validation
    - Submit handler using productService.createProduct
    - Redirect to MyProducts on success
    - _Requirements: 3.1_

  - [x] 26.4 Create EditProduct page
    - Create pages/vendor/EditProduct.jsx
    - Pre-populate form with existing product data
    - Fetch product by ID from URL params
    - Update handler using productService.updateProduct
    - Redirect to MyProducts on success
    - _Requirements: 3.2_

  - [x] 26.5 Create VendorOrders page
    - Create pages/vendor/VendorOrders.jsx
    - OrderTable component with orders containing vendor's products
    - Fetch vendor orders from API on mount
    - Display only items from vendor's products in each order
    - _Requirements: 10.5_


- [x] 27. Admin dashboard pages
  - [x] 27.1 Create AdminDashboard page
    - Create pages/admin/AdminDashboard.jsx
    - StatCard components for total users, vendors, orders, revenue
    - Fetch dashboard statistics from API
    - Charts for revenue trends (optional)
    - Recent activity section
    - _Requirements: 2.5, 11.1, 11.5_

  - [x] 27.2 Create ManageProducts page
    - Create pages/admin/ManageProducts.jsx
    - ProductTable component with all products (approved and unapproved)
    - Fetch all products from admin API on mount
    - Approve/reject action buttons
    - Filter by approval status
    - _Requirements: 4.1, 4.3_

  - [x] 27.3 Create ManageUsers page
    - Create pages/admin/ManageUsers.jsx
    - UserTable component with all users (role='user')
    - Fetch users from API on mount
    - Block/unblock action buttons
    - Search and filter functionality
    - _Requirements: 11.2, 11.4_

  - [x] 27.4 Create ManageVendors page
    - Create pages/admin/ManageVendors.jsx
    - UserTable component with all vendors (role='vendor')
    - Fetch vendors from API on mount
    - Display product count for each vendor
    - Block/unblock action buttons
    - _Requirements: 11.3, 11.4_

  - [x] 27.5 Create AllOrders page
    - Create pages/admin/AllOrders.jsx
    - OrderTable component with all platform orders
    - Fetch all orders from API on mount
    - Update order status functionality
    - Filter by status, date range
    - Export to CSV functionality (optional)
    - _Requirements: 9.3, 11.6_

- [x] 28. Razorpay frontend integration
  - [x] 28.1 Add Razorpay script to index.html
    - Add Razorpay checkout script tag to public/index.html
    - _Requirements: 8.1_

  - [x] 28.2 Implement Razorpay checkout in Cart page
    - Create handlePayment function in Cart.jsx
    - Call paymentService.createOrder to get Razorpay order ID
    - Initialize Razorpay checkout with order details
    - Configure payment handler to verify payment on backend
    - Handle payment success and failure
    - Clear cart and redirect on success
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_

- [x] 29. Checkpoint - Verify frontend functionality
  - Test all public pages (home, products, login, register)
  - Test user dashboard and all user pages
  - Test vendor dashboard and all vendor pages
  - Test admin dashboard and all admin pages
  - Verify role-based routing and access control
  - Test cart and wishlist operations
  - Test Razorpay payment integration (use test mode)
  - Ask the user if questions arise


- [x] 30. UI polish and responsive design
  - [x] 30.1 Implement responsive design for all components
    - Ensure all components work on mobile, tablet, and desktop
    - Use Tailwind responsive classes (sm:, md:, lg:, xl:)
    - Test navigation menu on mobile (hamburger menu)
    - Test product grid responsiveness
    - Test dashboard layouts on different screen sizes
    - _Requirements: 14.5_

  - [x] 30.2 Add loading states to all async operations
    - Show Loader component during API calls
    - Disable buttons during form submission
    - Add skeleton loaders for product cards and tables
    - _Requirements: User Experience_

  - [x] 30.3 Add animations and transitions
    - Page transition animations
    - Button hover effects
    - Card hover effects with scale and shadow
    - Modal fade-in animations
    - Smooth scroll behavior
    - _Requirements: 14.4_

  - [x] 30.4 Implement error handling and user feedback
    - Display error messages for failed API calls
    - Show success messages for completed actions
    - Add toast notifications for cart/wishlist actions
    - Form validation error messages
    - _Requirements: 13.6_

  - [x] 30.5 Optimize images and assets
    - Compress product images
    - Use lazy loading for images
    - Add image placeholders
    - Optimize logo and icons
    - _Requirements: Performance_

  - [x] 30.6 Add accessibility features
    - Ensure proper heading hierarchy
    - Add ARIA labels to interactive elements
    - Ensure keyboard navigation works
    - Add alt text to all images
    - Ensure sufficient color contrast
    - _Requirements: Accessibility_

- [x] 31. Testing and quality assurance
  - [ ]* 31.1 Write frontend component tests
    - Test ProductCard component rendering
    - Test CartItem component interactions
    - Test form validation in Login and Register pages
    - Test ProtectedRoute component behavior
    - _Requirements: Testing Strategy_

  - [ ]* 31.2 Write frontend integration tests
    - Test complete user registration and login flow
    - Test product browsing and search
    - Test add to cart and checkout flow
    - Test vendor product creation flow
    - _Requirements: Testing Strategy_

  - [x] 31.3 Perform manual testing of all features
    - Test all user stories from requirements document
    - Test edge cases and error scenarios
    - Test on different browsers (Chrome, Firefox, Safari)
    - Test on different devices (mobile, tablet, desktop)
    - _Requirements: All Requirements_

  - [x] 31.4 Run all backend tests and verify coverage
    - Run unit tests: npm run test:unit
    - Run property tests: npm run test:property
    - Run integration tests: npm run test:integration
    - Verify test coverage meets 80% threshold
    - _Requirements: Testing Strategy_


- [x] 32. Security hardening and production preparation
  - [x] 32.1 Implement rate limiting on backend
    - Install express-rate-limit package
    - Configure rate limiting for authentication endpoints
    - Configure rate limiting for API endpoints
    - Add rate limit configuration to environment variables
    - _Requirements: Security_

  - [x] 32.2 Add security headers with Helmet
    - Install helmet package
    - Configure helmet middleware in server.js
    - Set Content Security Policy
    - Enable HSTS, XSS protection, frame guard
    - _Requirements: Security_

  - [x] 32.3 Configure CORS for production
    - Update CORS configuration to allow only production frontend URL
    - Set credentials: true for cookie support
    - Configure allowed methods and headers
    - _Requirements: Security_

  - [x] 32.4 Secure environment variables
    - Ensure .env files are in .gitignore
    - Document all required environment variables
    - Use strong JWT secret (minimum 32 characters)
    - Use production Razorpay keys for production deployment
    - _Requirements: Security_

  - [x] 32.5 Add input sanitization and validation
    - Verify all user inputs are validated on backend
    - Ensure express-mongo-sanitize is active
    - Ensure xss-clean is active
    - Add validation for file uploads (if implemented)
    - _Requirements: 13.1, 13.2_

  - [x] 32.6 Configure MongoDB indexes for performance
    - Verify indexes are created for User.email
    - Verify indexes are created for Product (category, isApproved, vendor)
    - Verify text indexes for Product search
    - Verify indexes for Order queries
    - _Requirements: Performance_

- [x] 33. Documentation and deployment preparation
  - [x] 33.1 Create comprehensive README.md
    - Project overview and features
    - Technology stack
    - Installation instructions
    - Environment variable configuration
    - Running the application (development and production)
    - API documentation or link to API docs
    - Testing instructions
    - Deployment instructions
    - _Requirements: Documentation_

  - [x] 33.2 Create API documentation
    - Document all API endpoints with request/response examples
    - Use tools like Swagger/OpenAPI or Postman collection
    - Include authentication requirements for each endpoint
    - Include error response examples
    - _Requirements: Documentation_

  - [x] 33.3 Prepare deployment configuration
    - Create production build scripts
    - Configure environment for production (NODE_ENV=production)
    - Set up MongoDB Atlas or production database
    - Configure backend hosting (Heroku, AWS, DigitalOcean, etc.)
    - Configure frontend hosting (Vercel, Netlify, AWS S3, etc.)
    - Set up domain and SSL certificates
    - _Requirements: Deployment_

  - [x] 33.4 Set up monitoring and logging
    - Configure error logging (Winston or similar)
    - Set up application monitoring (optional: New Relic, Datadog)
    - Configure payment transaction logging
    - Set up alerts for critical errors
    - _Requirements: Monitoring_

- [x] 34. Final checkpoint and launch preparation
  - Run complete test suite (backend and frontend)
  - Perform security audit
  - Test production build locally
  - Verify all environment variables are configured
  - Test payment integration with Razorpay test mode
  - Perform load testing (optional)
  - Create backup and rollback plan
  - Ask the user if questions arise before deployment

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and integration points
- The implementation follows a bottom-up approach: backend first, then frontend
- All 34 correctness properties from the design document are covered in property test tasks
- The dark luxury UI theme with gold accents should be consistently applied across all components
- Razorpay integration should be thoroughly tested in test mode before production deployment

## Implementation Order

The tasks are designed to be executed sequentially, with some tasks within sections that can be parallelized:

1. **Backend Foundation** (Tasks 1-4): Set up project, models, middleware
2. **Backend Core Features** (Tasks 5-12): Authentication, products, cart, payment, orders, admin
3. **Backend Integration** (Tasks 13-14): Wire everything together and test
4. **Frontend Foundation** (Tasks 15-17): Set up project, services, context
5. **Frontend Components** (Tasks 18-22): Build reusable UI components
6. **Frontend Pages** (Tasks 23-27): Build all pages for public, user, vendor, admin
7. **Frontend Integration** (Tasks 28-29): Razorpay integration and testing
8. **Polish and Testing** (Tasks 30-31): UI polish, responsive design, comprehensive testing
9. **Production Preparation** (Tasks 32-34): Security, documentation, deployment

## Success Criteria

The implementation is complete when:
- All non-optional tasks are completed
- All unit tests pass
- All property tests pass (if implemented)
- All integration tests pass
- Manual testing confirms all user stories work as expected
- The application is deployed and accessible
- Documentation is complete and accurate
