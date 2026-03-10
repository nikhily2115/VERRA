const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validatePaymentCreate, validatePaymentVerify, checkValidation } = require('../middleware/validateMiddleware');

// Payment routes (user role only)
router.post('/create-order', protect, authorize('user'), validatePaymentCreate, checkValidation, createRazorpayOrder);
router.post('/verify', protect, authorize('user'), validatePaymentVerify, checkValidation, verifyPayment);

module.exports = router;
