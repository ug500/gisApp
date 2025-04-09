const express = require('express');
const router = express.Router();
const PointResource = require('../models/PointResource');

// Create a new Point resource
router.post('/', async (req, res) => {
  console.log('POST /api/points route hit!');
  console.log('Request Body:', req.body);
  try {
    const { type, coordinates, name, description } = req.body;
    if (type !== 'Point' || !Array.isArray(coordinates) || coordinates.length !== 2 || !coordinates.every(num => typeof num === 'number')) {
      return res.status(400).json({ error: 'Invalid GeoJSON Point format. Expected { type: "Point", coordinates: [longitude, latitude] }' });
    }
    const newResource = new PointResource({ name, location: { type, coordinates }, type: req.body.type, description });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating Point resource:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  console.log('GET /api/points route hit!');
  try {
    const resources = await PointResource.find({});
    console.log('Retrieved Point resources:', resources);
    res.json(resources);
  } catch (error) {
    console.error('Error getting Point resources:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get nearby Point resources
router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat, maxDistance } = req.query;

    if (!lng || !lat || !maxDistance) {
      return res.status(400).json({ error: 'Missing lng, lat, or maxDistance parameters' });
    }

    const parsedLng = parseFloat(lng);
    const parsedLat = parseFloat(lat);
    const parsedMaxDistance = parseInt(maxDistance, 10);

    if (isNaN(parsedLng) || isNaN(parsedLat) || isNaN(parsedMaxDistance)) {
      return res.status(400).json({ error: 'Invalid lng, lat, or maxDistance values' });
    }

    const resources = await PointResource.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parsedLng, parsedLat]
          },
          $maxDistance: parsedMaxDistance
        }
      }
    });

    res.json(resources);
  } catch (error) {
    console.error('Error getting nearby Point resources:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;