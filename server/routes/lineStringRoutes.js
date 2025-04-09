const express = require('express');
const router = express.Router();
const LineStringResource = require('../models/LineStringResource');

// Create a new LineString resource
router.post('/', async (req, res) => {
  console.log('POST /api/linestrings route hit!');
  console.log('Request Body:', req.body);
  try {
    const { type, coordinates, name, description } = req.body;
    if (type !== 'LineString' || !Array.isArray(coordinates) || coordinates.length < 2 || !coordinates.every(coord => Array.isArray(coord) && coord.length === 2 && coord.every(num => typeof num === 'number'))) {
      return res.status(400).json({ error: 'Invalid GeoJSON LineString format. Expected { type: "LineString", coordinates: [[lon1, lat1], [lon2, lat2], ...] }' });
    }
    const newResource = new LineStringResource({ name, location: { type, coordinates }, type: req.body.type, description });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating LineString resource:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  console.log('GET /api/linestrings route hit!');
  try {
    const resources = await LineStringResource.find({});
    console.log('Retrieved LineString resources:', resources);
    res.json(resources);
  } catch (error) {
    console.error('Error getting LineString resources:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add any LineString-specific routes here if needed

module.exports = router;