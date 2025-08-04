const { pool } = require('../config/database');

class NotificationModel {
  // Log a sent notification
  static async logNotification(area, message, recipientsCount, sentBy) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO notifications (area, message, recipients_count, sent_by) VALUES (?, ?, ?, ?)',
        [area, message, recipientsCount, sentBy]
      );
      return { success: true, id: result.insertId };
    } catch (error) {
      throw error;
    }
  }

  // Get all notifications
  static async getAllNotifications() {
    try {
      const [rows] = await pool.execute(`
        SELECT n.id, n.area, n.message, n.recipients_count, n.created_at, 
               t.name as sent_by_name
        FROM notifications n
        LEFT JOIN technicians t ON n.sent_by = t.id
        ORDER BY n.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get notifications by technician
  static async getNotificationsByTechnician(technicianId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, area, message, recipients_count, created_at FROM notifications WHERE sent_by = ? ORDER BY created_at DESC',
        [technicianId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get notification statistics
  static async getNotificationStats() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          COUNT(*) as total_notifications,
          SUM(recipients_count) as total_recipients,
          COUNT(DISTINCT area) as unique_areas
        FROM notifications
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationModel; 