const express = require('express');
const router = express.Router();
const municipalities = require('../municipalities.json'); // שים לב ל־.json

router.get('/', async (req, res) => {
  try {
    res.json({
      type: "FeatureCollection",
      features: municipalities
    });
  } catch (error) {
    console.error('Error loading municipalities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;