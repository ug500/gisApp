// index.js
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcrypt

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, '../Frontend/public');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// Routes
const User = require('./models/User'); // Import User model
const municipalityRoutes = require('./routes/municipalityRoutes');
const shelterRoutes = require('./routes/shelters');
const invasionHistoryRoutes = require('./routes/invasionHistory');
const authRoutes = require('./routes/authRoutes'); // Adjust path if needed

// --- API Routes ---
app.use('/api/auth', authRoutes); // All routes in authRoutes.js will be prefixed with /api/auth
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
	
	// --- Seed Admin User ---
	// await
     seedAdminUser(); // Call the seeding function
	
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

// --- Admin User Seeding Function ---
async function seedAdminUser() {
  try {
    // Use environment variables for username and password
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Basic check to ensure variables are loaded
    if (!adminUsername || !adminPassword) {
      console.warn('⚠️ Admin username or password not found in .env file. Skipping admin seed.');
      return; // Exit the function if credentials aren't set
    }

    const adminExists = await User.findOne({ username: adminUsername });

    if (!adminExists) {
      console.log(`🔧 Admin user '${adminUsername}' not found. Creating...`);

      // No need to hash here, the pre-save hook in User.js handles it
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com', // Use a valid email format
        username: adminUsername, // Use variable
        password: adminPassword, // Use variable (plain password)
        isAdmin: true
      });

      await adminUser.save();
      console.log(`✅ Admin user '${adminUsername}' created successfully.`);
    } else {
      console.log(`👍 Admin user '${adminUsername}' already exists.`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    // Don't necessarily exit, the app might still function
  }
}

