const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'sunnahkkr_vpn_secret_key_1357924680', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email and password' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Set role to 'admin' if email contains specific admin domains, or let user decide if not strict
    // By default first user or specified role
    const assignedRole = role === 'admin' ? 'admin' : 'user';

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: assignedRole
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
router.get('/profile', protect, async (req, res) => {
  res.json({ user: req.user });
});

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving users' });
  }
});

module.exports = router;
