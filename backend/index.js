// index.js
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, '../Frontend/public');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// Routes
const municipalityRoutes = require('./routes/municipalityRoutes');
const shelterRoutes = require('./routes/shelters');
const invasionHistoryRoutes = require('./routes/invasionHistory');

app.use('/api/municipalities', municipalityRoutes);
app.use('/api', shelterRoutes);
app.use('/api/history', invasionHistoryRoutes);

// OSRM proxy route
app.get('/api/route', async (req, res) => {
  const { fromLat, fromLng, toLat, toLng } = req.query;
  try {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=polyline`
    );
    res.json(response.data);
  } catch (error) {
    console.error("OSRM Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log('✅ Connected to MongoDB:', mongoose.connection.name);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});
