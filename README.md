# VERRA - Luxury E-Commerce Platform

A premium multi-vendor e-commerce platform built with the MERN stack, featuring a sophisticated dark luxury UI theme with gold accents. VERRA enables luxury brands and vendors to showcase and sell high-end products through a secure, scalable marketplace.

![VERRA Platform](https://via.placeholder.com/1200x400/0A0A0A/C6A75E?text=VERRA+Luxury+E-Commerce)

## ✨ Features

### For Customers
- 🛍️ Browse luxury products across multiple categories
- 🔍 Advanced search and filtering capabilities
- ❤️ Wishlist management
- 🛒 Shopping cart with real-time updates
- 💳 Secure payment processing via Razorpay
- 📦 Order tracking and history
- 👤 Profile management

### For Vendors
- 📊 Comprehensive vendor dashboard
- ➕ Product management (create, edit, delete)
- 📈 Sales analytics and earnings tracking
- 📋 Order management for vendor products
- ⏳ Product approval workflow

### For Administrators
- 🎛️ Platform-wide dashboard with analytics
- ✅ Product approval system
- 👥 User and vendor management
- 🚫 User blocking capabilities
- 📊 Revenue tracking
- 📦 Order status management

### Security Features
- 🔒 JWT-based authentication with HttpOnly cookies
- 🛡️ Rate limiting on all endpoints
- 🔐 Input sanitization and validation
- 🚨 Helmet security headers
- 🔑 Role-based access control (RBAC)
- 💉 NoSQL injection prevention
- 🧹 XSS protection

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay Integration
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize
- **Validation**: express-validator
- **Testing**: Jest, Supertest, fast-check (property-based testing)

### Frontend
- **Framework**: React.js
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API
- **UI Theme**: Dark luxury with gold accents (#C6A75E)
- **Fonts**: Playfair Display (headings), Inter (body)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Razorpay account (for payment integration)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/verra-ecommerce.git
cd verra-ecommerce
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/verra
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/verra

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder using a static server
```

## 🌱 Seeding Data

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- Sample admin, vendor, and user accounts
- Sample products across all categories
- Test orders

### Default Accounts

After seeding, you can login with:

**Admin:**
- Email: admin@verra.com
- Password: admin123

**Vendor:**
- Email: vendor@verra.com
- Password: vendor123

**User:**
- Email: user@verra.com
- Password: user123

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run property-based tests
npm run test:property

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage

The project maintains 80%+ test coverage across:
- Unit tests for models, controllers, and utilities
- Property-based tests for core business logic
- Integration tests for complete user flows

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |

### Product Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/products` | Get all approved products | No | - |
| GET | `/products/search` | Search products | No | - |
| GET | `/products/:id` | Get product by ID | No | - |
| POST | `/products` | Create product | Yes | Vendor |
| PUT | `/products/:id` | Update product | Yes | Vendor |
| DELETE | `/products/:id` | Delete product | Yes | Vendor |
| GET | `/products/vendor/my-products` | Get vendor's products | Yes | Vendor |
| GET | `/products/admin/all` | Get all products | Yes | Admin |
| PUT | `/products/admin/approve/:id` | Approve/reject product | Yes | Admin |

### User Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/users/profile` | Get user profile | Yes | All |
| PUT | `/users/profile` | Update profile | Yes | All |
| POST | `/users/cart/add` | Add to cart | Yes | User |
| PUT | `/users/cart/update` | Update cart item | Yes | User |
| DELETE | `/users/cart/remove/:productId` | Remove from cart | Yes | User |
| GET | `/users/cart` | Get cart | Yes | User |
| POST | `/users/wishlist/add` | Add to wishlist | Yes | User |
| DELETE | `/users/wishlist/remove/:productId` | Remove from wishlist | Yes | User |
| GET | `/users/wishlist` | Get wishlist | Yes | User |

### Order Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/orders/my-orders` | Get user's orders | Yes | User |
| GET | `/orders/:id` | Get order by ID | Yes | User |
| GET | `/orders/vendor/my-orders` | Get vendor's orders | Yes | Vendor |
| GET | `/orders/admin/all` | Get all orders | Yes | Admin |
| PUT | `/orders/admin/status/:id` | Update order status | Yes | Admin |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/payment/create-order` | Create Razorpay order | Yes | User |
| POST | `/payment/verify` | Verify payment | Yes | User |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/dashboard` | Get dashboard stats | Yes | Admin |
| GET | `/admin/users` | Get all users | Yes | Admin |
| GET | `/admin/vendors` | Get all vendors | Yes | Admin |
| PUT | `/admin/users/block/:id` | Block/unblock user | Yes | Admin |
| GET | `/admin/revenue` | Get total revenue | Yes | Admin |

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🎨 UI Theme

VERRA features a sophisticated dark luxury theme:

### Colors
- **Background**: #0A0A0A (deep black)
- **Secondary Background**: #1A1A1A (dark gray)
- **Accent**: #C6A75E (gold)
- **Text**: White and neutral grays

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, modern)

### Design Principles
- Minimalist and elegant
- High contrast for readability
- Smooth animations and transitions
- Responsive across all devices

## 🔒 Security

VERRA implements multiple security layers:

1. **Authentication**: JWT tokens stored in HttpOnly cookies
2. **Authorization**: Role-based access control (RBAC)
3. **Rate Limiting**: Prevents brute force attacks
4. **Input Validation**: express-validator on all endpoints
5. **Sanitization**: NoSQL injection and XSS prevention
6. **Security Headers**: Helmet middleware
7. **Password Hashing**: bcrypt with 10 salt rounds
8. **CORS**: Configured for specific origins

For detailed security information, see [backend/SECURITY.md](./backend/SECURITY.md)

## 📦 Deployment

### Backend Deployment (Heroku Example)

```bash
# Login to Heroku
heroku login

# Create app
heroku create verra-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set RAZORPAY_KEY_ID=your-razorpay-key
heroku config:set RAZORPAY_KEY_SECRET=your-razorpay-secret
heroku config:set CLIENT_URL=https://your-frontend-url.com

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
REACT_APP_API_URL=https://your-backend-url.herokuapp.com
REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key
```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add database user
4. Whitelist IP addresses
5. Get connection string
6. Update `MONGODB_URI` in environment variables

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ Utility Scripts

```bash
# Create admin user
npm run create-admin

# Change user role
npm run change-role

# Seed database
npm run seed

# Verify database indexes
npm run verify-indexes
```

## 📁 Project Structure

```
verra-ecommerce/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── tests/           # Test files
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Context providers
│       ├── layouts/     # Layout components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       ├── utils/       # Utility functions
│       └── App.jsx      # Main app component
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Razorpay for payment integration
- MongoDB for database
- React and Express communities
- Tailwind CSS for styling framework

## 📞 Support

For support, email support@verra.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Product reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Social media integration
- [ ] Advanced search with filters
- [ ] Recommendation engine

---

**Built with ❤️ for luxury e-commerce**
