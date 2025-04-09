const mongoose = require('mongoose');

const pointResourceSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    }
  },
  type: String,
  description: String
});

module.exports = mongoose.model('PointResource', pointResourceSchema);