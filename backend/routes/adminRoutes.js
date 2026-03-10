const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllVendors,
  blockUser,
  getTotalRevenue,
  getVendorStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes require admin role
router.use(protect, authorize('admin'));

// Dashboard and statistics
router.get('/dashboard', getDashboardStats);
router.get('/revenue', getTotalRevenue);
router.get('/vendor-stats/:id', getVendorStats);

// User management
router.get('/users', getAllUsers);
router.get('/vendors', getAllVendors);
router.put('/users/block/:id', blockUser);

module.exports = router;
