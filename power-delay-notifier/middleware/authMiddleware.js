const jwt = require('jsonwebtoken');
const TechnicianModel = require('../models/technicianModel');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if technician still exists in database
    const technician = await TechnicianModel.getTechnicianById(decoded.techId);
    if (!technician) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - technician not found'
      });
    }

    // Attach technician info to request
    req.techId = decoded.techId;
    req.technician = technician;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const technician = await TechnicianModel.getTechnicianById(decoded.techId);
      
      if (technician) {
        req.techId = decoded.techId;
        req.technician = technician;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Generate JWT token
const generateToken = (techId) => {
  return jwt.sign(
    { techId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateToken,
  optionalAuth,
  generateToken
}; 