const express = require('express');
const router = express.Router();
const {
  getMyOrders,
  getOrderById,
  getVendorOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateOrderStatus, checkValidation } = require('../middleware/validateMiddleware');

// User routes
router.get('/my-orders', protect, authorize('user'), getMyOrders);
router.get('/:id', protect, authorize('user'), getOrderById);

// Vendor routes
router.get('/vendor/my-orders', protect, authorize('vendor'), getVendorOrders);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/admin/status/:id', protect, authorize('admin'), validateOrderStatus, checkValidation, updateOrderStatus);

module.exports = router;
