const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateProfileUpdate, validateCartAdd, validateCartUpdate, validateWishlistAdd } = require('../middleware/validateMiddleware');

// Profile routes (all authenticated users)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateProfileUpdate, updateProfile);

// Cart routes (user role only)
router.post('/cart/add', protect, authorize('user'), validateCartAdd, addToCart);
router.put('/cart/update', protect, authorize('user'), validateCartUpdate, updateCart);
router.delete('/cart/remove/:productId', protect, authorize('user'), removeFromCart);
router.get('/cart', protect, authorize('user'), getCart);

// Wishlist routes (user role only)
router.post('/wishlist/add', protect, authorize('user'), validateWishlistAdd, addToWishlist);
router.delete('/wishlist/remove/:productId', protect, authorize('user'), removeFromWishlist);
router.get('/wishlist', protect, authorize('user'), getWishlist);

module.exports = router;
