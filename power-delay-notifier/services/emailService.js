const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send email to a single recipient
  async sendMail({ to, subject, html }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      throw error;
    }
  }

  // Send notification to multiple recipients
  async sendNotificationToArea(recipients, area, message, technicianName) {
    const subject = `Power Delay Alert - ${area}`;
    const html = `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ff6b6b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">⚠️ Power Delay Alert</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #495057; margin-top: 0;">Area: ${area}</h2>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 0; line-height: 1.6; color: #212529;">
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              <strong>Sent by:</strong> ${technicianName} <p> ( Technician, KPTCL )<br>
              <strong>Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
              This is an automated notification from the Power Delay Notifier system. 
              Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;

    const results = [];
    const errors = [];

    // Send emails to all recipients
    for (const recipient of recipients) {
      try {
        const result = await this.sendMail({
          to: recipient.email,
          subject,
          html
        });
        results.push({ email: recipient.email, success: true, messageId: result.messageId });
      } catch (error) {
        errors.push({ email: recipient.email, error: error.message });
      }
    }

    return {
      success: results.length > 0,
      sent: results.length,
      failed: errors.length,
      results,
      errors
    };
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service configured successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service configuration failed:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService(); 