const { pool } = require('../config/database');

class CustomerModel {
  // Register a new customer
  static async createCustomer(name, email, area) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO customers (name, email, area) VALUES (?, ?, ?)',
        [name, email, area]
      );
      return { success: true, id: result.insertId };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already registered');
      }
      throw error;
    }
  }

  // Update customer area
  static async updateCustomerArea(email, area) {
    try {
      const [result] = await pool.execute(
        'UPDATE customers SET area = ? WHERE email = ?',
        [area, email]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Customer not found');
      }
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Get customers by area
  static async getCustomersByArea(area) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, area FROM customers WHERE area = ?',
        [area]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get customer by email
  static async getCustomerByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, area FROM customers WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get all customers
  static async getAllCustomers() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, area, created_at FROM customers ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CustomerModel; 