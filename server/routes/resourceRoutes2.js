const express = require('express');
const router = express.Router();
const Resource = require('../models/PointResource');

// Create a new resource (GeoJSON Point or LineString)
router.post('/', async (req, res) => {
  console.log('POST /api/resources route hit!');
  console.log('Request Body:', req.body);
  try {
    const { type, coordinates, name, description } = req.body;

    if (type === 'Point') {
      if (!Array.isArray(coordinates) || coordinates.length !== 2 || !coordinates.every(num => typeof num === 'number')) {
        return res.status(400).json({ error: 'Invalid GeoJSON Point format. Expected { type: "Point", coordinates: [longitude, latitude] }' });
      }
    } else if (type === 'LineString') {
      if (!Array.isArray(coordinates) || coordinates.length < 2 || !coordinates.every(coord => Array.isArray(coord) && coord.length === 2 && coord.every(num => typeof num === 'number'))) {
        return res.status(400).json({ error: 'Invalid GeoJSON LineString format. Expected { type: "LineString", coordinates: [[lon1, lat1], [lon2, lat2], ...] }' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid GeoJSON type. Expected "Point" or "LineString"' });
    }

    const newResource = new Resource({
      name: name,
      location: {
        type: type,
        coordinates: coordinates
      },
      description: description
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  console.log('GET /api/resources route hit!');
  try {
    const resources = await Resource.find({});
    console.log('Retrieved resources:', resources);
    res.json(resources);
  } catch (error) {
    console.error('Error getting resources:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get resources within a proximity
router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat, maxDistance } = req.query;

    // ---  VALIDATION  ---
    if (!lng || !lat || !maxDistance) {
      return res.status(400).json({ error: 'Missing lng, lat, or maxDistance parameters' });
    }

    const parsedLng = parseFloat(lng);
    const parsedLat = parseFloat(lat);
    const parsedMaxDistance = parseInt(maxDistance, 10); //  radix 10

    if (isNaN(parsedLng) || isNaN(parsedLat) || isNaN(parsedMaxDistance)) {
      return res.status(400).json({ error: 'Invalid lng, lat, or maxDistance values' });
    }
    // ---  END VALIDATION  ---

    const resources = await Resource.find({
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
    console.error('Error getting nearby resources:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;