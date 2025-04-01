const { ActivityType } = require('discord.js');
const config = require('../config');
const logger = require('../utils/logger');

module.exports = {
  once: true,
  execute(client) {
    logger.info(`Logged in as ${client.user.tag}!`);
    
    // Set the bot's activity status
    const activityTypes = {
      'PLAYING': ActivityType.Playing,
      'STREAMING': ActivityType.Streaming,
      'LISTENING': ActivityType.Listening,
      'WATCHING': ActivityType.Watching,
      'COMPETING': ActivityType.Competing
    };
    
    const activityType = activityTypes[config.botActivity.type] || ActivityType.Playing;
    
    client.user.setPresence({
      activities: [{ 
        name: config.botActivity.message,
        type: activityType
      }],
      status: config.botActivity.status
    });
    
    logger.info(`Bot activity set to: ${config.botActivity.type} ${config.botActivity.message}`);
  },
};
