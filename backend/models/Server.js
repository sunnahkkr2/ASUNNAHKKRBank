const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true
  },
  flag: {
    type: String,
    required: true, // Emoji or short flag code
    default: '🌐'
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    type: String,
    required: true,
    trim: true
  },
  port: {
    type: Number,
    required: true
  },
  protocols: {
    type: [String], // ['WireGuard', 'OpenVPN']
    default: ['WireGuard', 'OpenVPN']
  },
  load: {
    type: Number, // Percentage 0 - 100
    default: 10
  },
  ping: {
    type: Number, // ms latency
    default: 50
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'offline'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Server', ServerSchema);
