const mongoose = require('mongoose');

const polygonResourceSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Polygon'], // Accepts Polygon only
      required: true
    },
    coordinates: {
      type: [[[Number]]], // Array of rings, each ring is an array of [longitude, latitude] pairs
      required: true
    }
  },
  type: String,
  description: String,
  // Add any other properties specific to your polygon resources
});

// ✅ Define a 2dsphere index on the entire 'location' object
polygonResourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('PolygonResource', polygonResourceSchema);