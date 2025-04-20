const express = require('express');
const router = express.Router();
const Municipality = require('../models/municipalities'); // Import the Municipality model

// Route to get all municipalities
router.get('/', async (req, res) => {
  try {
    const municipalities = await Municipality.find({}); // Fetch all documents from the collection
    res.json(municipalities); // Send the municipalities as JSON
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;