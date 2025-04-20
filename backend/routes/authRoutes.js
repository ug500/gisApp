const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // Make sure JWT_SECRET is in your .env file!

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1); // Exit if secret is not set
}

// --- Registration ---
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !username || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Check if user already exists (by email or username)
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      const field = user.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${field} already exists.` });
    }

    // Create new user instance (password will be hashed by pre-save hook)
    user = new User({
      firstName,
      lastName,
      email,
      username,
      password, // Pass plain password here, hashing happens before save
      isAdmin: false // Default new users are not admins
    });

    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: { // Send back some user info (excluding password)
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin
          }
        });
      }
    );

  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// --- Login ---
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password.' });
  }

  try {
    // Find user by username (case-insensitive)
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { // Send back some user info (excluding password)
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin
          }
        });
      }
    );

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
