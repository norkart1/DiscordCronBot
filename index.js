require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const keepAlive = require('./utils/keepAlive');
const logger = require('./utils/logger');
const config = require('./config');

// Initialize the client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Create a collection for commands
client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  logger.info(`Loaded command: ${command.name}`);
}

// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  const eventName = file.split('.')[0];
  
  if (event.once) {
    client.once(eventName, (...args) => event.execute(client, ...args));
  } else {
    client.on(eventName, (...args) => event.execute(client, ...args));
  }
  
  logger.info(`Loaded event: ${eventName}`);
}

// Start the Express server to keep the bot alive
keepAlive();

// Handle errors and process termination
process.on('unhandledRejection', error => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('SIGINT', () => {
  logger.info('Bot is shutting down...');
  process.exit(0);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN)
  .then(() => logger.info('Bot successfully logged in'))
  .catch(err => {
    logger.error('Failed to log in:', err);
    process.exit(1);
  });
