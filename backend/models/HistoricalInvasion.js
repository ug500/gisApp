const mongoose = require('mongoose');

const historicalInvasionSchema = new mongoose.Schema({
  landing: {
    polygonId: { type: String, required: true },
    name: { type: String, required: true },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  invadedPolygons: [
    {
      polygonId: { type: String, required: true },
      name: { type: String, required: true },
      count: { type: Number, default: 0 },
      invadedAt: { type: Date, required: true }
    }
  ],
  alienPaths: [
    {
      alienCode: { type: String, required: true },
      path: [
        {
          coordinates: {
            type: [Number], // [lng, lat]
            required: true
          },
          enteredAt: {
            type: Date,
            required: true
          }
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('HistoricalInvasion', historicalInvasionSchema);
