/**
 * Input sanitization utilities
 * Prevents XSS and injection attacks
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes potentially dangerous script tags
 * @param {string} data - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (data) => {
  if (typeof data === 'string') {
    // Remove script tags and their content
    return data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return data;
};

/**
 * Setup sanitization middleware for Express app
 * Configures mongo-sanitize and xss-clean
 * @param {object} app - Express app instance
 */
const setupSanitization = (app) => {
  const mongoSanitize = require('express-mongo-sanitize');
  
  // Prevent NoSQL injection by removing $ and . from user input
  app.use(mongoSanitize());
  
  // Note: xss-clean is deprecated, but we keep it for backward compatibility
  // In production, consider using a more modern XSS prevention library
  try {
    const xss = require('xss-clean');
    app.use(xss());
  } catch (error) {
    console.warn('xss-clean not available, skipping XSS middleware');
  }
};

module.exports = { sanitizeInput, setupSanitization };
