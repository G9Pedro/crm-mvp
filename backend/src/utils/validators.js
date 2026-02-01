const { body, validationResult } = require('express-validator');

/**
 * Validation middleware to check for errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

/**
 * Register validation rules
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

/**
 * Login validation rules
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate,
];

/**
 * Contact validation rules
 */
const validateContact = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name must not exceed 50 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name must not exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please provide a valid phone number'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Company name must not exceed 100 characters'),
  body('status')
    .optional()
    .isIn(['lead', 'prospect', 'customer', 'inactive'])
    .withMessage('Status must be one of: lead, prospect, customer, inactive'),
  validate,
];

/**
 * Deal validation rules
 */
const validateDeal = [
  body('title')
    .trim()
    .notEmpty().withMessage('Deal title is required')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),
  body('value')
    .notEmpty().withMessage('Deal value is required')
    .isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('contact')
    .notEmpty().withMessage('Contact is required')
    .isMongoId().withMessage('Invalid contact ID'),
  body('stage')
    .optional()
    .isIn(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'])
    .withMessage('Invalid stage'),
  body('probability')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Probability must be between 0 and 100'),
  body('expectedCloseDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  validate,
];

/**
 * Email validation rules
 */
const validateEmail = [
  body('contactId')
    .notEmpty().withMessage('Contact ID is required')
    .isMongoId().withMessage('Invalid contact ID'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 200 }).withMessage('Subject must not exceed 200 characters'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required'),
  validate,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateContact,
  validateDeal,
  validateEmail,
};
