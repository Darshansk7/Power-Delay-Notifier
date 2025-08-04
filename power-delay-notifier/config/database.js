const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'power_delay_notifier',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create customers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        area VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create valid_technicians table (pre-approved by department)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS valid_technicians (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tech_id VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        department VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create registered_technicians table (technicians who have registered)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS registered_technicians (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tech_id VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create technician_areas table for area assignments
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS technician_areas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        technician_id INT NOT NULL,
        area VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (technician_id) REFERENCES registered_technicians(id) ON DELETE CASCADE,
        UNIQUE KEY unique_tech_area (technician_id, area)
      )
    `);

    // Create notifications table (optional - for logging)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        area VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        recipients_count INT DEFAULT 0,
        sent_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sent_by) REFERENCES technicians(id)
      )
    `);

    console.log('✅ Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
}; 