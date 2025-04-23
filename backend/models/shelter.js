const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  type: { type: String, default: 'Feature' },
  geometry: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  properties: {
    t_sug: String
  }
});

shelterSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Shelter', shelterSchema, 'tlv_shelters'); // ✅ This is correct
