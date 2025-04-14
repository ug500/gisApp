const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const resourceRoutes = require('./routes/resourceRoutes');

dotenv.config();

const app = express(); // ← שורה חשובה שחסרה אצלך

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/resources', resourceRoutes);

// ✅ כאן מוסיפים את מסלול הפלישה

app.get('/api/invasion', async (req, res) => {
  try {
    const response = await axios.get('https://invasion-api.onrender.com/api/invasion');
    res.json(response.data);
  } catch (err) {
    console.error('Failed to fetch from Render invasion API:', err.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
