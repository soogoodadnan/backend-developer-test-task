#!/usr/bin/env node

/**
 * Setup script to initialize the database and seed data
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting setup process...\n');

// Check if .env file exists
if (!fs.existsSync(path.join(__dirname, '..', '.env'))) {
  console.log('⚠️  .env file not found. Creating from .env.example...');
  try {
    fs.copyFileSync(
      path.join(__dirname, '..', '.env.example'),
      path.join(__dirname, '..', '.env')
    );
    console.log('✅ .env file created. Please update it with your database credentials.\n');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
}

console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ Dependencies installed.\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('📝 Setup instructions:');
console.log('1. Import the SQL dump: mysql -u root -p < database/sql/mashvisor_dump_db.sql');
console.log('2. Create listings table: mysql -u root -p exam_db < database/sql/create_listings_table.sql');
console.log('3. Seed listings: node scripts/seed-listings.js');
console.log('4. Ensure MongoDB is running');
console.log('5. Seed MongoDB: node scripts/seed-mongodb.js');
console.log('6. Start server: npm start\n');

console.log('✅ Setup script completed!');

