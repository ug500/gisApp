const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point', 'LineString'],
      required: true
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  type: String,
  description: String
});

// Remove all indexes
resourceSchema.set('autoIndex', false);

module.exports = mongoose.model('Resource', resourceSchema);