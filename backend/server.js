require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const { pool } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/emails');
const gmailRoutes = require('./routes/gmail');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.API_PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);
app.use('/emails', emailRoutes);
app.use('/gmail', gmailRoutes);
app.use('/stats', statsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Database connection test
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    logger.error('Database connection failed:', err);
  } else {
    logger.info('Database connected successfully');
  }
});

// Start server
app.listen(PORT, process.env.API_HOST || '0.0.0.0', () => {
  logger.info(`🚀 Server running on http://${process.env.API_HOST || 'localhost'}:${PORT}`);
});

module.exports = app;
