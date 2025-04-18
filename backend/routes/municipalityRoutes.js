const express = require('express');
const router = express.Router();

let useMongo = true;
let Municipality;

try {
  Municipality = require('../models/Municipality');
} catch (err) {
  console.warn('⚠️ MongoDB model not found. Falling back to JSON file.');
  useMongo = false;
}

const jsonData = require('../municipalities.json');

router.get('/', async (req, res) => {
  try {
    if (useMongo && Municipality) {
      const municipalities = await Municipality.find({});
      return res.json({
        type: "FeatureCollection",
        features: municipalities
      });
    } else {
      return res.json({
        type: "FeatureCollection",
        features: jsonData
      });
    }
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
