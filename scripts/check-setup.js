#!/usr/bin/env node

/**
 * Check if all prerequisites are set up correctly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking setup status...\n');

let allGood = true;

// Check Node.js
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js: ${nodeVersion}`);
} catch (error) {
  console.log('❌ Node.js: Not found');
  allGood = false;
}

// Check .env file
if (fs.existsSync(path.join(__dirname, '..', '.env'))) {
  console.log('✅ .env file exists');
} else {
  console.log('❌ .env file not found');
  allGood = false;
}

// Check MySQL
try {
  execSync('mysql -u root -e "SELECT 1"', { stdio: 'ignore' });
  console.log('✅ MySQL: Running and accessible');
  
  // Check if database exists
  try {
    execSync('mysql -u root -e "USE exam_db; SELECT 1"', { stdio: 'ignore' });
    console.log('✅ MySQL Database: exam_db exists');
    
    // Check if listings table exists
    try {
      execSync('mysql -u root exam_db -e "SELECT COUNT(*) FROM listings"', { stdio: 'ignore' });
      console.log('✅ MySQL Table: listings table exists and has data');
    } catch (error) {
      console.log('⚠️  MySQL Table: listings table may not exist or is empty');
      console.log('   Run: mysql -u root exam_db < database/sql/create_listings_table.sql');
      console.log('   Then: node scripts/seed-listings.js');
    }
  } catch (error) {
    console.log('⚠️  MySQL Database: exam_db does not exist');
    console.log('   Run: mysql -u root < database/sql/mashvisor_dump_db.sql');
    allGood = false;
  }
} catch (error) {
  console.log('❌ MySQL: Not running or not accessible');
  console.log('   Start MySQL: brew services start mysql (macOS) or sudo systemctl start mysql (Linux)');
  allGood = false;
}

// Check MongoDB
try {
  const { MongoClient } = require('mongodb');
  const client = new MongoClient('mongodb://localhost:27017');
  client.connect()
    .then(() => {
      console.log('✅ MongoDB: Running and accessible');
      return client.db('real_estate_db').admin().listCollections().toArray();
    })
    .then((collections) => {
      const collectionNames = collections.map(c => c.name);
      if (collectionNames.length > 0) {
        console.log(`✅ MongoDB Collections: ${collectionNames.join(', ')} exist`);
      } else {
        console.log('⚠️  MongoDB: Database exists but no collections found');
        console.log('   Run: node scripts/seed-mongodb.js');
      }
      client.close();
    })
    .catch((error) => {
      console.log('❌ MongoDB: Connection failed');
      console.log('   Start MongoDB: brew services start mongodb-community (macOS)');
      console.log('   Or: sudo systemctl start mongod (Linux)');
      allGood = false;
    });
} catch (error) {
  console.log('❌ MongoDB: Not accessible or driver not installed');
  allGood = false;
}

// Check dependencies
if (fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
  console.log('✅ Node modules: Installed');
} else {
  console.log('❌ Node modules: Not installed');
  console.log('   Run: npm install');
  allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ All checks passed! You can start the server with: npm start');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above before starting the server.');
}
console.log('='.repeat(50));

