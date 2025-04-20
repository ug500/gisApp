const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Municipality = require('./models/municipalities'); // Import the Municipality model

dotenv.config();

async function seedDatabase() {
  try {
    // Connect to MongoDB using the URI from your .env file, and specify the database name
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'Invasion' // Specify the database name here
    });

    const db = mongoose.connection;
    console.log('Connected to MongoDB (Invasion)');

    // Read and parse the GeoJSON file
    const geojsonData = require('./municipalities.json');
    const features = geojsonData.features;

    // Create Municipality instances from the features
    const municipalityDocs = features.map(feature => new Municipality(feature));

    // Insert the Municipality documents
    await Municipality.insertMany(municipalityDocs);
    console.log(`Inserted ${municipalityDocs.length} municipalities.`);

    // Create geospatial index
    await db.collection('municipalities').createIndex({ geometry: '2dsphere' });
    console.log('Geospatial index created on geometry field.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
