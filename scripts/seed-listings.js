const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function seedListings() {
  try {
    // Read listings JSON file
    const listingsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../database/seeds/listings.json'), 'utf8')
    );

    console.log('Seeding listings data...');

    for (const listing of listingsData) {
      // Add bedrooms field (defaulting to 2 if not provided)
      const bedrooms = listing.bedrooms || 2;
      
      const sql = `INSERT INTO listings (id, title, city, price, bedrooms, agentId) 
                   VALUES (?, ?, LOWER(?), ?, ?, ?)
                   ON DUPLICATE KEY UPDATE 
                   title = VALUES(title), 
                   city = VALUES(city), 
                   price = VALUES(price), 
                   bedrooms = VALUES(bedrooms), 
                   agentId = VALUES(agentId)`;
      
      await db.query(sql, [
        listing._id,
        listing.title,
        listing.city,
        listing.price,
        bedrooms,
        listing.agentId
      ]);
    }

    console.log(`Successfully seeded ${listingsData.length} listings`);
  } catch (error) {
    console.error('Error seeding listings:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedListings()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedListings;

