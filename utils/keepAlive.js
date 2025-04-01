const express = require('express');
const cron = require('node-cron');
const config = require('../config');
const logger = require('./logger');
const http = require('http');
const os = require('os');

function keepAlive() {
  const app = express();
  const PORT = process.env.PORT || 8000;
  
  // Simple HTML landing page
  app.get('/', (req, res) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Discord Bot Status</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #7289DA;
          }
          .status {
            background-color: #f4f4f4;
            border-left: 4px solid #7289DA;
            padding: 15px;
            margin-bottom: 20px;
          }
          .online {
            color: #43B581;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Discord Bot Status</h1>
        <div class="status">
          <p><strong>Status:</strong> <span class="online">Online</span></p>
          <p><strong>Uptime:</strong> ${formatUptime(process.uptime())}</p>
          <p><strong>Last Checked:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p>This is a status page for the Discord bot. The bot is currently running and operational.</p>
      </body>
      </html>
    `;
    res.send(html);
  });
  
  // Health check endpoint with detailed stats
  app.get('/health', (req, res) => {
    const memoryUsage = process.memoryUsage();
    
    res.status(200).json({
      status: 'UP',
      timestamp: new Date(),
      uptime: process.uptime(),
      version: process.version,
      memory: {
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
        totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`
      }
    });
  });

  // Add metrics endpoint for monitoring
  app.get('/metrics', (req, res) => {
    const metrics = {
      server: {
        uptime: process.uptime(),
        timestamp: Date.now()
      },
      process: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    };
    
    res.status(200).json(metrics);
  });
  
  // Start the server
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Keep-alive server is running on port ${PORT}`);
  });
  
  // Set up cron job to ping the server at regular intervals
  cron.schedule(config.keepAliveInterval, () => {
    const hostname = process.env.HOST_URL || `http://localhost:${PORT}`;
    
    // Make a request to the server to keep it alive
    http.get(`${hostname}/health`, (res) => {
      const timestamp = new Date().toISOString();
      logger.info(`[${timestamp}] Self-ping performed with status: ${res.statusCode}`);
    }).on('error', (err) => {
      const timestamp = new Date().toISOString();
      logger.error(`[${timestamp}] Error during self-ping:`, err.message);
    });
  });
  
  // Return the server instance
  return server;
}

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (secs > 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
  
  return parts.join(', ');
}

module.exports = keepAlive;
