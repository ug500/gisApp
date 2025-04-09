const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pointRoutes = require('./routes/pointRoutes');
const lineStringRoutes = require('./routes/lineStringRoutes');
const polygonRoutes = require('./routes/polygonRoutes'); // Import polygon routes
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/points', pointRoutes);
app.use('/api/linestrings', lineStringRoutes);
app.use('/api/polygons', polygonRoutes); // Use polygon routes

const port = process.env.PORT || 9000;

mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});