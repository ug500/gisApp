const mongoose = require('mongoose');

// Define the Mongoose schema for municipalities
const municipalitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Feature'],
    required: true
  },
  properties: {
    MUN_HEB: {
      type: String,
      required: true
    },
    MUN_ENG: {
      type: String,
      required: true
    }
  },
  geometry: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // Array of coordinate rings
      required: true
    }
  }
}, { collection: 'municipalities' }); // Optionally specify the collection name

// Create the Mongoose model for municipalities
const Municipality = mongoose.model('Municipality', municipalitySchema);

module.exports = Municipality;
