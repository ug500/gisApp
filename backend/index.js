const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const cors = require('cors');
const axios = require('axios');
const path = require('path'); // Import the 'path' module
const app = express();
const municipalityRoutes = require('./routes/municipalityRoutes');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, '../Frontend/public'); // Path to your client-side public folder

app.use(cors());
app.use(express.json());

// Serve static files from the client-side public folder
app.use(express.static(PUBLIC_DIR));


const invasionHistoryRoutes = require('./routes/invasionHistory');
app.use('/api/history', invasionHistoryRoutes);

// Use separate route files
app.use('/api/municipalities', municipalityRoutes);

// OSRM route
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

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Handle all other requests by serving the index.html from the client-side public folder
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});