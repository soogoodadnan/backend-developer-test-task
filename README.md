# Real Estate Listings API

A RESTful API for managing real estate listings built with Node.js, MySQL, and MongoDB.

## Tech Stack

- **Node.js** - Express.js framework
- **MySQL** - Relational database for listings storage
- **MongoDB** - NoSQL database for aggregations and statistics

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd backend-developer-test-task

# Install Node.js dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment example file
cp .env.example .env
```

Update `.env` with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=exam_db
DB_PORT=3306

MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=real_estate_db

NODE_PORT=3000
```

### 3. Database Setup

#### MySQL Setup

1. Import the provided SQL dump:
```bash
mysql -u root -p < database/sql/mashvisor_dump_db.sql
```

2. Create the listings table:
```bash
mysql -u root -p exam_db < database/sql/create_listings_table.sql
```

3. Seed listings data:
```bash
node scripts/seed-listings.js
```

#### MongoDB Setup

1. Ensure MongoDB is running:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

2. Seed MongoDB with JSON data:
```bash
node scripts/seed-mongodb.js
```

### 4. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Listings (CRUD Operations)

#### Get All Listings
```
GET /listings
```
Returns all listings with formatted prices and capitalized cities.

#### Get Listing by ID
```
GET /listings/:id
```
Returns a single listing by ID.

#### Create Listing
```
POST /listings
Content-Type: application/json

{
  "title": "Luxury Villa",
  "city": "Los Angeles",
  "price": 550000,
  "bedrooms": 4,
  "agentId": 101
}
```

#### Update Listing
```
PUT /listings/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "city": "New York",
  "price": 275000,
  "bedrooms": 3,
  "agentId": 101
}
```

#### Delete Listing
```
DELETE /listings/:id
```

### Statistics

#### Get Active Agents Statistics
```
GET /stats/active-agents
```
Returns statistics for active agents including:
- Agent name
- Total listings (priced above 300,000)
- Total views across their listings
- Sorted by totalViews descending
- Includes agents with 0 listings or 0 views

### Health Check

```
GET /health
```

## Postman Collection

Import the `Real_Estate_Listings_API.postman_collection.json` file into Postman to test all endpoints with sample requests and responses.

## Choices and Decisions

### Architecture

**Layered Architecture (Controllers → Services → Models)**
- **Controllers**: Handle HTTP requests/responses and error formatting
- **Services**: Contain business logic, validation, and orchestration
- **Models**: Data access layer (database queries)
- **Routes**: Define endpoints and map them to controllers

This separation ensures maintainability, testability, and scalability. Each layer has a single responsibility, making the codebase easier to understand and modify.

### Database Design

**MySQL for Listings**
- Used for transactional CRUD operations
- Relational structure ensures data integrity

**MongoDB for Statistics**
- Used for aggregations and analytics (agents, views statistics)
- Flexible schema allows for easy data structure changes
- Optimized for read-heavy analytical queries
- MongoDB aggregation pipeline provides efficient data processing

This hybrid approach leverages the strengths of each database type.

### Data Formatting

**City Formatting**
- Cities are stored in lowercase in the database for consistency
- Returned with first letter capitalized in API responses using SQL functions
- This ensures consistent storage while providing user-friendly display

**Price Formatting**
- Prices are formatted to 2 decimal places using SQL `ROUND(price, 2)`
- Ensures consistent monetary representation across all responses

### MongoDB Aggregation

**Used MongoDB Aggregation Pipeline** instead of multiple queries
- Single database query instead of N+1 queries
- All processing happens in MongoDB, reducing data transfer
- Better performance with large datasets
- Clear, readable pipeline stages

The aggregation pipeline:
1. Matches active agents
2. Looks up listings filtered by price > 300,000
3. Looks up views for those listings
4. Calculates totals using aggregation operators
5. Sorts by totalViews descending

### Error Handling

**Consistent Error Format**
- All errors follow the format: `{ "error": true, "message": "Error message" }`
- Proper HTTP status codes (400, 404, 500)
- Error messages are user-friendly and descriptive

**Validation Strategy**
- Validation happens in the service layer
- Clear error messages for missing or invalid fields
- Type checking for price and bedrooms fields

### Code Organization

**File Structure**
- Organized by feature/concern (controllers, services, models, routes)
- Database files organized in `database/` directory (SQL and seeds)
- Scripts for common tasks (seeding, setup)
- Configuration files separated

**Minimal Comments**
- Code is self-documenting with clear method names
- Comments added only where necessary for clarity
- Documentation focuses on "why" rather than "what"

## What I Would Improve (If I Had More Than 4 Hours)

### 1. Testing
- **Unit Tests**: Add comprehensive unit tests using Jest/Mocha for services and controllers
- **Integration Tests**: Test API endpoints with real database connections
- **Test Coverage**: Aim for 80%+ code coverage
- **Database Migration Tests**: Ensure migrations work correctly

### 2. Validation & Security
- **Input Sanitization**: Add input sanitization to prevent injection attacks
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Authentication/Authorization**: Add JWT-based authentication and role-based access control
- **Request Validation**: Use express-validator or similar middleware for request validation
- **SQL Injection Prevention**: Ensure all queries use parameterized statements (already done)
- **CORS Configuration**: Configure CORS properly for production

### 3. Performance
- **Database Connection Pooling**: Optimize connection pool settings
- **Caching**: Implement Redis caching for frequently accessed data
- **Pagination**: Add pagination for listings endpoint to handle large datasets
- **Database Indexes**: Add proper indexes on frequently queried fields
- **Query Optimization**: Analyze and optimize slow queries

### 4. Documentation
- **API Documentation**: Add Swagger/OpenAPI documentation
- **JSDoc Comments**: Add comprehensive JSDoc comments for better IDE support
- **API Usage Examples**: Create detailed usage examples with different scenarios
- **Architecture Diagrams**: Visual documentation of system architecture

### 5. Code Quality
- **ESLint & Prettier**: Add linting and formatting rules
- **Pre-commit Hooks**: Add Husky for pre-commit checks
- **Error Logging**: Implement structured logging with Winston
- **Request Logging**: Add Morgan for HTTP request logging
- **Code Review Checklist**: Establish code review standards

### 6. Database
- **Migrations**: Implement proper database migrations (e.g., Knex.js, Sequelize)
- **Seeding**: Enhanced seeding scripts with more realistic data
- **Backup Strategy**: Document database backup and recovery procedures
- **Database Transactions**: Use transactions for complex operations

### 7. DevOps & Deployment
- **Docker**: Add Docker and Docker Compose for easy setup
- **CI/CD**: Add GitHub Actions or similar for automated testing and deployment
- **Environment Configs**: Separate configurations for dev, staging, and production
- **Health Checks**: Enhanced health check endpoints for databases
- **Monitoring**: Add application monitoring and alerting

### 8. API Enhancements
- **Filtering & Sorting**: Add query parameters for filtering and sorting listings
- **Search**: Implement full-text search functionality
- **Soft Deletes**: Implement soft deletes instead of hard deletes
- **API Versioning**: Proper API versioning strategy (already structured for this)
- **Response Metadata**: Add pagination metadata, total counts, etc.

### 9. Error Handling & Monitoring
- **Error Tracking**: Integrate Sentry or similar for error tracking
- **Structured Logging**: Implement structured logging with correlation IDs
- **Metrics Collection**: Add Prometheus metrics for monitoring
- **Alerting**: Set up alerts for critical errors

### 10. Additional Features
- **Bulk Operations**: Add endpoints for bulk create/update/delete
- **Data Export**: Add CSV/JSON export functionality
- **Webhooks**: Implement webhook notifications for listing changes
- **Audit Log**: Track all changes to listings with audit trail

## Project Structure

```
backend-developer-test-task/
├── config/
│   ├── database.js          # MySQL connection configuration
│   └── mongodb.js           # MongoDB connection configuration
├── controllers/
│   ├── listingsController.js # HTTP request/response handling
│   └── statsController.js    # Stats endpoint handling
├── services/
│   ├── listingService.js     # Business logic for listings
│   └── statsService.js       # Business logic for stats
├── models/
│   └── listing.js            # Data access layer
├── routes/
│   ├── index.js              # Route version manager
│   ├── listings.js           # Listings routes
│   └── stats.js              # Stats routes
├── database/
│   ├── sql/                  # SQL scripts
│   └── seeds/                # Seed data files
├── scripts/
│   ├── seed-listings.js      # MySQL seeding script
│   └── seed-mongodb.js       # MongoDB seeding script
├── server.js                 # Main Express server
└── package.json              # Dependencies
```

## Troubleshooting

### MySQL Connection Error
- Check MySQL is running: `brew services list` (macOS) or `sudo systemctl status mysql` (Linux)
- Verify credentials in `.env`
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### MongoDB Connection Error
- Check MongoDB is running: `brew services list mongodb-community` (macOS)
- Start MongoDB: `brew services start mongodb-community` (macOS)
- Verify connection: `mongosh` or `mongo`

### Port Already in Use
- Change `NODE_PORT` in `.env` to a different port
- Or kill the process using port 3000

## License

This project is created for evaluation purposes.
