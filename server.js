const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes');
const { connect: connectMongo } = require('./config/mongodb');
const db = require('./config/database');

const app = express();
const PORT = process.env.NODE_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All routes
app.use('/', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: true, message: 'Something went wrong' });
});

// Initialize connections and start server
async function startServer() {
  try {
    // Test MySQL connection
    await db.getConnection();
    console.log('Connected to MySQL');

    // Connect to MongoDB
    await connectMongo();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  const { closeConnection } = require('./config/mongodb');
  await closeConnection();
  process.exit(0);
});

