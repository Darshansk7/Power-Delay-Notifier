const CustomerModel = require('../models/customerModel');

class CustomerController {
  // Register a new customer
  static async registerCustomer(req, res) {
    try {
      const { name, email, area } = req.body;

      // Create customer
      const result = await CustomerModel.createCustomer(name, email, area);

      res.status(201).json({
        success: true,
        message: 'Customer registered successfully',
        data: {
          id: result.id,
          name,
          email,
          area
        }
      });
    } catch (error) {
      console.error('Customer registration error:', error);
      
      if (error.message === 'Email already registered') {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to register customer',
        error: error.message
      });
    }
  }

  // Update customer area
  static async updateCustomerArea(req, res) {
    try {
      const { email, area } = req.body;

      // Update customer area
      await CustomerModel.updateCustomerArea(email, area);

      res.json({
        success: true,
        message: 'Customer area updated successfully',
        data: { email, area }
      });
    } catch (error) {
      console.error('Customer area update error:', error);
      
      if (error.message === 'Customer not found') {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update customer area',
        error: error.message
      });
    }
  }

  // Get customer by email
  static async getCustomerByEmail(req, res) {
    try {
      const { email } = req.params;

      const customer = await CustomerModel.getCustomerByEmail(email);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Get customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get customer',
        error: error.message
      });
    }
  }

  // Get all customers
  static async getAllCustomers(req, res) {
    try {
      const customers = await CustomerModel.getAllCustomers();

      res.json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error) {
      console.error('Get all customers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get customers',
        error: error.message
      });
    }
  }
}

module.exports = CustomerController; 