# Discord Bot with Render Keep-Alive

A Discord bot built with Node.js that includes cron jobs to prevent Render hosting from sleeping and customizable bot activity status.

## Features

- **Discord.js Integration**: Complete event handling and command system
- **Express Server**: Keep-alive functionality to prevent hosting service from sleeping
- **Cron Jobs**: Scheduled tasks to ping the server every 5 minutes
- **Custom Bot Activity**: Dynamically change the bot's status (Playing, Streaming, etc.)
- **Logging System**: Comprehensive logging with Winston
- **Admin Commands**: Special commands for administrators
- **Status Web Page**: Simple web page showing bot status

## Commands

- `!help` - Displays all available commands or info about a specific command
- `!ping` - Checks the bot's response time and API latency
- `!status` - Shows detailed bot and system status
- `!activity` - Changes the bot's activity status (Admin only)

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   # Discord Bot Configuration
   DISCORD_TOKEN=your_discord_token_here
   PREFIX=!
   OWNER_ID=your_discord_id_here

   # Environment Configuration
   NODE_ENV=development
   LOG_LEVEL=info

   # Server Configuration
   PORT=8000
   HOST_URL=https://your-app-url.onrender.com
   ```
4. Replace placeholder values with your actual Discord bot token, etc.
5. Start the bot:
   ```
   node index.js
   ```

### Running Just the Keep-Alive Server

If you want to test the keep-alive server without the Discord bot functionality (useful if you don't have a valid Discord token yet), you can run:

```
node server.js
```

This will start only the Express server without attempting to connect to Discord. You can access the status page at http://localhost:8000/ and the health metrics at http://localhost:8000/health.

## Hosting on Render

This bot is designed to be hosted on [Render](https://render.com/):

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to `npm install`
4. Set the start command to `node index.js`
5. Add your environment variables from the `.env` file to Render's environment variables section
6. Deploy the service

The included keep-alive server and cron job will prevent the Render service from sleeping.

## Customizing Bot Activity

The bot's activity can be set in the `config.js` file or changed at runtime using the `!activity` command (Admin only).

Activity types:
- `PLAYING`
- `STREAMING`
- `LISTENING`
- `WATCHING`
- `COMPETING`

## Logs

Logs are stored in the following files:
- `combined.log` - All logs
- `error.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## License

This project is licensed under the MIT License - see the LICENSE file for details.