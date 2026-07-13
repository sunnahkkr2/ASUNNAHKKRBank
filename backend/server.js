const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const serverRoutes = require('./routes/servers');

app.use('/api/auth', authRoutes);
app.use('/api/servers', serverRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    app: 'Sunnahkkr VPN API'
  });
});

// Mock Endpoints for Statistics
app.get('/api/stats/summary', (req, res) => {
  res.json({
    totalUsers: 1420,
    activeConnections: 382,
    totalBandwidthGB: 12450,
    avgPing: '34ms',
    uptime: '99.98%'
  });
});

// Connect to MongoDB & Start Server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sunnahkkrvpn';

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB Database');
      app.listen(PORT, () => {
        console.log(`Sunnahkkr VPN Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.warn('MongoDB connection failed. Starting API server with fallback mock storage.', err.message);
      // Fallback start so the server is resilient and testable without a local Mongo service
      app.listen(PORT, () => {
        console.log(`Sunnahkkr VPN Server (resilient backup mode) is running on port ${PORT}`);
      });
    });
}

module.exports = app;
