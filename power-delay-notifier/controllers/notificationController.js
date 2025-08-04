const CustomerModel = require('../models/customerModel');
const NotificationModel = require('../models/notificationModel');
const emailService = require('../services/emailService');

class NotificationController {
  // Send notification to customers in specific areas
  static async sendNotification(req, res) {
    try {
      const { areas, message } = req.body;
      const technicianId = req.techId;
      const technicianName = req.technician.name;

      // Ensure areas is an array
      const areaArray = Array.isArray(areas) ? areas : [areas];
      
      if (areaArray.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one area must be specified'
        });
      }

      let totalRecipients = 0;
      let totalSent = 0;
      let totalFailed = 0;
      const allErrors = [];
      const results = [];

      // Process each area
      for (const area of areaArray) {
        try {
          // Get customers in the specified area
          const customers = await CustomerModel.getCustomersByArea(area);

          if (customers.length === 0) {
            results.push({
              area,
              status: 'no_customers',
              message: `No customers found in area: ${area}`,
              recipients: 0,
              sent: 0,
              failed: 0
            });
            continue;
          }

          // Send emails to all customers in the area
          const emailResult = await emailService.sendNotificationToArea(
            customers,
            area,
            message,
            technicianName
          );

          // Log the notification
          await NotificationModel.logNotification(
            area,
            message,
            emailResult.sent,
            technicianId
          );

          totalRecipients += customers.length;
          totalSent += emailResult.sent;
          totalFailed += emailResult.failed;
          
          if (emailResult.errors && emailResult.errors.length > 0) {
            allErrors.push(...emailResult.errors);
          }

          results.push({
            area,
            status: 'success',
            recipients: customers.length,
            sent: emailResult.sent,
            failed: emailResult.failed
          });

        } catch (error) {
          console.error(`Error processing area ${area}:`, error);
          results.push({
            area,
            status: 'error',
            message: error.message,
            recipients: 0,
            sent: 0,
            failed: 0
          });
          allErrors.push(`Error processing area ${area}: ${error.message}`);
        }
      }

      // Determine overall success
      const hasSuccess = results.some(r => r.status === 'success');
      const hasErrors = results.some(r => r.status === 'error');

      const responseData = {
        areas: areaArray,
        message,
        totalRecipients,
        totalSent,
        totalFailed,
        results,
        errors: allErrors
      };

      if (hasSuccess) {
        res.json({
          success: true,
          message: `Notification sent successfully to ${totalSent} recipients across ${areaArray.length} area(s)`,
          data: responseData
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send notifications to any areas',
          data: responseData
        });
      }

    } catch (error) {
      console.error('Send notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
        error: error.message
      });
    }
  }

  // Get all notifications (for admin/technician dashboard)
  static async getAllNotifications(req, res) {
    try {
      const notifications = await NotificationModel.getAllNotifications();

      res.json({
        success: true,
        data: notifications,
        count: notifications.length
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get notifications',
        error: error.message
      });
    }
  }

  // Get notifications by technician
  static async getNotificationsByTechnician(req, res) {
    try {
      const notifications = await NotificationModel.getNotificationsByTechnician(req.techId);

      res.json({
        success: true,
        data: notifications,
        count: notifications.length
      });
    } catch (error) {
      console.error('Get technician notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get notifications',
        error: error.message
      });
    }
  }

  // Get notification statistics
  static async getNotificationStats(req, res) {
    try {
      const stats = await NotificationModel.getNotificationStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get notification stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get notification statistics',
        error: error.message
      });
    }
  }

  // Test email service
  static async testEmailService(req, res) {
    try {
      const isConnected = await emailService.testConnection();

      if (isConnected) {
        res.json({
          success: true,
          message: 'Email service is working properly'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Email service configuration error'
        });
      }
    } catch (error) {
      console.error('Test email service error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to test email service',
        error: error.message
      });
    }
  }
}

module.exports = NotificationController; 