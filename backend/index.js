const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Import bcrypt

dotenv.config(); // Load .env variables

// Import Models and Routes
const User = require('./models/User'); // Import User model
const municipalityRoutes = require('./routes/municipalityRoutes');
const invasionHistoryRoutes = require('./routes/invasionHistory');
const authRoutes = require('./routes/authRoutes'); // Import Auth routes

const app = express();
const PORT = process.env.PORT || 5000;
// Corrected path assuming 'backend' and 'frontend' are siblings
const FRONTEND_BUILD_DIR = path.join(__dirname, '../frontend/build'); // Path to React build output
const FRONTEND_PUBLIC_DIR = path.join(__dirname, '../frontend/public'); // Path to public assets (if needed separately)

// --- Middleware ---
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies

// --- API Routes ---
app.use('/api/auth', authRoutes); // Mount authentication routes
app.use('/api/history', invasionHistoryRoutes);
app.use('/api/municipalities', municipalityRoutes);

// OSRM Proxy Route (keep as is)
app.get('/api/route', async (req, res) => {
  // ... (OSRM logic remains the same)
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

// --- Static File Serving (Serve React App) ---
// Serve static files from the React build directory
app.use(express.static(FRONTEND_BUILD_DIR));

// --- Catch-all for SPA ---
// Handles any requests that don't match the API routes or static files
// by serving the main index.html file. Essential for React Router.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(FRONTEND_BUILD_DIR, 'index.html'));
});


// --- Database Connection and Server Start ---
mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'Invasion' // Specify DB Name here if not in URI
})
  .then(async () => { // Make the callback async
    console.log('✅ Connected to MongoDB (Invasion)');

    // --- Seed Admin User ---
    await seedAdminUser(); // Call the seeding function

    // --- Start Server ---
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });


// --- Admin User Seeding Function ---
async function seedAdminUser() {
  try {
    const adminUsername = 'admin';
    const adminExists = await User.findOne({ username: adminUsername });

    if (!adminExists) {
      console.log(`🔧 Admin user '${adminUsername}' not found. Creating...`);
      const adminPassword = 'admin123'; // Use a more secure password in reality!

      // No need to hash here, the pre-save hook in User.js handles it
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com', // Use a valid email format
        username: adminUsername,
        password: adminPassword, // Pass plain password
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
