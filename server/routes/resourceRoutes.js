const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource'); 

// Create a new resource
router.post('/', async (req, res) => {
  console.log('POST /api/resources route hit!');
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  console.log('GET /api/resources route hit!'); // ADD THIS
  try {
      const resources = await Resource.find({}); // Or Resource.find()
      console.log('Retrieved resources:', resources); // ADD THIS
      res.json(resources);
  } catch (error) {
      console.error('Error getting resources:', error); // ADD THIS
      res.status(500).json({ error: error.message });
  }
});

// Get resources within a proximity
router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat, maxDistance } = req.query;

    //  ---  VALIDATION  ---
    if (!lng || !lat || !maxDistance) {
      return res.status(400).json({ error: 'Missing lng, lat, or maxDistance parameters' });
    }

    const parsedLng = parseFloat(lng);
    const parsedLat = parseFloat(lat);
    const parsedMaxDistance = parseInt(maxDistance, 10); //   radix 10

    if (isNaN(parsedLng) || isNaN(parsedLat) || isNaN(parsedMaxDistance)) {
      return res.status(400).json({ error: 'Invalid lng, lat, or maxDistance values' });
    }
    //  ---  END VALIDATION  ---

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