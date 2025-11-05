const fs = require('fs');
const path = require('path');
const { getDb } = require('../config/mongodb');

async function seedMongoDB() {
  try {
    const db = await getDb();

    // Read JSON files
    const listingsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../database/seeds/listings.json'), 'utf8')
    );
    const agentsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../database/seeds/agents.json'), 'utf8')
    );
    const viewsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../database/seeds/views.json'), 'utf8')
    );

    console.log('Seeding MongoDB data...');

    // Insert listings
    const listingsCollection = db.collection('listings');
    await listingsCollection.deleteMany({});
    await listingsCollection.insertMany(listingsData);
    console.log(`Inserted ${listingsData.length} listings`);

    // Insert agents
    const agentsCollection = db.collection('agents');
    await agentsCollection.deleteMany({});
    await agentsCollection.insertMany(agentsData);
    console.log(`Inserted ${agentsData.length} agents`);

    // Insert views
    const viewsCollection = db.collection('views');
    await viewsCollection.deleteMany({});
    await viewsCollection.insertMany(viewsData);
    console.log(`Inserted ${viewsData.length} view records`);

    console.log('MongoDB seeding completed successfully');
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedMongoDB()
    .then(() => {
      console.log('MongoDB seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('MongoDB seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedMongoDB;

