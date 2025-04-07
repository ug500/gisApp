

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const resourceRoutes = require('./routes/resourceRoutes');

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


app.get('/test', (req, res) => {
  res.send('This is a test!');
});


mongoose.connect(process.env.MONGODB_URI, {
 
  
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/resources', resourceRoutes);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});