const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Shelter = require('../models/shelter'); // NOT mongoose.model()





router.get('/shelters', async (req, res) => {
  try {
    const raw = await mongoose.connection.db.collection('tlv_shelters').find({}).toArray();
    console.log('RAW COUNT:', raw.length);
    res.json(raw);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch raw shelters' });
  }
});






router.get('/shelters-nearby', async (req, res) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'lat, lng and radius are required' });
  }

  try {
    const results = await Shelter.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'distance',
          maxDistance: parseFloat(radius),
          spherical: true
        }
      }
    ]);

    res.json(results);
  } catch (err) {
    console.error('Geo query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🔍 Direct MongoDB test without Mongoose
router.get('/shelters-test-raw', async (req, res) => {
    try {
      const shelters = await mongoose.connection.db.collection('tlv_shelters').find({}).toArray();
      console.log("RAW DB RESULT COUNT:", shelters.length);
      res.json(shelters);
    } catch (err) {
      console.error("Raw fetch failed:", err);
      res.status(500).json({ error: 'Raw MongoDB fetch failed' });
    }
  });
  
module.exports = router;