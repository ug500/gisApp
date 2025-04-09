const mongoose = require('mongoose');

const lineStringResourceSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['LineString'], // Accepts LineString only
      required: true
    },
    coordinates: {
      type: [[Number]], // Array of [longitude, latitude] pairs
      required: true
    }
  },
  type: String,
  description: String
});

// ✅ Define a 2dsphere index on the entire 'location' object
lineStringResourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('LineStringResource', lineStringResourceSchema);
