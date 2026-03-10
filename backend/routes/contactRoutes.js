const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');
const { sendContactEmail } = require('../utils/emailService');

const router = express.Router();

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
const submitContactForm = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, email, subject, message } = req.body;
  const referenceId = `VERRA-${Date.now()}`;

  // Log the contact form submission
  logger.info('Contact form submission', {
    name,
    email,
    subject,
    messageLength: message.length,
    referenceId,
    timestamp: new Date().toISOString(),
    ip: req.ip
  });

  // Send email notification
  const emailResult = await sendContactEmail({
    name,
    email,
    subject,
    message,
    referenceId
  });

  // Always return success to user, even if email fails
  res.status(200).json({
    success: true,
    message: emailResult.success 
      ? 'Thank you for your message! We will get back to you within 24 hours. A confirmation email has been sent to your address.'
      : 'Thank you for your message! We will get back to you within 24 hours.',
    data: {
      submittedAt: new Date().toISOString(),
      referenceId,
      emailSent: emailResult.success
    }
  });
});

// Validation middleware
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// Routes
router.post('/', validateContactForm, submitContactForm);

module.exports = router;