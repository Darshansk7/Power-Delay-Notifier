const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  validateNotification,
  handleValidationErrors
} = require('../utils/validators');

// Send notification to customers in an area (protected)
router.post('/send',
  authenticateToken,
  validateNotification,
  handleValidationErrors,
  NotificationController.sendNotification
);

// Get all notifications (protected)
router.get('/',
  authenticateToken,
  NotificationController.getAllNotifications
);

// Get notifications by technician (protected)
router.get('/my-notifications',
  authenticateToken,
  NotificationController.getNotificationsByTechnician
);

// Get notification statistics (protected)
router.get('/stats',
  authenticateToken,
  NotificationController.getNotificationStats
);

// Test email service (protected)
router.get('/test-email',
  authenticateToken,
  NotificationController.testEmailService
);

module.exports = router; 