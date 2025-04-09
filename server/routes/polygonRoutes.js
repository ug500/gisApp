const express = require('express');
const router = express.Router();
const PolygonResource = require('../models/polygonResource');

// Create a new Polygon resource
router.post('/', async (req, res) => {
  console.log('POST /api/polygons route hit!');
  console.log('Request Body:', req.body);
  try {
    const { type, coordinates, name, description } = req.body;

    if (type !== 'Polygon' || !Array.isArray(coordinates) || coordinates.length < 1 || !coordinates.every(ring => Array.isArray(ring) && ring.length >= 3 && ring.every(coord => Array.isArray(coord) && coord.length === 2 && coord.every(num => typeof num === 'number')))) {
      return res.status(400).json({ error: 'Invalid GeoJSON Polygon format. Expected { type: "Polygon", coordinates: [[[lon1, lat1], [lon2, lat2], ...], ...] }' });
    }

    const newResource = new PolygonResource({
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
    console.error('Error creating polygon resource:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all Polygon resources
router.get('/', async (req, res) => {
  console.log('GET /api/polygons route hit!');
  try {
    const resources = await PolygonResource.find({});
    console.log('Retrieved polygon resources:', resources);
    res.json(resources);
  } catch (error) {
    console.error('Error getting polygon resources:', error);
    res.status(500).json({ error: error.message });
  }
});

// You can add more routes here for querying polygons (e.g., within a bounding box, intersections, etc.)

module.exports = router;