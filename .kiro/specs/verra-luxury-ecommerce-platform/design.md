# Technical Design Document: VERRA Luxury E-Commerce Platform

## Overview

VERRA is a production-ready luxury e-commerce platform built on the MERN stack (MongoDB, Express.js, React.js, Node.js) with Razorpay payment integration. The system implements a role-based multi-panel architecture supporting three distinct user types: customers, vendors, and administrators. Each role has dedicated dashboards with specific capabilities enforced through JWT-based authentication and role-based middleware.

### Technology Stack

**Backend:**
- Node.js (v18+) with Express.js framework
- MongoDB with Mongoose ODM
- JWT for authentication with HttpOnly cookies
- bcrypt for password hashing (10+ salt rounds)
- Razorpay SDK for payment processing

**Frontend:**
- React.js (v18+) with React Router v6
- Context API for state management
- Axios for HTTP requests
- Tailwind CSS for styling
- Playfair Display and Inter fonts

**Security:**
- HttpOnly cookies for token storage
- Role-based access control (RBAC)
- Input validation and sanitization
- Razorpay signature verification
- CORS configuration

### Design Principles

1. **Separation of Concerns**: Clear boundaries between authentication, business logic, and presentation layers
2. **Role-Based Architecture**: Distinct code paths and UI for each user role
3. **Security First**: All protected routes require authentication and role verification
4. **RESTful API Design**: Predictable endpoint structure with proper HTTP methods
5. **Scalability**: Modular architecture supporting future feature additions

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        PW[Public Website]
        UD[User Dashboard]
        VD[Vendor Dashboard]
        AD[Admin Dashboard]
    end
    
    subgraph "Frontend Application"
        RC[React Components]
        CTX[Context API State]
        API[Axios API Service]
        RR[React Router]
    end
    
    subgraph "Backend API Layer"
        AUTH[Auth Routes]
        PROD[Product Routes]
        ORD[Order Routes]
        PAY[Payment Routes]
        USER[User Routes]
    end
    
    subgraph "Middleware Layer"
        AM[Auth Middleware]
        RM[Role Middleware]
        VM[Validation Middleware]
        EH[Error Handler]
    end
    
    subgraph "Business Logic Layer"
        AC[Auth Controller]
        PC[Product Controller]
        OC[Order Controller]
        UC[User Controller]
    end
    
    subgraph "Data Layer"
        UM[User Model]
        PM[Product Model]
        OM[Order Model]
        DB[(MongoDB)]
    end
    
    subgraph "External Services"
        RZ[Razorpay API]
    end
    
    PW --> RC
    UD --> RC
    VD --> RC
    AD --> RC
    
    RC --> CTX
    RC --> RR
    RC --> API
    
    API --> AUTH
    API --> PROD
    API --> ORD
    API --> PAY
    API --> USER
    
    AUTH --> AM
    PROD --> AM
    ORD --> AM
    PAY --> AM
    USER --> AM
    
    AM --> RM
    RM --> VM
    VM --> AC
    VM --> PC
    VM --> OC
    VM --> UC
    
    AC --> UM
    PC --> PM
    OC --> OM
    UC --> UM
    
    UM --> DB
    PM --> DB
    OM --> DB
    
    PAY --> RZ
    OC --> RZ
```

### Backend Architecture

#### Folder Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection configuration
│   └── razorpay.js           # Razorpay instance initialization
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── productController.js  # Product CRUD operations
│   ├── orderController.js    # Order management
│   ├── userController.js     # User profile management
│   └── adminController.js    # Admin-specific operations
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   ├── roleMiddleware.js     # Role-based authorization
│   ├── validateMiddleware.js # Input validation
│   └── errorMiddleware.js    # Global error handler
├── models/
│   ├── User.js               # User schema
│   ├── Product.js            # Product schema
│   └── Order.js              # Order schema
├── routes/
│   ├── authRoutes.js         # Authentication endpoints
│   ├── productRoutes.js      # Product endpoints
│   ├── orderRoutes.js        # Order endpoints
│   ├── userRoutes.js         # User profile endpoints
│   └── adminRoutes.js        # Admin endpoints
├── utils/
│   ├── generateToken.js      # JWT token generation
│   ├── verifyPayment.js      # Razorpay signature verification
│   └── sanitize.js           # Input sanitization utilities
├── .env                      # Environment variables
├── server.js                 # Express app entry point
└── package.json
```

#### Request Flow

1. **Client Request** → Express server receives HTTP request
2. **CORS Middleware** → Validates origin and headers
3. **Body Parser** → Parses JSON request body
4. **Route Handler** → Matches request to appropriate route
5. **Auth Middleware** → Verifies JWT token from HttpOnly cookie
6. **Role Middleware** → Validates user role against required role
7. **Validation Middleware** → Validates and sanitizes input data
8. **Controller** → Executes business logic
9. **Model** → Interacts with MongoDB via Mongoose
10. **Response** → Returns JSON response with appropriate status code
11. **Error Handler** → Catches and formats any errors

### Frontend Architecture

#### Folder Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   └── ProductDetails.jsx
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   └── dashboard/
│   │       ├── StatCard.jsx
│   │       ├── OrderTable.jsx
│   │       └── ProductTable.jsx
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── user/
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Profile.jsx
│   │   ├── vendor/
│   │   │   ├── VendorDashboard.jsx
│   │   │   ├── MyProducts.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   ├── EditProduct.jsx
│   │   │   └── VendorOrders.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageProducts.jsx
│   │       ├── ManageUsers.jsx
│   │       ├── ManageVendors.jsx
│   │       └── AllOrders.jsx
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   ├── UserLayout.jsx
│   │   ├── VendorLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication state
│   │   ├── CartContext.jsx      # Cart state
│   │   └── ProductContext.jsx   # Product filtering state
│   ├── services/
│   │   ├── api.js               # Axios instance configuration
│   │   ├── authService.js       # Authentication API calls
│   │   ├── productService.js    # Product API calls
│   │   ├── orderService.js      # Order API calls
│   │   └── paymentService.js    # Payment API calls
│   ├── utils/
│   │   ├── ProtectedRoute.jsx   # Route protection component
│   │   └── constants.js         # App constants
│   ├── App.jsx                  # Main app component with routing
│   ├── index.js                 # React entry point
│   └── index.css                # Tailwind imports
├── tailwind.config.js
└── package.json
```

#### Component Hierarchy

```mermaid
graph TD
    APP[App.jsx]
    
    APP --> PL[PublicLayout]
    APP --> UL[UserLayout]
    APP --> VL[VendorLayout]
    APP --> AL[AdminLayout]
    
    PL --> NAV[Navbar]
    PL --> HOME[Home]
    PL --> PROD[Products]
    PL --> FOOT[Footer]
    
    UL --> UNAV[User Navbar]
    UL --> UD[UserDashboard]
    UL --> CART[Cart]
    UL --> WISH[Wishlist]
    UL --> ORD[Orders]
    
    VL --> VNAV[Vendor Navbar]
    VL --> VD[VendorDashboard]
    VL --> MP[MyProducts]
    VL --> AP[AddProduct]
    
    AL --> ANAV[Admin Navbar]
    AL --> AD[AdminDashboard]
    AL --> MU[ManageUsers]
    AL --> MPR[ManageProducts]
    
    HOME --> HERO[Hero Section]
    HOME --> CAT[Category Grid]
    HOME --> TREND[Trending Products]
    
    PROD --> PG[ProductGrid]
    PG --> PC[ProductCard]
    
    CART --> CI[CartItem]
    CART --> CS[CartSummary]
    
    UD --> SC[StatCard]
    VD --> SC
    AD --> SC
```

## Components and Interfaces

### Backend API Endpoints

#### Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| POST | `/register` | No | - | Register new user account |
| POST | `/login` | No | - | Login and receive JWT cookie |
| POST | `/logout` | Yes | All | Clear authentication cookie |
| GET | `/me` | Yes | All | Get current user profile |

#### Product Routes (`/api/products`)

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| GET | `/` | No | - | Get all approved products (public) |
| GET | `/search` | No | - | Search products by query |
| GET | `/:id` | No | - | Get single product details |
| POST | `/` | Yes | Vendor | Create new product |
| PUT | `/:id` | Yes | Vendor | Update own product |
| DELETE | `/:id` | Yes | Vendor | Delete own product |
| GET | `/vendor/my-products` | Yes | Vendor | Get vendor's own products |
| PUT | `/admin/approve/:id` | Yes | Admin | Approve/reject product |
| GET | `/admin/all` | Yes | Admin | Get all products (including unapproved) |

#### Order Routes (`/api/orders`)

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| POST | `/create` | Yes | User | Create order after payment |
| GET | `/my-orders` | Yes | User | Get user's order history |
| GET | `/:id` | Yes | User | Get single order details |
| GET | `/vendor/my-orders` | Yes | Vendor | Get orders containing vendor products |
| GET | `/admin/all` | Yes | Admin | Get all platform orders |
| PUT | `/admin/status/:id` | Yes | Admin | Update order status |

#### Payment Routes (`/api/payment`)

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| POST | `/create-order` | Yes | User | Create Razorpay order |
| POST | `/verify` | Yes | User | Verify payment signature |

#### User Routes (`/api/users`)

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| GET | `/profile` | Yes | All | Get user profile |
| PUT | `/profile` | Yes | All | Update user profile |
| POST | `/cart/add` | Yes | User | Add product to cart |
| PUT | `/cart/update` | Yes | User | Update cart item quantity |
| DELETE | `/cart/remove/:productId` | Yes | User | Remove item from cart |
| GET | `/cart` | Yes | User | Get user's cart |
| POST | `/wishlist/add` | Yes | User | Add product to wishlist |
| DELETE | `/wishlist/remove/:productId` | Yes | User | Remove from wishlist |
| GET | `/wishlist` | Yes | User | Get user's wishlist |

#### Admin Routes (`/api/admin`)

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| GET | `/dashboard` | Yes | Admin | Get platform statistics |
| GET | `/users` | Yes | Admin | Get all users |
| GET | `/vendors` | Yes | Admin | Get all vendors |
| PUT | `/users/block/:id` | Yes | Admin | Block/unblock user |
| GET | `/revenue` | Yes | Admin | Get total platform revenue |

### Request/Response Schemas

#### Authentication

**POST /api/auth/register**
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user" // or "vendor"
}

// Response (201)
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**POST /api/auth/login**
```json
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response (200) + HttpOnly Cookie
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Product Management

**POST /api/products**
```json
// Request (Vendor)
{
  "title": "Luxury Leather Handbag",
  "description": "Premium Italian leather handbag with gold hardware",
  "price": 45000,
  "category": "Handbags",
  "images": ["url1", "url2", "url3"],
  "stock": 10
}

// Response (201)
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "64def456...",
    "title": "Luxury Leather Handbag",
    "description": "Premium Italian leather handbag with gold hardware",
    "price": 45000,
    "category": "Handbags",
    "images": ["url1", "url2", "url3"],
    "stock": 10,
    "vendor": "64abc123...",
    "isApproved": false,
    "ratings": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Payment Processing

**POST /api/payment/create-order**
```json
// Request
{
  "amount": 45000,
  "currency": "INR"
}

// Response (200)
{
  "success": true,
  "orderId": "order_MxYz123456",
  "amount": 45000,
  "currency": "INR",
  "key": "rzp_test_xxxxx" // Razorpay key for frontend
}
```

**POST /api/payment/verify**
```json
// Request
{
  "razorpay_order_id": "order_MxYz123456",
  "razorpay_payment_id": "pay_AbCd789012",
  "razorpay_signature": "abc123def456...",
  "cartItems": [
    {
      "product": "64def456...",
      "quantity": 1,
      "price": 45000
    }
  ]
}

// Response (200)
{
  "success": true,
  "message": "Payment verified successfully",
  "order": {
    "_id": "64ghi789...",
    "user": "64abc123...",
    "products": [...],
    "totalAmount": 45000,
    "paymentStatus": "completed",
    "orderStatus": "confirmed",
    "razorpayOrderId": "order_MxYz123456",
    "razorpayPaymentId": "pay_AbCd789012"
  }
}
```

### Frontend Service Layer

#### API Service Configuration (`services/api.js`)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on authentication failure
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Authentication Service (`services/authService.js`)

```javascript
import api from './api';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me')
};
```

#### Product Service (`services/productService.js`)

```javascript
import api from './api';

export const productService = {
  // Public
  getAllProducts: (filters) => api.get('/products', { params: filters }),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
  
  // Vendor
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/vendor/my-products'),
  
  // Admin
  getAllProductsAdmin: () => api.get('/products/admin/all'),
  approveProduct: (id, isApproved) => api.put(`/products/admin/approve/${id}`, { isApproved })
};
```

## Data Models

### User Model (`models/User.js`)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Product Model (`models/Product.js`)

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Handbags', 'Watches', 'Jewelry', 'Clothing', 'Shoes', 'Accessories', 'Fragrances']
  },
  images: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length > 0 && arr.length <= 5;
      },
      message: 'Product must have between 1 and 5 images'
    }
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ title: 'text', description: 'text' });

// Index for filtering
productSchema.index({ category: 1, isApproved: 1 });
productSchema.index({ vendor: 1 });

module.exports = mongoose.model('Product', productSchema);
```

### Order Model (`models/Order.js`)

```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for user order history
orderSchema.index({ user: 1, createdAt: -1 });

// Index for vendor orders
orderSchema.index({ 'products.vendor': 1 });

module.exports = mongoose.model('Order', orderSchema);
```

### Database Relationships Diagram

```mermaid
erDiagram
    USER ||--o{ PRODUCT : creates
    USER ||--o{ ORDER : places
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        enum role
        boolean isBlocked
        array cart
        array wishlist
        date createdAt
    }
    
    PRODUCT ||--o{ ORDER_ITEM : contains
    PRODUCT {
        ObjectId _id PK
        string title
        string description
        number price
        enum category
        array images
        ObjectId vendor FK
        number stock
        number ratings
        boolean isApproved
        date createdAt
    }
    
    ORDER ||--|{ ORDER_ITEM : includes
    ORDER {
        ObjectId _id PK
        ObjectId user FK
        array products
        number totalAmount
        enum paymentStatus
        enum orderStatus
        string razorpayOrderId
        string razorpayPaymentId
        object shippingAddress
        date createdAt
    }
    
    ORDER_ITEM {
        ObjectId product FK
        number quantity
        number price
        ObjectId vendor FK
    }
```


## Authentication and Authorization Flow

### JWT Token Flow with HttpOnly Cookies

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant M as Auth Middleware
    participant DB as Database
    
    Note over C,DB: Registration Flow
    C->>S: POST /api/auth/register
    S->>S: Validate input
    S->>S: Hash password (bcrypt, 10 rounds)
    S->>DB: Save user
    DB-->>S: User created
    S-->>C: 201 Success response
    
    Note over C,DB: Login Flow
    C->>S: POST /api/auth/login
    S->>DB: Find user by email
    DB-->>S: User data with password
    S->>S: Compare password (bcrypt)
    S->>S: Generate JWT token
    S->>S: Set HttpOnly cookie
    S-->>C: 200 Success + Cookie
    
    Note over C,DB: Protected Request Flow
    C->>S: GET /api/users/profile (with cookie)
    S->>M: Extract token from cookie
    M->>M: Verify JWT signature
    M->>DB: Find user by ID from token
    DB-->>M: User data
    M->>M: Check if user is blocked
    M->>S: Attach user to request
    S->>S: Process request
    S-->>C: 200 Response with data
    
    Note over C,DB: Logout Flow
    C->>S: POST /api/auth/logout
    S->>S: Clear HttpOnly cookie
    S-->>C: 200 Success
```

### Authentication Middleware Implementation

**File: `middleware/authMiddleware.js`**

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Extract token from HttpOnly cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked'
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

module.exports = { protect };
```

### Role-Based Authorization Middleware

**File: `middleware/roleMiddleware.js`**

```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is attached by protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`
      });
    }
    
    next();
  };
};

module.exports = { authorize };
```

### Token Generation Utility

**File: `utils/generateToken.js`**

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const setTokenCookie = (res, token) => {
  const options = {
    httpOnly: true, // Prevents client-side JavaScript access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  };
  
  res.cookie('token', token, options);
};

module.exports = { generateToken, setTokenCookie };
```

### Route Protection Examples

**File: `routes/productRoutes.js`**

```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  approveProduct,
  getAllProductsAdmin
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Vendor routes
router.post('/', protect, authorize('vendor'), createProduct);
router.put('/:id', protect, authorize('vendor'), updateProduct);
router.delete('/:id', protect, authorize('vendor'), deleteProduct);
router.get('/vendor/my-products', protect, authorize('vendor'), getMyProducts);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllProductsAdmin);
router.put('/admin/approve/:id', protect, authorize('admin'), approveProduct);

module.exports = router;
```

### Frontend Protected Routes

**File: `utils/ProtectedRoute.jsx`**

```javascript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loader />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
```

**File: `App.jsx` (Routing Structure)**

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import VendorLayout from './layouts/VendorLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import Cart from './pages/user/Cart';
import Wishlist from './pages/user/Wishlist';
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';

// Vendor pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import MyProducts from './pages/vendor/MyProducts';
import AddProduct from './pages/vendor/AddProduct';
import EditProduct from './pages/vendor/EditProduct';
import VendorOrders from './pages/vendor/VendorOrders';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageUsers from './pages/admin/ManageUsers';
import ManageVendors from './pages/admin/ManageVendors';
import AllOrders from './pages/admin/AllOrders';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          {/* User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route element={<UserLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/cart" element={<Cart />} />
              <Route path="/user/wishlist" element={<Wishlist />} />
              <Route path="/user/orders" element={<Orders />} />
              <Route path="/user/profile" element={<Profile />} />
            </Route>
          </Route>
          
          {/* Vendor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
            <Route element={<VendorLayout />}>
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/products" element={<MyProducts />} />
              <Route path="/vendor/products/add" element={<AddProduct />} />
              <Route path="/vendor/products/edit/:id" element={<EditProduct />} />
              <Route path="/vendor/orders" element={<VendorOrders />} />
            </Route>
          </Route>
          
          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/vendors" element={<ManageVendors />} />
              <Route path="/admin/orders" element={<AllOrders />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### Authentication Context

**File: `context/AuthContext.jsx`**

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data.user);
    return response.data;
  };
  
  const register = async (userData) => {
    const response = await authService.register(userData);
    return response.data;
  };
  
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Razorpay Payment Integration

### Payment Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant R as Razorpay API
    participant DB as Database
    
    Note over U,DB: Checkout Initiation
    U->>F: Click "Proceed to Payment"
    F->>B: POST /api/payment/create-order
    B->>B: Calculate total from cart
    B->>R: Create Razorpay Order
    R-->>B: Order ID + Details
    B-->>F: Order ID, Amount, Key
    
    Note over U,DB: Payment Processing
    F->>F: Initialize Razorpay Checkout
    F->>U: Display Razorpay Modal
    U->>R: Enter payment details
    R->>R: Process payment
    R-->>F: Payment ID + Signature
    
    Note over U,DB: Payment Verification
    F->>B: POST /api/payment/verify
    B->>B: Verify signature with secret
    alt Signature Valid
        B->>DB: Create order record
        B->>DB: Update stock quantities
        B->>DB: Clear user cart
        DB-->>B: Success
        B-->>F: Order created
        F-->>U: Redirect to success page
    else Signature Invalid
        B-->>F: 400 Payment verification failed
        F-->>U: Show error message
    end
```

### Razorpay Configuration

**File: `config/razorpay.js`**

```javascript
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = razorpayInstance;
```

### Payment Controller

**File: `controllers/paymentController.js`**

```javascript
const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    
    const order = await razorpayInstance.orders.create(options);
    
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};

// Verify Payment and Create Order
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      shippingAddress
    } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
    
    // Calculate total and prepare order products
    let totalAmount = 0;
    const orderProducts = [];
    
    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`
        });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        vendor: product.vendor
      });
      
      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Create order
    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      totalAmount,
      paymentStatus: 'completed',
      orderStatus: 'confirmed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      shippingAddress
    });
    
    // Clear user cart
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment
};
```

### Frontend Payment Integration

**File: `services/paymentService.js`**

```javascript
import api from './api';

export const paymentService = {
  createOrder: (amount) => api.post('/payment/create-order', { amount }),
  verifyPayment: (paymentData) => api.post('/payment/verify', paymentData)
};
```

**File: `pages/user/Cart.jsx` (Payment Integration)**

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create Razorpay order
      const { data } = await paymentService.createOrder(totalAmount);
      
      // Razorpay checkout options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'VERRA',
        description: 'Luxury E-Commerce Purchase',
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems: cart,
              shippingAddress: shippingInfo
            };
            
            const result = await paymentService.verifyPayment(verifyData);
            
            if (result.data.success) {
              navigate('/user/orders');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#C6A75E'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    // Cart UI with payment button
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Proceed to Payment'}
    </button>
  );
};
```

### Payment Security Verification

**File: `utils/verifyPayment.js`**

```javascript
const crypto = require('crypto');

const verifyRazorpaySignature = (orderId, paymentId, signature, secret) => {
  const body = orderId + '|' + paymentId;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');
  
  return expectedSignature === signature;
};

module.exports = { verifyRazorpaySignature };
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:

- **4.2 and 5.1** both test that only approved products appear publicly - these can be combined into one property
- **3.7 and 16.5** both test vendor ability to update stock - redundant
- **3.6 and 10.3** both test analytics data isolation for vendors - redundant
- **8.6 and 9.1** both test order creation after payment verification - redundant

The following properties provide unique validation value and will be implemented:

### Property 1: User Registration Creates Hashed Account

*For any* valid user registration data (name, email, password meeting requirements), creating an account should result in a stored user record with a bcrypt-hashed password that can be verified against the original password.

**Validates: Requirements 1.1, 1.5**

### Property 2: Login Returns JWT in HttpOnly Cookie

*For any* registered user with valid credentials, logging in should return a success response and set an HttpOnly cookie containing a valid JWT token that can be verified.

**Validates: Requirements 1.2**

### Property 3: Login-Logout Round Trip Clears Authentication

*For any* authenticated user, performing logout after login should clear the authentication cookie, making subsequent authenticated requests fail.

**Validates: Requirements 1.3**

### Property 4: Duplicate Email Registration Rejected

*For any* existing user email, attempting to register a new account with the same email should be rejected with an appropriate error.

**Validates: Requirements 1.4**

### Property 5: Invalid Email Format Rejected

*For any* string that doesn't match valid email format (missing @, invalid domain, etc.), registration attempts should be rejected.

**Validates: Requirements 1.6, 12.2**

### Property 6: Short Password Rejected

*For any* password string with fewer than 8 characters, registration attempts should be rejected.

**Validates: Requirements 1.7**

### Property 7: User Role Assignment Validity

*For any* created user account, the role field should contain exactly one value from the set {user, admin, vendor}.

**Validates: Requirements 2.1**

### Property 8: Protected Endpoint Role Verification

*For any* protected endpoint with role requirements, requests with JWT tokens containing non-matching roles should be rejected with 403 status.

**Validates: Requirements 2.3, 13.5**

### Property 9: Product Creation Stores All Fields

*For any* vendor creating a product with valid data (title, description, price, category, images, stock), the created product record should contain all provided fields plus vendor reference and isApproved=false.

**Validates: Requirements 3.1, 3.4**

### Property 10: Vendor Product Ownership Enforcement

*For any* vendor attempting to update or delete a product, the operation should succeed only if the product's vendor field matches the requesting vendor's ID.

**Validates: Requirements 3.2, 3.3**

### Property 11: Admin Product Approval Toggle

*For any* product and admin user, the admin should be able to set the product's isApproved status to either true or false.

**Validates: Requirements 4.1**

### Property 12: Public Product Filtering by Approval

*For any* public product listing request, the returned products should all have isApproved=true, and no unapproved products should appear.

**Validates: Requirements 4.2, 5.1**

### Property 13: Category Filtering Accuracy

*For any* category filter applied to product search, all returned products should have the category field matching the filter value.

**Validates: Requirements 5.2**

### Property 14: Search Query Matching

*For any* search query string, all returned products should have either title or description containing the search terms (case-insensitive).

**Validates: Requirements 5.3**

### Property 15: Cart Addition Stores Product and Quantity

*For any* user adding a product to cart with a specified quantity, the user's cart should contain an entry with the product reference and the specified quantity.

**Validates: Requirements 6.1**

### Property 16: Cart Quantity Update Modifies Existing Item

*For any* product already in a user's cart, updating the quantity should modify the existing cart entry's quantity field without creating duplicates.

**Validates: Requirements 6.2**

### Property 17: Cart Removal Deletes Product

*For any* product in a user's cart, removing it should result in the product no longer appearing in the cart array.

**Validates: Requirements 6.3**

### Property 18: Cart Total Calculation Accuracy

*For any* user's cart with multiple items, the calculated total should equal the sum of (price × quantity) for all cart items.

**Validates: Requirements 6.4**

### Property 19: Cart Stock Validation

*For any* product with stock quantity S, attempting to add more than S items to cart should be rejected with an error.

**Validates: Requirements 6.6, 16.3**

### Property 20: Wishlist Addition Stores Product Reference

*For any* user adding a product to wishlist, the user's wishlist array should contain the product's ID.

**Validates: Requirements 7.1**

### Property 21: Wishlist Removal Deletes Product Reference

*For any* product in a user's wishlist, removing it should result in the product ID no longer appearing in the wishlist array.

**Validates: Requirements 7.2**

### Property 22: Wishlist Uniqueness Constraint

*For any* product already in a user's wishlist, attempting to add the same product again should either be prevented or result in only one instance in the wishlist.

**Validates: Requirements 7.4**

### Property 23: Payment Signature Verification Accuracy

*For any* Razorpay payment with order ID, payment ID, and signature, the verification function should return true only when the signature is a valid HMAC-SHA256 hash of "orderID|paymentID" using the Razorpay secret key.

**Validates: Requirements 8.4**

### Property 24: Invalid Payment Signature Rejection

*For any* payment verification request with an invalid or tampered signature, the system should reject the payment and return an error without creating an order.

**Validates: Requirements 8.5**

### Property 25: Verified Payment Creates Order

*For any* successfully verified payment with cart items, an order record should be created containing user reference, products array, total amount, payment status "completed", and Razorpay identifiers.

**Validates: Requirements 8.6, 9.1**

### Property 26: User Order History Isolation

*For any* user requesting their order history, all returned orders should have the user field matching the requesting user's ID, and no other user's orders should appear.

**Validates: Requirements 9.2**

### Property 27: Order Initial Status

*For any* newly created order after successful payment, the orderStatus field should be set to "confirmed".

**Validates: Requirements 9.4**

### Property 28: Vendor Sales Count Accuracy

*For any* vendor, the sales count displayed in their analytics should equal the number of completed orders containing at least one product owned by that vendor.

**Validates: Requirements 10.1**

### Property 29: Vendor Earnings Calculation

*For any* vendor, the total earnings should equal the sum of (price × quantity) for all their products across all orders with paymentStatus="completed".

**Validates: Requirements 10.2, 10.4**

### Property 30: Admin User Blocking Prevents Login

*For any* user account with isBlocked=true, login attempts should be rejected even with correct credentials.

**Validates: Requirements 11.4**

### Property 31: Profile Update Persistence

*For any* user updating their profile with new name and email, retrieving the profile afterward should return the updated values.

**Validates: Requirements 12.1**

### Property 32: Role Field Immutability for Self

*For any* user attempting to update their own profile with a different role value, the role field should remain unchanged after the update.

**Validates: Requirements 12.5**

### Property 33: Authentication Failure Returns 401

*For any* login attempt with invalid credentials (wrong password or non-existent email), the response should have HTTP status code 401.

**Validates: Requirements 13.4**

### Property 34: Stock Decrease After Order Completion

*For any* completed order with products and quantities, each product's stock should decrease by the ordered quantity.

**Validates: Requirements 16.1**


## Error Handling

### Error Handling Strategy

The VERRA platform implements a comprehensive error handling strategy with consistent error responses, proper HTTP status codes, and secure error messages that don't expose sensitive information.

### Global Error Handler Middleware

**File: `middleware/errorMiddleware.js`**

```javascript
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
  
  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Don't expose internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

### Error Response Format

All error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": ["Optional array of specific validation errors"]
}
```

### HTTP Status Code Usage

| Status Code | Usage | Example |
|-------------|-------|---------|
| 200 | Successful GET, PUT, DELETE | Product retrieved successfully |
| 201 | Successful POST (resource created) | User registered successfully |
| 400 | Bad request / Validation error | Invalid email format |
| 401 | Authentication failure | Invalid credentials |
| 403 | Authorization failure | Insufficient permissions |
| 404 | Resource not found | Product ID doesn't exist |
| 409 | Conflict | Duplicate email address |
| 500 | Server error | Database connection failed |

### Validation Middleware

**File: `middleware/validateMiddleware.js`**

```javascript
const { body, param, validationResult } = require('express-validator');

// Validation rules for user registration
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
    .withMessage('Role must be either user or vendor')
];

// Validation rules for product creation
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
    .withMessage('Stock must be a non-negative integer')
];

// Validation rules for MongoDB ObjectId
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateProduct,
  validateObjectId,
  checkValidation
};
```

### Input Sanitization

**File: `utils/sanitize.js`**

```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Sanitize user input to prevent NoSQL injection
const sanitizeInput = (data) => {
  if (typeof data === 'string') {
    // Remove potential XSS attacks
    return data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return data;
};

// Middleware setup in server.js
const setupSanitization = (app) => {
  // Prevent NoSQL injection
  app.use(mongoSanitize());
  
  // Prevent XSS attacks
  app.use(xss());
};

module.exports = { sanitizeInput, setupSanitization };
```

### Async Error Wrapper

**File: `utils/asyncHandler.js`**

```javascript
// Wrapper to catch async errors and pass to error handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
```

**Usage Example:**

```javascript
const asyncHandler = require('../utils/asyncHandler');

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isApproved: true });
  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});
```

### Frontend Error Handling

**File: `services/api.js` (Enhanced)**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle specific status codes
    switch (error.response?.status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        break;
      case 403:
        // Show forbidden message
        console.error('Access forbidden:', message);
        break;
      case 404:
        // Show not found message
        console.error('Resource not found:', message);
        break;
      case 500:
        // Show server error message
        console.error('Server error:', message);
        break;
      default:
        console.error('Error:', message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Error Logging

For production environments, implement structured logging:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

## Testing Strategy

### Dual Testing Approach

The VERRA platform requires both unit tests and property-based tests for comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, error conditions, and integration points
- **Property-Based Tests**: Verify universal properties across all inputs through randomization

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property-based tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Framework Selection:**
- **Backend (Node.js)**: Use `fast-check` library for property-based testing
- **Frontend (React)**: Use `@fast-check/jest` for component property testing

**Configuration Requirements:**
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: verra-luxury-ecommerce-platform, Property {number}: {property_text}`

### Backend Testing Structure

```
backend/
├── tests/
│   ├── unit/
│   │   ├── auth.test.js
│   │   ├── product.test.js
│   │   ├── order.test.js
│   │   └── payment.test.js
│   ├── property/
│   │   ├── auth.property.test.js
│   │   ├── product.property.test.js
│   │   ├── order.property.test.js
│   │   └── cart.property.test.js
│   ├── integration/
│   │   ├── authFlow.test.js
│   │   ├── checkoutFlow.test.js
│   │   └── vendorFlow.test.js
│   └── setup.js
```

### Property-Based Test Example

**File: `tests/property/auth.property.test.js`**

```javascript
const fc = require('fast-check');
const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const { connectDB, closeDB, clearDB } = require('../setup');

describe('Authentication Property Tests', () => {
  beforeAll(async () => await connectDB());
  afterAll(async () => await closeDB());
  afterEach(async () => await clearDB());
  
  // Feature: verra-luxury-ecommerce-platform, Property 1: User Registration Creates Hashed Account
  test('Property 1: Registration with valid data creates hashed account', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 2, maxLength: 50 }),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 })
        }),
        async (userData) => {
          const response = await request(app)
            .post('/api/auth/register')
            .send({ ...userData, role: 'user' });
          
          expect(response.status).toBe(201);
          
          const user = await User.findOne({ email: userData.email }).select('+password');
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(userData.password);
          expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
          
          const isMatch = await user.comparePassword(userData.password);
          expect(isMatch).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Feature: verra-luxury-ecommerce-platform, Property 4: Duplicate Email Registration Rejected
  test('Property 4: Duplicate email registration is rejected', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 2, maxLength: 50 }),
        fc.string({ minLength: 8, maxLength: 50 }),
        async (email, name, password) => {
          // Create first user
          await request(app)
            .post('/api/auth/register')
            .send({ name, email, password, role: 'user' });
          
          // Attempt duplicate registration
          const response = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Different Name', email, password: 'DifferentPass123', role: 'user' });
          
          expect(response.status).toBe(400);
          expect(response.body.success).toBe(false);
          expect(response.body.message).toMatch(/email/i);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Feature: verra-luxury-ecommerce-platform, Property 6: Short Password Rejected
  test('Property 6: Passwords shorter than 8 characters are rejected', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 7 }),
        fc.emailAddress(),
        fc.string({ minLength: 2, maxLength: 50 }),
        async (shortPassword, email, name) => {
          const response = await request(app)
            .post('/api/auth/register')
            .send({ name, email, password: shortPassword, role: 'user' });
          
          expect(response.status).toBe(400);
          expect(response.body.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Example

**File: `tests/unit/auth.test.js`**

```javascript
const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const { connectDB, closeDB, clearDB } = require('../setup');

describe('Authentication Unit Tests', () => {
  beforeAll(async () => await connectDB());
  afterAll(async () => await closeDB());
  afterEach(async () => await clearDB());
  
  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
        role: 'user'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined();
    });
    
    test('should reject registration with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123',
        role: 'user'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('should reject registration with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'john@example.com' });
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123',
        role: 'user'
      });
    });
    
    test('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.headers['set-cookie']).toBeDefined();
    });
    
    test('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### Frontend Testing Structure

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── components/
│   │   │   ├── ProductCard.test.jsx
│   │   │   ├── CartItem.test.jsx
│   │   │   └── Navbar.test.jsx
│   │   ├── pages/
│   │   │   ├── Login.test.jsx
│   │   │   ├── Products.test.jsx
│   │   │   └── Cart.test.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.test.jsx
│   │   │   └── CartContext.test.jsx
│   │   └── services/
│   │       ├── authService.test.js
│   │       └── productService.test.js
```

### Integration Test Example

**File: `tests/integration/checkoutFlow.test.js`**

```javascript
const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const Product = require('../../models/Product');
const { connectDB, closeDB, clearDB } = require('../setup');

describe('Checkout Flow Integration Tests', () => {
  let userToken;
  let userId;
  let productId;
  
  beforeAll(async () => await connectDB());
  afterAll(async () => await closeDB());
  afterEach(async () => await clearDB());
  
  beforeEach(async () => {
    // Create vendor and product
    const vendor = await User.create({
      name: 'Vendor',
      email: 'vendor@example.com',
      password: 'VendorPass123',
      role: 'vendor'
    });
    
    const product = await Product.create({
      title: 'Test Product',
      description: 'Test description',
      price: 10000,
      category: 'Handbags',
      images: ['image1.jpg'],
      vendor: vendor._id,
      stock: 10,
      isApproved: true
    });
    
    productId = product._id;
    
    // Create and login user
    const user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'UserPass123',
      role: 'user'
    });
    
    userId = user._id;
    
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'UserPass123' });
    
    userToken = loginResponse.headers['set-cookie'];
  });
  
  test('Complete checkout flow: add to cart -> payment -> order creation', async () => {
    // Add product to cart
    const cartResponse = await request(app)
      .post('/api/users/cart/add')
      .set('Cookie', userToken)
      .send({ productId, quantity: 2 });
    
    expect(cartResponse.status).toBe(200);
    
    // Create payment order
    const paymentResponse = await request(app)
      .post('/api/payment/create-order')
      .set('Cookie', userToken)
      .send({ amount: 20000 });
    
    expect(paymentResponse.status).toBe(200);
    expect(paymentResponse.body.orderId).toBeDefined();
    
    // Verify payment (mock signature)
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${paymentResponse.body.orderId}|pay_test123`)
      .digest('hex');
    
    const verifyResponse = await request(app)
      .post('/api/payment/verify')
      .set('Cookie', userToken)
      .send({
        razorpay_order_id: paymentResponse.body.orderId,
        razorpay_payment_id: 'pay_test123',
        razorpay_signature: signature,
        cartItems: [{ product: productId, quantity: 2, price: 10000 }]
      });
    
    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.order).toBeDefined();
    expect(verifyResponse.body.order.paymentStatus).toBe('completed');
    
    // Verify stock decreased
    const updatedProduct = await Product.findById(productId);
    expect(updatedProduct.stock).toBe(8);
    
    // Verify cart cleared
    const updatedUser = await User.findById(userId);
    expect(updatedUser.cart).toHaveLength(0);
  });
});
```

### Test Coverage Goals

- **Unit Tests**: Minimum 80% code coverage
- **Property Tests**: All 34 correctness properties implemented
- **Integration Tests**: All critical user flows covered
- **E2E Tests**: Main user journeys (registration → browse → purchase)

### Testing Commands

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:property": "jest tests/property",
    "test:integration": "jest tests/integration",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

### Continuous Integration

Integrate tests into CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run property tests
        run: npm run test:property
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Generate coverage report
        run: npm run test:coverage
```

## Deployment Considerations

### Environment Variables

**Backend `.env` file:**

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/verra

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# CORS
CLIENT_URL=https://verra.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend `.env` file:**

```env
REACT_APP_API_URL=https://api.verra.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### Security Checklist

- [ ] HTTPS enabled for all production traffic
- [ ] CORS configured with specific origins
- [ ] Rate limiting implemented
- [ ] Helmet.js for security headers
- [ ] Input validation and sanitization
- [ ] SQL/NoSQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection for state-changing operations
- [ ] Secure cookie settings (httpOnly, secure, sameSite)
- [ ] Environment variables secured
- [ ] Sensitive data not logged
- [ ] Regular dependency updates
- [ ] MongoDB connection string secured

### Performance Optimization

- Database indexing on frequently queried fields
- Image optimization and CDN usage
- API response caching where appropriate
- Lazy loading for React components
- Code splitting for frontend bundles
- Compression middleware (gzip)
- Connection pooling for MongoDB

### Monitoring and Logging

- Application performance monitoring (APM)
- Error tracking (e.g., Sentry)
- Request logging
- Database query performance monitoring
- User analytics
- Payment transaction logging

---

## Summary

This technical design document provides a comprehensive blueprint for implementing the VERRA luxury e-commerce platform. The design covers:

- Complete system architecture with MERN stack
- Detailed API specifications with 30+ endpoints
- Mongoose schemas with validation and relationships
- JWT-based authentication with HttpOnly cookies
- Role-based access control for three user types
- Razorpay payment integration with signature verification
- React component hierarchy and routing structure
- Context API state management
- 34 correctness properties for property-based testing
- Comprehensive error handling and validation
- Dual testing strategy (unit + property tests)

The architecture is production-ready, scalable, and follows industry best practices for security, maintainability, and testability.
