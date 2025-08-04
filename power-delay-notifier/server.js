const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Import database configuration
const { testConnection, initDatabase } = require('./config/database');

// Import routes
const customerRoutes = require('./routes/customerRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Power Delay Notifier API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Power Delay Notifier API',
    version: '1.0.0',
    endpoints: {
      customers: {
        'POST /api/customers/register': 'Register a new customer',
        'PUT /api/customers/area': 'Update customer area',
        'GET /api/customers/:email': 'Get customer by email',
        'GET /api/customers': 'Get all customers'
      },
      technicians: {
        'POST /api/technicians/register': 'Register a new technician',
        'POST /api/technicians/login': 'Login technician',
        'GET /api/technicians/profile': 'Get technician profile (protected)',
        'GET /api/technicians': 'Get all technicians (protected)'
      },
      notifications: {
        'POST /api/notifications/send': 'Send notification to area (protected)',
        'GET /api/notifications': 'Get all notifications (protected)',
        'GET /api/notifications/my-notifications': 'Get technician notifications (protected)',
        'GET /api/notifications/stats': 'Get notification stats (protected)',
        'GET /api/notifications/test-email': 'Test email service (protected)'
      }
    }
  });
});

// Catch-all route for SPA (if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database tables
    await initDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API Documentation: http://localhost:${PORT}/api`);
      console.log(`👥 Customer Portal: http://localhost:${PORT}/customer.html`);
      console.log(`🔧 Technician Portal: http://localhost:${PORT}/technician.html`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer(); 