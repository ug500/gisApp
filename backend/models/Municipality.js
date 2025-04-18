const mongoose = require('mongoose');

const MunicipalitySchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Feature'
  },
  properties: {
    type: Object,
    required: true
  },
  geometry: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('Municipality', MunicipalitySchema);


