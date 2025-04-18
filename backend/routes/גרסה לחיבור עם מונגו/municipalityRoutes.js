const express = require('express');
const router = express.Router();
const Municipality = require('../models/municipalities'); // ודא שהקובץ הזה קיים

router.get('/', async (req, res) => {
  try {
    const municipalities = await Municipality.find({});
    res.json({
      type: "FeatureCollection",
      features: municipalities
    });
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
