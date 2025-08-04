const express = require('express');
const router = express.Router();
const TechnicianController = require('../controllers/technicianController');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  validateTechnicianRegistration,
  validateTechnicianLogin,
  validateTechnicianLoginByTechId,
  handleValidationErrors
} = require('../utils/validators');

// Register a new technician
router.post('/register',
  validateTechnicianRegistration,
  handleValidationErrors,
  TechnicianController.registerTechnician
);

// Login technician by tech_id
router.post('/login-by-techid',
  validateTechnicianLoginByTechId,
  handleValidationErrors,
  TechnicianController.loginTechnicianByTechId
);

// Login technician by email (for backward compatibility)
router.post('/login',
  validateTechnicianLogin,
  handleValidationErrors,
  TechnicianController.loginTechnician
);

// Get technician profile (protected)
router.get('/profile',
  authenticateToken,
  TechnicianController.getTechnicianProfile
);

// Get all registered technicians (protected)
router.get('/registered',
  authenticateToken,
  TechnicianController.getAllRegisteredTechnicians
);

// Get all valid technicians (pre-approved by department)
router.get('/valid',
  TechnicianController.getAllValidTechnicians
);

// Get available areas
router.get('/areas',
  TechnicianController.getAvailableAreas
);

// Assign areas to technician (protected)
router.post('/assign-areas',
  authenticateToken,
  TechnicianController.assignAreas
);

// Validate tech_id and email against valid technicians list
router.post('/validate',
  TechnicianController.validateTechIdAndEmail
);

module.exports = router; 