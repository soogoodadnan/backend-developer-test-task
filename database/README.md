# Database Directory

This directory contains all database-related files organized by purpose.

## Structure

```
database/
├── sql/              # SQL scripts and dumps
│   ├── mashvisor_dump_db.sql      # MySQL database dump
│   └── create_listings_table.sql  # SQL schema for listings table
└── seeds/            # Seed data files
    ├── listings.json  # MongoDB listings seed data
    ├── agents.json    # MongoDB agents seed data
    └── views.json     # MongoDB views seed data
```

## SQL Files

### `sql/mashvisor_dump_db.sql`
- Complete MySQL database dump
- Contains base schema and initial data
- Import with: `mysql -u root -p < database/sql/mashvisor_dump_db.sql`

### `sql/create_listings_table.sql`
- Creates the `listings` table schema
- Run after importing the base database dump
- Import with: `mysql -u root -p exam_db < database/sql/create_listings_table.sql`

## Seed Files

### `seeds/listings.json`
- MongoDB listings collection seed data
- Used by `scripts/seed-mongodb.js`

### `seeds/agents.json`
- MongoDB agents collection seed data
- Used by `scripts/seed-mongodb.js`

### `seeds/views.json`
- MongoDB views collection seed data
- Used by `scripts/seed-mongodb.js`

## Usage

1. **MySQL Setup:**
   ```bash
   # Import base database
   mysql -u root -p < database/sql/mashvisor_dump_db.sql
   
   # Create listings table
   mysql -u root -p exam_db < database/sql/create_listings_table.sql
   
   # Seed listings (reads from seeds/listings.json)
   node scripts/seed-listings.js
   ```

2. **MongoDB Setup:**
   ```bash
   # Seed MongoDB (reads from seeds/*.json)
   node scripts/seed-mongodb.js
   ```

