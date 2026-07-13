const express = require('express');
const router = express.Router();
const Server = require('../models/Server');
const { protect, adminOnly } = require('../middleware/auth');

// Seed default servers if database is empty
const defaultServers = [
  { country: 'USA', flag: '🇺🇸', city: 'New York', host: 'us-ny.sunnahkkrvpn.com', port: 51820, protocols: ['WireGuard', 'OpenVPN'], load: 15, ping: 35, status: 'active' },
  { country: 'UK', flag: '🇬🇧', city: 'London', host: 'uk-lon.sunnahkkrvpn.com', port: 51820, protocols: ['WireGuard', 'OpenVPN'], load: 24, ping: 42, status: 'active' },
  { country: 'Germany', flag: '🇩🇪', city: 'Frankfurt', host: 'de-fra.sunnahkkrvpn.com', port: 51820, protocols: ['WireGuard', 'OpenVPN'], load: 38, ping: 25, status: 'active' },
  { country: 'Canada', flag: '🇨🇦', city: 'Toronto', host: 'ca-tor.sunnahkkrvpn.com', port: 51820, protocols: ['WireGuard', 'OpenVPN'], load: 12, ping: 48, status: 'active' },
  { country: 'France', flag: '🇫🇷', city: 'Paris', host: 'fr-par.sunnahkkrvpn.com', port: 51820, protocols: ['WireGuard', 'OpenVPN'], load: 19, ping: 30, status: 'active' },
  { country: 'Netherlands', flag: '🇳🇱', city: 'Amsterdam', host: 'nl-ams.sunnahkkrvpn.com', port: 51820, protocols: ['WireGuard', 'OpenVPN'], load: 45, ping: 28, status: 'active' },
  { country: 'Singapore', flag: '🇸🇬', city: 'Singapore', host: 'sg-sin.sunnahkkrvpn.com', port: 51820, protocols: ['WireGuard', 'OpenVPN'], load: 55, ping: 85, status: 'active' },
  { country: 'Japan', flag: '🇯🇵', city: 'Tokyo', host: 'jp-tok.sunnahkkrvpn.com', port: 51820, protocols: ['WireGuard', 'OpenVPN'], load: 33, ping: 110, status: 'active' },
  { country: 'Australia', flag: '🇦🇺', city: 'Sydney', host: 'au-syd.sunnahkkrvpn.com', port: 51820, protocols: ['WireGuard', 'OpenVPN'], load: 8, ping: 160, status: 'active' }
];

// Seed Helper
router.post('/seed', async (req, res) => {
  try {
    await Server.deleteMany({});
    const created = await Server.insertMany(defaultServers);
    res.json({ message: 'Default servers seeded successfully', count: created.length });
  } catch (err) {
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

// @route   GET /api/servers
// @desc    Get all active servers
router.get('/', async (req, res) => {
  try {
    let servers = await Server.find({});
    // If empty database, automatically return or seed defaultServers
    if (servers.length === 0) {
      servers = defaultServers;
    }
    res.json(servers);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving server list' });
  }
});

// @route   GET /api/servers/smart-connect
// @desc    Fast automatic server selection (lowest ping + load balance)
router.get('/smart-connect', async (req, res) => {
  try {
    let servers = await Server.find({ status: 'active' });
    if (servers.length === 0) {
      servers = defaultServers;
    }

    // Algorithm: Score based on ping + load. Lower score is better.
    // Score = ping * 0.7 + load * 1.5
    const scoredServers = servers.map(srv => {
      const score = (srv.ping || 50) * 0.7 + (srv.load || 10) * 1.5;
      return { server: srv, score };
    });

    scoredServers.sort((a, b) => a.score - b.score);
    const bestServer = scoredServers[0] ? scoredServers[0].server : servers[0];

    res.json(bestServer);
  } catch (error) {
    res.status(500).json({ message: 'Server error selecting smart server' });
  }
});

// @route   POST /api/servers
// @desc    Add new server (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { country, flag, city, host, port, protocols, load, ping, status } = req.body;

  if (!country || !city || !host || !port) {
    return res.status(400).json({ message: 'Please provide country, city, host and port' });
  }

  try {
    const server = await Server.create({
      country,
      flag: flag || '🌐',
      city,
      host,
      port,
      protocols: protocols || ['WireGuard', 'OpenVPN'],
      load: load || 10,
      ping: ping || 50,
      status: status || 'active'
    });

    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding server', error: error.message });
  }
});

// @route   PUT /api/servers/:id
// @desc    Update server details (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
    res.json(server);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating server' });
  }
});

// @route   DELETE /api/servers/:id
// @desc    Delete server (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const server = await Server.findByIdAndDelete(req.params.id);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
    res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting server' });
  }
});

module.exports = router;
