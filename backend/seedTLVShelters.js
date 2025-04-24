// seedTLVShelters.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Shelter = require('./models/shelter');

dotenv.config();

async function seedShelters() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'Invasion'
    });

    console.log('Connected to MongoDB (Invasion)');

    // Load and parse shelters GeoJSON
    const filePath = path.join(__dirname, 'Tel-Aviv Shelters.json');
    const geojsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const features = geojsonData.features;

    // Insert shelters into the database
    const shelterDocs = features.map(feature => new Shelter(feature));
    await Shelter.insertMany(shelterDocs);
    console.log(`Inserted ${shelterDocs.length} shelters.`);
  } catch (err) {
    console.error('Error seeding TLV_shelters:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedShelters();