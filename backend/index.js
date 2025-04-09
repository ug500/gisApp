const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/invasion', (req, res) => {
  res.json({ message: "Updated successfully" });
});

app.get('/api/route', async (req, res) => {
  const { fromLat, fromLng, toLat, toLng } = req.query;
  try {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=polyline`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

let invasionData = {
  type: "FeatureCollection",
  features: []
};

app.post('/api/update-invasion', (req, res) => {
  invasionData = req.body;
  res.json({ message: "Updated successfully" });
});

app.get('/api/invasion', (req, res) => {
  res.json(invasionData);
});

