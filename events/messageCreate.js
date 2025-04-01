const config = require('../config');
const logger = require('../utils/logger');

module.exports = {
  once: false,
  execute(client, message) {
    // Ignore messages from bots or messages that don't start with the prefix
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    
    // Extract command and arguments
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // Find the command
    const command = client.commands.get(commandName);
    
    // If command doesn't exist, return
    if (!command) return;
    
    // Execute the command
    try {
      logger.info(`${message.author.tag} executed command: ${commandName}`);
      command.execute(message, args, client);
    } catch (error) {
      logger.error(`Error executing command ${commandName}:`, error);
      message.reply('There was an error trying to execute that command!');
    }
  },
};
