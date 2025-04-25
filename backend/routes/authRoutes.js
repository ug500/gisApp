


const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator'); // Import validation functions
const User = require('../models/User'); // Adjust path if needed
const authenticateToken = require('../middleware/authenticateToken'); // Assuming you have this middleware

const router = express.Router();

// --- Validation Rules for Registration ---
const registerValidationRules = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 10 }).withMessage('First name must be between 2 and 10 characters.')
    .isAlphanumeric().withMessage('First name must contain only letters and numbers.'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 15 }).withMessage('Last name must be between 2 and 15 characters.')
    .isAlphanumeric().withMessage('Last name must contain only letters and numbers.'),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(), // Sanitizes the email
  body('username')
    .trim()
    .isLength({ min: 2, max: 10 }).withMessage('Username must be between 2 and 10 characters.')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers.'),
  body('password')
    // Note: Don't trim passwords, whitespace might be intentional
    .isLength({ min: 6, max: 15 }).withMessage('Password must be between 6 and 15 characters.')
    // Custom validator for allowed characters (letters, numbers, !@#$%^&*)
    .matches(/^[a-zA-Z0-9!@#$%^&*]+$/).withMessage('Password can only contain letters, numbers, and !@#$%^&*.')
];

// --- Registration Route ---
// Apply the validation rules as middleware before the main route handler
router.post('/register', registerValidationRules, async (req, res) => {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are errors, return 400 Bad Request with the errors
    // You might want to format the errors slightly differently for the frontend
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({ message: errorMessages.join(' ') }); // Or return the full errors array: { errors: errors.array() }
  }

  // 2. If validation passes, proceed with registration logic
  const { firstName, lastName, email, username, password } = req.body;

  try {
    // Check if user already exists (by email or username)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${field} already exists.` });
    }

    // Create new user instance (password hashing should be handled by the pre-save hook in User.js)
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password, // Pass the plain password, the model hook will hash it
      isAdmin: false // Default to non-admin
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id, username: savedUser.username, isAdmin: savedUser.isAdmin },
      process.env.JWT_SECRET, // Make sure JWT_SECRET is in your .env
      { expiresIn: '1h' } // Token expiration time
    );

    // Respond with user info (excluding password) and token
    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        isAdmin: savedUser.isAdmin
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    // Generic error for unexpected issues
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// --- Login Route (Example - No validation added here, but you could) ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // User not found
        }

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Password incorrect
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with user info (excluding password) and token
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});


// --- Example Protected Route (Get User Profile) ---
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // req.user is added by the authenticateToken middleware
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});


module.exports = router;