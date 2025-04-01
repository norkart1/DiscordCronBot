require('dotenv').config();
const keepAlive = require('./utils/keepAlive');
const logger = require('./utils/logger');

// Start the keep-alive server
const server = keepAlive();

// Log start message
logger.info('Keep-alive server is running separately from the Discord bot');
logger.info('Use this for testing the server without a valid Discord token');

// Handle process termination gracefully
process.on('SIGINT', () => {
  logger.info('Server is shutting down...');
  server.close(() => {
    logger.info('Server successfully closed');
    process.exit(0);
  });
});

// Log startup message with instructions
console.log(`
======================================
🚀 Keep-Alive Server Running
======================================
The Express server is now running on port 8000

Available Routes:
- / - Status page with HTML interface
- /health - Health check endpoint with detailed stats (JSON)
- /metrics - Metrics for monitoring (JSON)

To run the full Discord bot:
1. Ensure you have a valid DISCORD_TOKEN in your .env file
2. Start with: npm start

The keep-alive server helps prevent the Render hosting from sleeping
======================================
`);