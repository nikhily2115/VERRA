# VERRA Backend Tests

## Test Structure

The backend has three types of tests:

1. **Unit Tests** (`tests/unit/`): Test individual components in isolation
2. **Integration Tests** (`tests/integration/`): Test complete workflows and API endpoints
3. **Property-Based Tests** (`tests/property/`): Test universal properties using fast-check
4. **Quick API Tests** (root `tests/` directory): Simple verification tests for manual testing

## Running Tests

### Jest-Based Tests (Recommended)

```bash
# Run all Jest tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only property-based tests
npm run test:property

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch

# Run specific test file
npm test -- --testPathPattern=unit/user.model.test.js
```

### Quick API Tests (Manual Testing)

These tests require the server to be running:

```bash
# Terminal 1: Start the server
npm run dev

# Terminal 2: Run API tests
npm run test:api

# Or run individual test files:
node tests/auth-api-test.js
node tests/product-api-test.js
node tests/product-admin-test.js
node tests/user-api-test.js
node tests/payment-api-test.js
node tests/order-api-test.js
node tests/admin-api-test.js
```

## Test Database

Tests use a separate test database to avoid affecting development data:
- Default: `verra-test` (appends `-test` to your MONGODB_URI)
- Custom: Set `TEST_MONGODB_URI` in your `.env` file

The test database is automatically:
- Connected before tests run
- Cleared before each test
- Closed after all tests complete

## Test Results

### Jest Tests

**Unit Tests** (9 tests):
- ✅ User model validation
- ✅ Password hashing
- ✅ Password comparison
- ✅ Duplicate email prevention

**Integration Tests** (7 tests):
- ✅ Complete registration → login → protected route → logout flow
- ✅ Duplicate email registration prevention
- ✅ Invalid password rejection
- ✅ Non-existent user rejection
- ✅ Admin role access control
- ✅ User role access control
- ✅ Blocked user login prevention

**Property-Based Tests** (6 test suites):
- ✅ Password hashing properties
- ✅ Duplicate email rejection properties
- ✅ Role assignment validity properties
- ✅ Invalid email format rejection properties
- ✅ Short password rejection properties

### Quick API Tests (67 tests)

**Phase 1: Backend Setup**
- ✅ Express server with security middleware
- ✅ MongoDB connection
- ✅ Razorpay configuration

**Phase 2: Database Models**
- ✅ User model with bcrypt password hashing
- ✅ Product model with validation rules
- ✅ Order model with relationships

**Phase 3: Authentication**
- ✅ JWT token generation and cookie management
- ✅ Authentication middleware (protect)
- ✅ Role-based authorization middleware (authorize)
- ✅ Blocked user detection

**Phase 4: Validation & Error Handling**
- ✅ Validation middleware for all input types
- ✅ Global error handler with proper status codes
- ✅ Input sanitization utilities
- ✅ Async error wrapper

**Phase 5: Authentication API**
- ✅ User registration with validation
- ✅ User login with JWT cookies
- ✅ Get current user (authenticated)
- ✅ User logout
- ✅ Invalid credentials rejection
- ✅ Validation error handling

**Phase 7: Product Management API**
- ✅ Vendor creates products (pending approval)
- ✅ Vendor views own products
- ✅ Vendor updates own products
- ✅ Vendor deletes own products
- ✅ Vendor ownership enforcement
- ✅ Public views only approved products
- ✅ Product search functionality
- ✅ Category filtering
- ✅ Product validation
- ✅ Admin views all products (including unapproved)
- ✅ Admin approves/rejects products
- ✅ Admin authorization enforcement
- ✅ Product approval workflow

**Phase 8: User Profile, Cart & Wishlist API**
- ✅ User profile retrieval
- ✅ User profile update with validation
- ✅ Role modification prevention
- ✅ Add product to cart
- ✅ Update cart quantity
- ✅ Get cart with total calculation
- ✅ Stock validation on cart operations
- ✅ Remove product from cart
- ✅ Add product to wishlist
- ✅ Duplicate prevention in wishlist
- ✅ Get wishlist with populated products
- ✅ Remove product from wishlist

**Phase 9: Payment Integration with Razorpay**
- ✅ Razorpay order creation
- ✅ Payment signature verification
- ✅ Payment verification with valid signature
- ✅ Payment verification with invalid signature rejection
- ✅ Cart clearing after successful payment
- ✅ Stock update after order completion
- ✅ Order creation with payment details
- ✅ Insufficient stock validation during payment
- ✅ Invalid amount rejection

**Phase 11: Order Management System**
- ✅ User views own orders
- ✅ User views single order details
- ✅ User order isolation (cannot view others' orders)
- ✅ Vendor views orders containing their products
- ✅ Vendor-specific order totals calculation
- ✅ Admin views all orders
- ✅ Admin updates order status
- ✅ Authorization enforcement for admin operations
- ✅ Order sorting by creation date

**Phase 12: Analytics and Admin Dashboard**
- ✅ Dashboard statistics (users, vendors, orders, products, revenue)
- ✅ Get all users list
- ✅ Get all vendors list
- ✅ Block/unblock user functionality
- ✅ Blocked user login prevention
- ✅ Admin user blocking protection
- ✅ Total revenue calculation
- ✅ Monthly revenue breakdown
- ✅ Vendor statistics (products, sales, earnings)
- ✅ Authorization enforcement for admin routes

## Property-Based Tests

Property-based tests (optional) can be added using fast-check library for comprehensive testing.

## Unit Tests

Unit tests will be added in the `tests/unit/` directory.

## Integration Tests

Integration tests will be added in the `tests/integration/` directory.
