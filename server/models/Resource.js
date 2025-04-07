const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere' // Geospatial index
    }
  },
  type: String,
  description: String
});

// Ensure the index is created
resourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Resource', resourceSchema);