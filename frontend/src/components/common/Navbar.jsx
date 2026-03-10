import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'vendor':
        return '/vendor/dashboard';
      default:
        return '/user/dashboard';
    }
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl font-playfair font-bold text-gold tracking-wider">
              VERRA
            </h1>
          </Link>

          {/* Desktop Center Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link
              to="/products"
              className="text-primary hover:text-gold transition-colors text-sm font-medium tracking-wide"
            >
              Shop
            </Link>
            <Link
              to="/collections"
              className="text-primary hover:text-gold transition-colors text-sm font-medium tracking-wide"
            >
              Collections
            </Link>
            <Link
              to="/new-arrivals"
              className="text-primary hover:text-gold transition-colors text-sm font-medium tracking-wide"
            >
              New Arrivals
            </Link>
            <Link
              to="/brands"
              className="text-primary hover:text-gold transition-colors text-sm font-medium tracking-wide"
            >
              Brands
            </Link>
            <Link
              to="/about"
              className="text-primary hover:text-gold transition-colors text-sm font-medium tracking-wide"
            >
              About
            </Link>
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Search Icon */}
            <button className="text-primary hover:text-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {user ? (
              <>
                {/* Wishlist Icon */}
                {user.role === 'user' && (
                  <Link
                    to="/user/wishlist"
                    className="text-primary hover:text-gold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Link>
                )}

                {/* Cart Icon */}
                {user.role === 'user' && (
                  <Link
                    to="/user/cart"
                    className="relative text-primary hover:text-gold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gold text-background text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <Link
                    to={getDashboardLink()}
                    className="text-secondary hover:text-gold transition-colors text-sm"
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-secondary hover:text-gold transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gold hover:bg-opacity-90 text-background font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:scale-105 text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-primary hover:text-gold"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link
              to="/products"
              className="block px-4 py-3 text-primary hover:text-gold hover:bg-background rounded-2xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/products"
              className="block px-4 py-3 text-primary hover:text-gold hover:bg-background rounded-2xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/products"
              className="block px-4 py-3 text-primary hover:text-gold hover:bg-background rounded-2xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              to="/products"
              className="block px-4 py-3 text-primary hover:text-gold hover:bg-background rounded-2xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Brands
            </Link>
            <Link
              to="/about"
              className="block px-4 py-3 text-primary hover:text-gold hover:bg-background rounded-2xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block px-4 py-3 text-primary hover:text-gold hover:bg-background rounded-2xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {user.role === 'user' && (
                  <>
                    <Link
                      to="/user/cart"
                      className="block px-4 py-3 text-primary hover:text-gold hover:bg-background rounded-2xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Cart {cartItems.length > 0 && `(${cartItems.length})`}
                    </Link>
                    <Link
                      to="/user/wishlist"
                      className="block px-4 py-3 text-primary hover:text-gold hover:bg-background rounded-2xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                  </>
                )}

                <div className="px-4 py-2 text-secondary text-sm">
                  {user.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-primary hover:text-gold hover:bg-background rounded-2xl transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block bg-gold hover:bg-opacity-90 text-background font-semibold py-3 px-6 rounded-full transition-all duration-300 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
