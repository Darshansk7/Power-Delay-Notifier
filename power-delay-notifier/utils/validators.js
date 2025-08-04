const { body, validationResult } = require('express-validator');

// Validation rules for customer registration
const validateCustomerRegistration = [
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
  
  body('area')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Area must be between 2 and 100 characters')
];

// Validation rules for customer area update
const validateCustomerAreaUpdate = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('area')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Area must be between 2 and 100 characters')
];

// Validation rules for technician registration
const validateTechnicianRegistration = [
  body('techId')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Tech ID must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Tech ID can only contain letters, numbers, hyphens, and underscores'),
  
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
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Validation rules for technician login by tech_id
const validateTechnicianLoginByTechId = [
  body('techId')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Tech ID must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Tech ID can only contain letters, numbers, hyphens, and underscores'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for technician login by email (for backward compatibility)
const validateTechnicianLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for notification sending
const validateNotification = [
  body('areas')
    .isArray({ min: 1 })
    .withMessage('At least one area must be selected'),
  
  body('areas.*')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Each area must be between 2 and 100 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// Helper function to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Custom validation functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  validateCustomerRegistration,
  validateCustomerAreaUpdate,
  validateTechnicianRegistration,
  validateTechnicianLogin,
  validateTechnicianLoginByTechId,
  validateNotification,
  handleValidationErrors,
  isValidEmail,
  isValidPassword,
  sanitizeInput
}; 