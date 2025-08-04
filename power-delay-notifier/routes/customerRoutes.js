const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const {
  validateCustomerRegistration,
  validateCustomerAreaUpdate,
  handleValidationErrors
} = require('../utils/validators');

// Register a new customer
router.post('/register',
  validateCustomerRegistration,
  handleValidationErrors,
  CustomerController.registerCustomer
);

// Update customer area
router.put('/area',
  validateCustomerAreaUpdate,
  handleValidationErrors,
  CustomerController.updateCustomerArea
);

// Get customer by email
router.get('/:email', CustomerController.getCustomerByEmail);

// Get all customers
router.get('/', CustomerController.getAllCustomers);

module.exports = router; 