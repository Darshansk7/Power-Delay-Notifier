# ⚡ Power Delay Notifier - Complete System Documentation

A comprehensive full-stack web application for managing power delay notifications between technicians and customers. This system provides a robust platform for power utility companies to communicate outage information to customers in specific geographic areas.

## 🎯 Project Overview

The Power Delay Notifier is a complete notification management system that enables technicians to send targeted power delay notifications to customers based on geographic areas. The system implements a two-tier technician management approach, secure authentication, automated email broadcasting, and comprehensive data tracking.

## 🎯 Purpose

The primary purpose of this system is to establish an efficient, secure, and reliable communication channel between power utility companies and their customers during power outages and maintenance activities. The system addresses the critical need for timely, accurate, and targeted communication that helps customers prepare for power interruptions and understand restoration timelines.

### Key Objectives:
- **Reduce Customer Frustration**: Provide immediate, accurate information about power delays
- **Improve Service Quality**: Enable proactive communication rather than reactive responses
- **Enhance Operational Efficiency**: Streamline the notification process for technicians
- **Ensure Accountability**: Track all communications and technician activities
- **Maintain Data Security**: Protect customer information and technician credentials

## 📋 Scope

The Power Delay Notifier system encompasses the following functional areas:

### Core Functionality
- **Customer Management**: Registration, area updates, and profile maintenance
- **Technician Management**: Two-tier authentication system with area assignments
- **Notification System**: Automated email broadcasting to geographic areas
- **Area Management**: Predefined geographic zones with customer targeting
- **Audit Trail**: Complete logging of all system activities and communications

### Technical Scope
- **Web Application**: Browser-based interface for technicians and customers
- **RESTful API**: Comprehensive backend services for all operations
- **Database Management**: MySQL-based data storage with relational integrity
- **Email Integration**: Gmail SMTP for reliable email delivery
- **Security Implementation**: JWT authentication, password hashing, input validation

### Operational Scope
- **Geographic Coverage**: Seven predefined areas (chickpete, balepete, akkipete, kumbarpete, chamrajpete, nagarthpete, cubbonpete)
- **User Types**: Technicians (authenticated) and Customers (public registration)
- **Communication Channels**: Email notifications with HTML templates
- **Data Retention**: Persistent storage of all customer and notification data

## 🎯 Applicability

### Target Organizations
- **Power Utility Companies**: Primary users managing power distribution networks
- **Municipal Power Departments**: Local government power service providers
- **Private Power Companies**: Commercial power distribution organizations
- **Emergency Response Teams**: Organizations requiring rapid area-based communications

### Use Case Scenarios
- **Scheduled Maintenance**: Notify customers about planned power interruptions
- **Emergency Outages**: Rapid communication during unexpected power failures
- **Restoration Updates**: Provide status updates during repair operations
- **Area-specific Issues**: Target communications to affected geographic zones
- **Customer Service**: Proactive communication to improve customer satisfaction

### Geographic Applicability
- **Urban Areas**: Dense customer populations requiring efficient communication
- **Suburban Regions**: Spread-out communities needing area-based targeting
- **Industrial Zones**: Business areas requiring detailed outage information
- **Residential Areas**: Home customers needing timely power updates

### Industry Standards Compliance
- **Data Protection**: Secure handling of customer information
- **Communication Standards**: Professional email templates and formatting
- **Accessibility**: Web-based interface accessible on multiple devices
- **Scalability**: Architecture supporting growth and additional areas

## 🏗️ System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js framework
- **Database**: MySQL with connection pooling
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Email Service**: Nodemailer with Gmail SMTP
- **Frontend**: Static HTML/CSS/JavaScript with Fetch API
- **Validation**: Express-validator for input sanitization
- **Security**: Helmet.js for HTTP headers, CORS protection

### Node.js Role in the System
Node.js serves as the runtime environment that powers the entire backend infrastructure. It handles concurrent requests through its event-driven, non-blocking I/O model, making it ideal for managing multiple technician connections and simultaneous email broadcasts. The Express.js framework provides the web server capabilities, middleware support, and routing system that enables the RESTful API architecture.

## 🔐 Authentication System

### JWT (JSON Web Token) Implementation
The system uses JWT for stateless authentication. When a technician logs in successfully, the server generates a JWT token containing the technician's ID and role. This token is stored in the browser's localStorage and sent with every subsequent request in the Authorization header. The middleware validates the token on protected routes and extracts the technician information for database operations.

### Password Security with Bcrypt
All passwords are hashed using bcryptjs before storage in the database. Bcrypt provides salt generation and adaptive hashing, making it resistant to rainbow table attacks and brute force attempts. The system uses a cost factor of 12 for optimal security-performance balance.

### Two-Tier Technician Management
The system implements a sophisticated two-list approach for technician management:

1. **Valid Technicians List**: Pre-approved technicians stored in the `valid_technicians` table with Tech ID, name, email, and department information. This list is managed by the department and serves as the master list of authorized personnel.

2. **Registered Technicians List**: Active users who have completed the registration process, stored in the `registered_technicians` table with Tech ID, email, hashed password, and name. Only technicians from the valid list can register and become active users.

### Authentication Flow
1. Technician enters Tech ID and password on the login form
2. System validates Tech ID exists in registered technicians table
3. Password is compared against bcrypt-hashed stored password
4. Upon successful authentication, JWT token is generated and returned
5. Token is stored in localStorage and used for subsequent API calls
6. Protected routes validate token using middleware before processing requests

## 📧 Gmail Integration and Email Broadcasting

### SMTP Configuration
The system integrates with Gmail's SMTP service using Nodemailer. The configuration includes:
- SMTP Host: smtp.gmail.com
- Port: 587 (TLS)
- Authentication: Gmail username and App Password
- Security: TLS encryption for all email communications

### App Password Setup
Gmail requires App Passwords for SMTP authentication when 2-Step Verification is enabled. The system uses these App Passwords instead of regular account passwords to ensure secure email delivery and avoid authentication issues.

### Email Broadcasting Mechanism
When a technician sends a notification:
1. System queries the database for all customers in the target area
2. Creates a professional HTML email template with technician details
3. Sends individual emails to each customer using Nodemailer
4. Logs the notification details in the database
5. Returns success/failure statistics to the technician

### Email Template Features
- Professional HTML formatting with company branding
- Technician name and timestamp for accountability
- Responsive design for mobile and desktop viewing
- Clear power delay information and estimated restoration times
- Contact information for additional support

## 🗄️ Database Architecture and Operations

### Database Schema Design
The system uses MySQL with a well-structured relational database design:

1. **customers table**: Stores customer registration data with unique email constraints
2. **valid_technicians table**: Pre-approved technician list with Tech ID and department information
3. **registered_technicians table**: Active technician accounts with hashed passwords
4. **technician_areas table**: Many-to-many relationship linking technicians to their assigned areas
5. **notifications table**: Audit trail of all sent notifications with recipient counts

### Data Storage and Retrieval Patterns
- **Connection Pooling**: Uses mysql2/promise for efficient database connections
- **Parameterized Queries**: Prevents SQL injection attacks
- **Transaction Support**: Ensures data consistency during complex operations
- **Foreign Key Constraints**: Maintains referential integrity between tables
- **Indexing**: Optimized queries for Tech ID and email lookups

### Database Operations Flow
1. **Customer Registration**: Validates unique email, stores in customers table
2. **Technician Registration**: Validates against valid_technicians list, hashes password, stores in registered_technicians
3. **Area Assignment**: Removes existing assignments, inserts new area assignments in technician_areas table
4. **Notification Sending**: Queries customers by area, sends emails, logs notification details
5. **Authentication**: Validates Tech ID and password against registered_technicians table

## 📡 Broadcasting and Notification System

### Real-time Notification Delivery
The system implements an efficient broadcasting mechanism that:
- Identifies all customers in the target geographic area
- Generates personalized email content for each recipient
- Sends emails concurrently using Nodemailer's promise-based API
- Tracks delivery statistics and success rates
- Provides immediate feedback to technicians on notification status

### Area-based Targeting
The system supports seven predefined areas (chickpete, balepete, akkipete, kumbarpete, chamrajpete, nagarthpete, cubbonpete) that technicians can be assigned to. When sending notifications, technicians can only target areas they are responsible for, ensuring proper authorization and accountability.

### Notification Tracking and Analytics
Every notification is logged with:
- Target area and message content
- Recipient count and delivery statistics
- Sending technician information
- Timestamp for audit purposes
- Success/failure status for each email

## 🔧 System Components and File Structure

### Backend Architecture
- **server.js**: Main application entry point with Express configuration
- **config/database.js**: MySQL connection pooling and table initialization
- **models/**: Database interaction layer with customer, technician, and notification models
- **controllers/**: Business logic for customer management, technician operations, and notifications
- **routes/**: API endpoint definitions and request routing
- **middleware/**: JWT authentication and request validation
- **services/**: Email service configuration and delivery logic
- **utils/**: Input validation and utility functions

### Frontend Architecture
- **public/index.html**: Landing page with navigation to different portals
- **public/customer.html**: Customer registration and area update interface
- **public/technician.html**: Technician login and dashboard with area assignment
- **public/technician-register.html**: New technician registration interface
- **public/css/style.css**: Responsive styling with modern UI components
- **public/js/**: JavaScript modules for frontend functionality and API communication

### Security Implementation
- **Input Validation**: Express-validator middleware for all API endpoints
- **SQL Injection Protection**: Parameterized queries throughout the application
- **XSS Prevention**: Input sanitization and output encoding
- **CSRF Protection**: Token-based request validation
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Security Headers**: Helmet.js for HTTP security headers

## 🚀 Installation and Deployment

### Prerequisites
- Node.js version 14 or higher
- MySQL version 8.0 or higher
- Gmail account with 2-Step Verification enabled
- Git for version control

### Step-by-Step Installation Commands

#### 1. Clone and Navigate to Project
```bash
# Navigate to your desired directory
cd /Users/abhishek_r/Desktop/Technician-messenger

# Navigate to the project directory
cd power-delay-notifier

# Verify you're in the correct directory
pwd
ls -la
```

#### 2. Install Dependencies
```bash
# Install all Node.js dependencies
npm install

# Verify installation
npm list --depth=0
```

#### 3. Database Setup
```bash
# Access MySQL command line
mysql -u root -p

# Create database (run these commands in MySQL)
CREATE DATABASE power_delay_notifier;
USE power_delay_notifier;
SHOW TABLES;

# Exit MySQL
EXIT;
```

#### 4. Environment Configuration
```bash
# Create .env file from template
cp env-template.txt .env

# Edit .env file with your configuration
nano .env
# or use any text editor to edit the .env file
```

**Required .env Configuration:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=power_delay_notifier
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

#### 5. Gmail App Password Setup
```bash
# Follow these steps in your browser:
# 1. Go to https://myaccount.google.com/security
# 2. Enable 2-Step Verification if not already enabled
# 3. Go to "App passwords" under "Signing in to Google"
# 4. Select "Mail" and your device
# 5. Copy the 16-character password
# 6. Update EMAIL_PASS in your .env file
```

#### 6. Verify Configuration
```bash
# Check if .env file exists and has correct format
cat .env

# Verify database connection
node -e "
const mysql = require('mysql2/promise');
const config = require('./config/database');
config.testConnection().then(() => {
  console.log('Database connection successful');
  process.exit(0);
}).catch(err => {
  console.error('Database connection failed:', err.message);
  process.exit(1);
});
"
```

### Running the Application

#### Development Mode (Recommended for Development)
```bash
# Start development server with auto-reload
npm run dev

# Alternative: Start with nodemon directly
npx nodemon server.js
```

#### Production Mode
```bash
# Start production server
npm start

# Alternative: Start directly with Node.js
node server.js
```

#### Interactive Setup (Alternative Method)
```bash
# Run interactive setup script
npm run setup

# This will guide you through the configuration process
```

### Verification Commands

#### 1. Check Server Status
```bash
# Test if server is running
curl http://localhost:3000/api/health

# Expected response: {"success":true,"environment":"development"}
```

#### 2. Test Database Connection
```bash
# Check database tables
mysql -u root -p -e "USE power_delay_notifier; SHOW TABLES;"

# Expected tables: customers, valid_technicians, registered_technicians, technician_areas, notifications
```

#### 3. Test Email Configuration
```bash
# Test email sending (if you have a test technician registered)
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"area":"chickpete","message":"Test notification"}'
```

### Troubleshooting Commands

#### Database Issues
```bash
# Check MySQL service status
sudo systemctl status mysql

# Restart MySQL if needed
sudo systemctl restart mysql

# Check MySQL connection
mysql -u root -p -e "SELECT VERSION();"
```

#### Node.js Issues
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache if needed
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Port Issues
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port 3000 if needed
kill -9 $(lsof -t -i:3000)
```

### Development Workflow Commands

#### Starting Development Session
```bash
# 1. Navigate to project
cd /Users/abhishek_r/Desktop/Technician-messenger/power-delay-notifier

# 2. Start development server
npm run dev

# 3. Open browser to application
open http://localhost:3000
```

#### Database Management Commands
```bash
# View all customers
mysql -u root -p -e "USE power_delay_notifier; SELECT * FROM customers;"

# View all technicians
mysql -u root -p -e "USE power_delay_notifier; SELECT * FROM registered_technicians;"

# View technician areas
mysql -u root -p -e "USE power_delay_notifier; SELECT * FROM technician_areas;"

# View notifications
mysql -u root -p -e "USE power_delay_notifier; SELECT * FROM notifications;"
```

#### Log Monitoring
```bash
# Monitor server logs in real-time
tail -f logs/app.log

# Check error logs
grep ERROR logs/app.log

# Monitor database queries (if enabled)
tail -f logs/db.log
```

### Production Deployment Commands

#### Environment Setup
```bash
# Set production environment
export NODE_ENV=production

# Install production dependencies
npm ci --only=production

# Start production server
npm start
```

#### Process Management (with PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name "power-delay-notifier"

# Monitor application
pm2 monit

# View logs
pm2 logs power-delay-notifier

# Restart application
pm2 restart power-delay-notifier
```

### Testing Commands

#### API Testing
```bash
# Test technician login
curl -X POST http://localhost:3000/api/technicians/login-by-techid \
  -H "Content-Type: application/json" \
  -d '{"techId":"TECH009","password":"RobertPass123"}'

# Test customer registration
curl -X POST http://localhost:3000/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","area":"chickpete"}'

# Test notification sending (requires authentication)
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"area":"chickpete","message":"Power maintenance scheduled"}'
```

#### Browser Testing
```bash
# Open application in default browser
open http://localhost:3000

# Open specific pages
open http://localhost:3000/technician.html
open http://localhost:3000/customer.html
open http://localhost:3000/technician-register.html
```

### Cleanup Commands

#### Reset Database
```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE power_delay_notifier; CREATE DATABASE power_delay_notifier;"

# Restart server to recreate tables
npm run dev
```

#### Clear Application Data
```bash
# Clear localStorage in browser
# Open browser console and run:
localStorage.clear();

# Or clear specific items:
localStorage.removeItem('techToken');
localStorage.removeItem('technician');
```

These commands provide a complete workflow for setting up, running, testing, and maintaining the Power Delay Notifier application in both development and production environments. 


