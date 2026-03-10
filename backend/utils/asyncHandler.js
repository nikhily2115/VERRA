/**
 * Async error wrapper utility
 * Wraps async route handlers to catch errors and pass them to error middleware
 * Eliminates the need for try-catch blocks in every async route handler
 * 
 * @param {function} fn - Async function to wrap
 * @returns {function} Express middleware function
 * 
 * @example
 * const asyncHandler = require('../utils/asyncHandler');
 * 
 * router.get('/products', asyncHandler(async (req, res) => {
 *   const products = await Product.find();
 *   res.json({ success: true, products });
 * }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
