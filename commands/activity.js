const { EmbedBuilder, ActivityType, PermissionFlagsBits } = require('discord.js');
const config = require('../config');
const logger = require('../utils/logger');

module.exports = {
  name: 'activity',
  description: 'Changes the bot\'s activity status (Admin only)',
  execute(message, args, client) {
    // Check if the user has administrator permissions
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('You need administrator permissions to use this command.');
    }

    // Define valid activity types
    const validTypes = {
      'playing': ActivityType.Playing,
      'streaming': ActivityType.Streaming,
      'listening': ActivityType.Listening,
      'watching': ActivityType.Watching,
      'competing': ActivityType.Competing
    };

    // Show help if no arguments provided
    if (args.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('Activity Command Help')
        .setDescription('Change the bot\'s activity status')
        .addFields(
          { name: 'Usage', value: `${config.prefix}activity <type> <status message>` },
          { name: 'Activity Types', value: Object.keys(validTypes).join(', ') },
          { name: 'Example', value: `${config.prefix}activity playing with Discord.js` }
        )
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

      return message.channel.send({ embeds: [embed] });
    }

    // Get the activity type (first argument)
    const activityType = args.shift().toLowerCase();

    // Validate activity type
    if (!Object.keys(validTypes).includes(activityType)) {
      return message.reply(`Invalid activity type. Valid types are: ${Object.keys(validTypes).join(', ')}`);
    }

    // Get the activity message (rest of the arguments)
    const activityMessage = args.join(' ');
    if (!activityMessage.length) {
      return message.reply('Please provide a status message.');
    }

    try {
      // Set the activity
      client.user.setPresence({
        activities: [{
          name: activityMessage,
          type: validTypes[activityType]
        }],
        status: config.botActivity.status
      });

      // Create confirmation embed
      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('Activity Status Updated')
        .setDescription(`Activity status has been updated to **${activityType.toUpperCase()} ${activityMessage}**`)
        .setFooter({ text: `Changed by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      // Log the activity change
      logger.info(`Activity status changed to ${activityType} ${activityMessage} by ${message.author.tag}`);
      
      // Send confirmation
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      logger.error('Error updating activity status:', error);
      message.reply('There was an error updating the activity status.');
    }
  },
};