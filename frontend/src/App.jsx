import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { ToastProvider } from './context/ToastContext';

// Common Components
import ScrollToTop from './components/common/ScrollToTop';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import VendorLayout from './layouts/VendorLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import Collections from './pages/public/Collections';
import NewArrivals from './pages/public/NewArrivals';
import Brands from './pages/public/Brands';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import Cart from './pages/user/Cart';
import Wishlist from './pages/user/Wishlist';
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import MyProducts from './pages/vendor/MyProducts';
import AddProduct from './pages/vendor/AddProduct';
import EditProduct from './pages/vendor/EditProduct';
import VendorOrders from './pages/vendor/VendorOrders';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageUsers from './pages/admin/ManageUsers';
import ManageVendors from './pages/admin/ManageVendors';
import AllOrders from './pages/admin/AllOrders';
import OrderDetails from './pages/admin/OrderDetails';

// Protected Route
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <ToastProvider>
              <div className="min-h-screen bg-dark-primary">
                <Routes>
                  {/* Public Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/new-arrivals" element={<NewArrivals />} />
                    <Route path="/brands" element={<Brands />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                  </Route>

                  {/* User Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                    <Route element={<UserLayout />}>
                      <Route path="/user/dashboard" element={<UserDashboard />} />
                      <Route path="/user/cart" element={<Cart />} />
                      <Route path="/user/wishlist" element={<Wishlist />} />
                      <Route path="/user/orders" element={<Orders />} />
                      <Route path="/user/profile" element={<Profile />} />
                    </Route>
                  </Route>

                  {/* Vendor Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
                    <Route element={<VendorLayout />}>
                      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                      <Route path="/vendor/products" element={<MyProducts />} />
                      <Route path="/vendor/products/add" element={<AddProduct />} />
                      <Route path="/vendor/products/edit/:id" element={<EditProduct />} />
                      <Route path="/vendor/orders" element={<VendorOrders />} />
                    </Route>
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route element={<AdminLayout />}>
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/products" element={<ManageProducts />} />
                      <Route path="/admin/users" element={<ManageUsers />} />
                      <Route path="/admin/vendors" element={<ManageVendors />} />
                      <Route path="/admin/orders" element={<AllOrders />} />
                      <Route path="/orders/:id" element={<OrderDetails />} />
                    </Route>
                  </Route>
                </Routes>
              </div>
            </ToastProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
