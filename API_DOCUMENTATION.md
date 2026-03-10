# VERRA API Documentation

Complete API reference for the VERRA Luxury E-Commerce Platform.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication via JWT tokens stored in HttpOnly cookies. The token is automatically sent with each request.

### Headers

```
Content-Type: application/json
```

### Authentication Flow

1. Register or login to receive JWT token in HttpOnly cookie
2. Token is automatically included in subsequent requests
3. Token expires after 7 days (configurable)

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Auth Required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Fields:**
- `name` (string, required): User's full name (2-50 characters)
- `email` (string, required): Valid email address
- `password` (string, required): Minimum 8 characters
- `role` (string, optional): Either "user" or "vendor" (default: "user")

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isBlocked": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Validation error or duplicate email
- `500`: Server error

---

### Login User

Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isBlocked": false
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `401`: User is blocked
- `500`: Server error

---

### Logout User

Clear authentication token.

**Endpoint:** `POST /auth/logout`

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User

Get authenticated user's information.

**Endpoint:** `GET /auth/me`

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isBlocked": false,
    "cart": [],
    "wishlist": []
  }
}
```

---

## Product Endpoints

### Get All Products

Get all approved products with optional filtering.

**Endpoint:** `GET /products`

**Auth Required:** No

**Query Parameters:**
- `category` (string, optional): Filter by category
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 12)

**Example:** `GET /products?category=Watches&page=1&limit=12`

**Success Response (200):**
```json
{
  "success": true,
  "count": 24,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxury Watch",
      "description": "Premium timepiece",
      "price": 50000,
      "category": "Watches",
      "images": ["url1.jpg", "url2.jpg"],
      "vendor": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Vendor Name"
      },
      "stock": 10,
      "ratings": 4.5,
      "isApproved": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Search Products

Search products by title or description.

**Endpoint:** `GET /products/search`

**Auth Required:** No

**Query Parameters:**
- `q` (string, required): Search query

**Example:** `GET /products/search?q=luxury`

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxury Watch",
      "description": "Premium timepiece",
      "price": 50000,
      "category": "Watches",
      "images": ["url1.jpg"],
      "stock": 10
    }
  ]
}
```

---

### Get Product by ID

Get detailed information about a specific product.

**Endpoint:** `GET /products/:id`

**Auth Required:** No

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Luxury Watch",
    "description": "Premium timepiece with detailed specifications...",
    "price": 50000,
    "category": "Watches",
    "images": ["url1.jpg", "url2.jpg", "url3.jpg"],
    "vendor": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Vendor Name",
      "email": "vendor@example.com"
    },
    "stock": 10,
    "ratings": 4.5,
    "numReviews": 25,
    "isApproved": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `404`: Product not found
- `500`: Server error

---

### Create Product (Vendor)

Create a new product listing.

**Endpoint:** `POST /products`

**Auth Required:** Yes (Vendor role)

**Request Body:**
```json
{
  "title": "Luxury Watch",
  "description": "Premium timepiece with detailed specifications",
  "price": 50000,
  "category": "Watches",
  "images": ["url1.jpg", "url2.jpg"],
  "stock": 10
}
```

**Fields:**
- `title` (string, required): 3-200 characters
- `description` (string, required): 10-2000 characters
- `price` (number, required): Positive number
- `category` (string, required): One of: Handbags, Watches, Jewelry, Clothing, Shoes, Accessories, Fragrances
- `images` (array, required): 1-5 image URLs
- `stock` (number, required): Non-negative integer

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Luxury Watch",
    "price": 50000,
    "isApproved": false,
    "vendor": "507f1f77bcf86cd799439012"
  }
}
```

**Error Responses:**
- `400`: Validation error
- `401`: Not authenticated
- `403`: Not authorized (not a vendor)
- `500`: Server error

---

### Update Product (Vendor)

Update an existing product (only if you own it).

**Endpoint:** `PUT /products/:id`

**Auth Required:** Yes (Vendor role, must own product)

**Request Body:** Same as Create Product (all fields optional)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Luxury Watch",
    "price": 55000
  }
}
```

**Error Responses:**
- `400`: Validation error
- `401`: Not authenticated
- `403`: Not authorized (don't own product)
- `404`: Product not found
- `500`: Server error

---

### Delete Product (Vendor)

Delete a product (only if you own it).

**Endpoint:** `DELETE /products/:id`

**Auth Required:** Yes (Vendor role, must own product)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Get My Products (Vendor)

Get all products created by the authenticated vendor.

**Endpoint:** `GET /products/vendor/my-products`

**Auth Required:** Yes (Vendor role)

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxury Watch",
      "price": 50000,
      "stock": 10,
      "isApproved": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get All Products (Admin)

Get all products regardless of approval status.

**Endpoint:** `GET /products/admin/all`

**Auth Required:** Yes (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxury Watch",
      "vendor": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Vendor Name"
      },
      "isApproved": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Approve/Reject Product (Admin)

Toggle product approval status.

**Endpoint:** `PUT /products/admin/approve/:id`

**Auth Required:** Yes (Admin role)

**Request Body:**
```json
{
  "isApproved": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product approval status updated",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isApproved": true
  }
}
```

---

## User Endpoints

### Get Profile

Get current user's profile information.

**Endpoint:** `GET /users/profile`

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isBlocked": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Profile

Update user's profile information.

**Endpoint:** `PUT /users/profile`

**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "johnupdated@example.com"
  }
}
```

---

### Add to Cart

Add a product to the user's cart.

**Endpoint:** `POST /users/cart/add`

**Auth Required:** Yes (User role)

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "cart": [
      {
        "product": "507f1f77bcf86cd799439011",
        "quantity": 2
      }
    ]
  }
}
```

**Error Responses:**
- `400`: Insufficient stock
- `404`: Product not found

---

### Update Cart Item

Update quantity of a cart item.

**Endpoint:** `PUT /users/cart/update`

**Auth Required:** Yes (User role)

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cart updated successfully"
}
```

---

### Remove from Cart

Remove a product from the cart.

**Endpoint:** `DELETE /users/cart/remove/:productId`

**Auth Required:** Yes (User role)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product removed from cart"
}
```

---

### Get Cart

Get user's cart with populated product details.

**Endpoint:** `GET /users/cart`

**Auth Required:** Yes (User role)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "product": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Luxury Watch",
          "price": 50000,
          "images": ["url1.jpg"],
          "stock": 10
        },
        "quantity": 2,
        "subtotal": 100000
      }
    ],
    "total": 100000
  }
}
```

---

### Add to Wishlist

Add a product to the wishlist.

**Endpoint:** `POST /users/wishlist/add`

**Auth Required:** Yes (User role)

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product added to wishlist"
}
```

---

### Remove from Wishlist

Remove a product from the wishlist.

**Endpoint:** `DELETE /users/wishlist/remove/:productId`

**Auth Required:** Yes (User role)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

---

### Get Wishlist

Get user's wishlist with populated product details.

**Endpoint:** `GET /users/wishlist`

**Auth Required:** Yes (User role)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxury Watch",
      "price": 50000,
      "images": ["url1.jpg"],
      "category": "Watches",
      "stock": 10
    }
  ]
}
```

---

## Order Endpoints

### Get My Orders

Get all orders for the authenticated user.

**Endpoint:** `GET /orders/my-orders`

**Auth Required:** Yes (User role)

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "products": [
        {
          "product": {
            "_id": "507f1f77bcf86cd799439012",
            "title": "Luxury Watch"
          },
          "quantity": 1,
          "price": 50000
        }
      ],
      "totalAmount": 50000,
      "paymentStatus": "completed",
      "orderStatus": "confirmed",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Order by ID

Get detailed information about a specific order.

**Endpoint:** `GET /orders/:id`

**Auth Required:** Yes (User role, must own order)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "user": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "products": [
      {
        "product": {
          "_id": "507f1f77bcf86cd799439012",
          "title": "Luxury Watch",
          "images": ["url1.jpg"]
        },
        "quantity": 1,
        "price": 50000
      }
    ],
    "totalAmount": 50000,
    "paymentStatus": "completed",
    "orderStatus": "shipped",
    "razorpayOrderId": "order_xxxxx",
    "razorpayPaymentId": "pay_xxxxx",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get Vendor Orders

Get all orders containing the vendor's products.

**Endpoint:** `GET /orders/vendor/my-orders`

**Auth Required:** Yes (Vendor role)

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "vendorProducts": [
        {
          "product": {
            "title": "Luxury Watch"
          },
          "quantity": 1,
          "price": 50000
        }
      ],
      "vendorTotal": 50000,
      "orderStatus": "confirmed",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get All Orders (Admin)

Get all orders across the platform.

**Endpoint:** `GET /orders/admin/all`

**Auth Required:** Yes (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "count": 100,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "totalAmount": 50000,
      "paymentStatus": "completed",
      "orderStatus": "delivered",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Update Order Status (Admin)

Update the status of an order.

**Endpoint:** `PUT /orders/admin/status/:id`

**Auth Required:** Yes (Admin role)

**Request Body:**
```json
{
  "orderStatus": "shipped"
}
```

**Valid statuses:** pending, confirmed, shipped, delivered, cancelled

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "orderStatus": "shipped"
  }
}
```

---

## Payment Endpoints

### Create Razorpay Order

Create a Razorpay order for payment processing.

**Endpoint:** `POST /payment/create-order`

**Auth Required:** Yes (User role)

**Request Body:**
```json
{
  "amount": 50000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_xxxxx",
    "amount": 5000000,
    "currency": "INR",
    "keyId": "rzp_test_xxxxx"
  }
}
```

---

### Verify Payment

Verify Razorpay payment signature and create order.

**Endpoint:** `POST /payment/verify`

**Auth Required:** Yes (User role)

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "cartItems": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified and order created",
  "data": {
    "orderId": "507f1f77bcf86cd799439011"
  }
}
```

**Error Responses:**
- `400`: Invalid signature or insufficient stock
- `500`: Server error

---

## Admin Endpoints

### Get Dashboard Stats

Get platform-wide statistics.

**Endpoint:** `GET /admin/dashboard`

**Auth Required:** Yes (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalVendors": 25,
    "totalOrders": 500,
    "totalProducts": 200,
    "pendingApprovals": 10
  }
}
```

---

### Get All Users

Get all users with role 'user'.

**Endpoint:** `GET /admin/users`

**Auth Required:** Yes (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isBlocked": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get All Vendors

Get all users with role 'vendor'.

**Endpoint:** `GET /admin/vendors`

**Auth Required:** Yes (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Vendor Name",
      "email": "vendor@example.com",
      "role": "vendor",
      "isBlocked": false,
      "productCount": 15,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Block/Unblock User

Toggle user's blocked status.

**Endpoint:** `PUT /admin/users/block/:id`

**Auth Required:** Yes (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User blocked successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isBlocked": true
  }
}
```

---

### Get Total Revenue

Get total revenue from completed orders.

**Endpoint:** `GET /admin/revenue`

**Auth Required:** Yes (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 5000000,
    "completedOrders": 450
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (not authorized)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Payment**: 10 requests per hour

When rate limit is exceeded, you'll receive a `429` response:

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Testing

Use the following test credentials in development:

**Admin:**
- Email: admin@verra.com
- Password: admin123

**Vendor:**
- Email: vendor@verra.com
- Password: vendor123

**User:**
- Email: user@verra.com
- Password: user123

---

## Postman Collection

Import the Postman collection for easy API testing:

[Download Postman Collection](./postman_collection.json)

---

## Support

For API support, contact: api-support@verra.com
