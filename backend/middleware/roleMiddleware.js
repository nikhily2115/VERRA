/**
 * Role-based authorization middleware
 * Restricts access to routes based on user roles
 * Must be used after protect middleware
 * 
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'vendor', 'user')
 * @returns {function} Express middleware function
 * 
 * @example
 * router.get('/admin/dashboard', protect, authorize('admin'), getDashboard);
 * router.post('/products', protect, authorize('vendor'), createProduct);
 * router.get('/cart', protect, authorize('user'), getCart);
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is attached by protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

module.exports = { authorize };
