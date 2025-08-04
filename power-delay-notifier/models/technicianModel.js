const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class TechnicianModel {
  // Check if technician is in valid technicians list
  static async isValidTechnician(techId, email) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, tech_id, name, email, department FROM valid_technicians WHERE tech_id = ? AND email = ?',
        [techId, email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Register a new technician (must be in valid technicians list)
  static async createTechnician(techId, name, email, password) {
    try {
      // First check if technician is in valid technicians list
      const validTech = await this.isValidTechnician(techId, email);
      if (!validTech) {
        throw new Error('Technician not found in valid technicians list. Please contact your administrator.');
      }

      // Check if already registered
      const [existingRows] = await pool.execute(
        'SELECT id FROM registered_technicians WHERE tech_id = ? OR email = ?',
        [techId, email]
      );
      
      if (existingRows.length > 0) {
        throw new Error('Technician already registered');
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const [result] = await pool.execute(
        'INSERT INTO registered_technicians (tech_id, name, email, password) VALUES (?, ?, ?, ?)',
        [techId, name, email, hashedPassword]
      );
      
      return { success: true, id: result.insertId };
    } catch (error) {
      throw error;
    }
  }

  // Login technician by tech_id
  static async loginTechnicianByTechId(techId, password) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, tech_id, name, email, password FROM registered_technicians WHERE tech_id = ?',
        [techId]
      );
      
      if (rows.length === 0) {
        throw new Error('Invalid credentials');
      }
      
      const technician = rows[0];
      const isPasswordValid = await bcrypt.compare(password, technician.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
      
      // Remove password from response
      const { password: _, ...technicianWithoutPassword } = technician;
      return technicianWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Login technician by email (for backward compatibility)
  static async loginTechnician(email, password) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, tech_id, name, email, password FROM registered_technicians WHERE email = ?',
        [email]
      );
      
      if (rows.length === 0) {
        throw new Error('Invalid credentials');
      }
      
      const technician = rows[0];
      const isPasswordValid = await bcrypt.compare(password, technician.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
      
      // Remove password from response
      const { password: _, ...technicianWithoutPassword } = technician;
      return technicianWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Get technician by ID
  static async getTechnicianById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, tech_id, name, email FROM registered_technicians WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get technician by tech_id
  static async getTechnicianByTechId(techId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, tech_id, name, email FROM registered_technicians WHERE tech_id = ?',
        [techId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get technician by email
  static async getTechnicianByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, tech_id, name, email FROM registered_technicians WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get all registered technicians
  static async getAllRegisteredTechnicians() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, tech_id, name, email, created_at FROM registered_technicians ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all valid technicians
  static async getAllValidTechnicians() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, tech_id, name, email, department, created_at FROM valid_technicians ORDER BY tech_id'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Assign areas to technician
  static async assignAreasToTechnician(technicianId, areas) {
    try {
      const connection = await pool.getConnection();
      
      // Remove existing assignments
      await connection.execute(
        'DELETE FROM technician_areas WHERE technician_id = ?',
        [technicianId]
      );
      
      // Add new assignments
      for (const area of areas) {
        await connection.execute(
          'INSERT INTO technician_areas (technician_id, area) VALUES (?, ?)',
          [technicianId, area]
        );
      }
      
      connection.release();
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Get areas assigned to technician
  static async getTechnicianAreas(technicianId) {
    try {
      const [rows] = await pool.execute(
        'SELECT area FROM technician_areas WHERE technician_id = ? ORDER BY area',
        [technicianId]
      );
      return rows.map(row => row.area);
    } catch (error) {
      throw error;
    }
  }

  // Validate tech_id and email match in valid technicians list
  static async validateTechIdAndEmail(techId, email) {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM valid_technicians WHERE tech_id = ? AND email = ?',
        [techId, email]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TechnicianModel; 