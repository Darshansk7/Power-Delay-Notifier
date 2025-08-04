const TechnicianModel = require('../models/technicianModel');
const { generateToken } = require('../middleware/authMiddleware');

class TechnicianController {
  // Register a new technician (must be in valid technicians list)
  static async registerTechnician(req, res) {
    try {
      const { techId, name, email, password } = req.body;

      // Create technician (this will validate against valid technicians list)
      const result = await TechnicianModel.createTechnician(techId, name, email, password);

      res.status(201).json({
        success: true,
        message: 'Technician registered successfully',
        data: {
          id: result.id,
          techId,
          name,
          email
        }
      });
    } catch (error) {
      console.error('Technician registration error:', error);
      
      if (error.message === 'Technician not found in valid technicians list. Please contact your administrator.') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Technician already registered') {
        return res.status(409).json({
          success: false,
          message: 'Technician already registered'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to register technician',
        error: error.message
      });
    }
  }

  // Login technician by tech_id
  static async loginTechnicianByTechId(req, res) {
    try {
      const { techId, password } = req.body;

      // Authenticate technician
      const technician = await TechnicianModel.loginTechnicianByTechId(techId, password);

      // Generate JWT token
      const token = generateToken(technician.id);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          technician,
          token
        }
      });
    } catch (error) {
      console.error('Technician login error:', error);
      
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          success: false,
          message: 'Invalid Tech ID or password'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to login',
        error: error.message
      });
    }
  }

  // Login technician by email (for backward compatibility)
  static async loginTechnician(req, res) {
    try {
      const { email, password } = req.body;

      // Authenticate technician
      const technician = await TechnicianModel.loginTechnician(email, password);

      // Generate JWT token
      const token = generateToken(technician.id);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          technician,
          token
        }
      });
    } catch (error) {
      console.error('Technician login error:', error);
      
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to login',
        error: error.message
      });
    }
  }

  // Get technician profile
  static async getTechnicianProfile(req, res) {
    try {
      const technician = await TechnicianModel.getTechnicianById(req.techId);

      if (!technician) {
        return res.status(404).json({
          success: false,
          message: 'Technician not found'
        });
      }

      // Get assigned areas
      const areas = await TechnicianModel.getTechnicianAreas(req.techId);

      res.json({
        success: true,
        data: {
          ...technician,
          assignedAreas: areas
        }
      });
    } catch (error) {
      console.error('Get technician profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get technician profile',
        error: error.message
      });
    }
  }

  // Get all registered technicians
  static async getAllRegisteredTechnicians(req, res) {
    try {
      const technicians = await TechnicianModel.getAllRegisteredTechnicians();

      res.json({
        success: true,
        data: technicians,
        count: technicians.length
      });
    } catch (error) {
      console.error('Get all registered technicians error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get registered technicians',
        error: error.message
      });
    }
  }

  // Get all valid technicians (pre-approved by department)
  static async getAllValidTechnicians(req, res) {
    try {
      const technicians = await TechnicianModel.getAllValidTechnicians();

      res.json({
        success: true,
        data: technicians,
        count: technicians.length
      });
    } catch (error) {
      console.error('Get all valid technicians error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get valid technicians',
        error: error.message
      });
    }
  }

  // Assign areas to technician
  static async assignAreas(req, res) {
    try {
      const { areas } = req.body;
      const technicianId = req.techId;

      await TechnicianModel.assignAreasToTechnician(technicianId, areas);

      res.json({
        success: true,
        message: 'Areas assigned successfully',
        data: { areas }
      });
    } catch (error) {
      console.error('Assign areas error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign areas',
        error: error.message
      });
    }
  }

  // Get available areas
  static async getAvailableAreas(req, res) {
    try {
      const areas = [
        'chickpete',
        'balepete', 
        'akkipete',
        'kumbarpete',
        'chamrajpete',
        'nagarthpete',
        'cubbonpete'
      ];

      res.json({
        success: true,
        data: areas
      });
    } catch (error) {
      console.error('Get areas error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get areas',
        error: error.message
      });
    }
  }

  // Validate tech_id and email against valid technicians list
  static async validateTechIdAndEmail(req, res) {
    try {
      const { techId, email } = req.body;

      const isValid = await TechnicianModel.validateTechIdAndEmail(techId, email);

      res.json({
        success: true,
        data: { isValid }
      });
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate',
        error: error.message
      });
    }
  }
}

module.exports = TechnicianController; 