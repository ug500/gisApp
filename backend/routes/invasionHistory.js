const express = require('express');
const router = express.Router();
const HistoricalInvasion = require('../models/HistoricalInvasion');

// 🔸 POST - Save full invasion document
router.post('/', async (req, res) => {
  try {
    const { landing, invadedPolygons, alienPaths } = req.body;

    if (!landing || !landing.polygonId || !landing.coordinates) {
      return res.status(400).json({ error: 'Landing data is missing or invalid' });
    }

    const newInvasion = new HistoricalInvasion({
      landing,
      invadedPolygons,
      alienPaths
    });

    await newInvasion.save();
    res.status(201).json({ message: 'Invasion saved', id: newInvasion._id });
  } catch (err) {
    console.error('Error saving invasion:', err);
    res.status(500).json({ error: 'Server error saving invasion' });
  }
});

// 🔹 GET - Return all historical invasions
router.get('/', async (req, res) => {
  try {
    const invasions = await HistoricalInvasion.find().sort({ 'landing.timestamp': -1 });
    res.json(Array.isArray(invasions) ? invasions : []);

  } catch (err) {
    console.error('Error fetching invasions:', err);
    res.status(500).json({ error: 'Server error fetching invasions' });
  }
});


// 🔥 DELETE all historical invasions
router.delete('/', async (req, res) => {
    try {
      await HistoricalInvasion.deleteMany({});
      res.status(200).json({ message: 'All invasions deleted' });
    } catch (err) {
      console.error('Error deleting invasions:', err);
      res.status(500).json({ error: 'Failed to delete invasions' });
    }
  });
  
module.exports = router;
