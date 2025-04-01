const { EmbedBuilder } = require('discord.js');
const { version } = require('discord.js');
const config = require('../config');
const os = require('os');

module.exports = {
  name: 'status',
  description: 'Displays bot and system status information',
  execute(message, args, client) {
    // Calculate uptime
    const uptime = process.uptime();
    const uptimeString = formatUptime(uptime);
    
    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = (memoryUsage.rss / 1024 / 1024).toFixed(2);
    const totalMemoryMB = (os.totalmem() / 1024 / 1024).toFixed(2);
    
    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle('Bot Status')
      .addFields(
        { name: '🤖 Bot Info', value: [
          `**Discord.js**: v${version}`,
          `**Node.js**: ${process.version}`,
          `**Uptime**: ${uptimeString}`,
        ].join('\n'), inline: false },
        { name: '💻 System Info', value: [
          `**Platform**: ${os.platform()} ${os.release()}`,
          `**Memory Usage**: ${memoryUsedMB}MB / ${totalMemoryMB}MB`,
          `**CPU**: ${os.cpus()[0].model}`,
        ].join('\n'), inline: false },
        { name: '🔄 Server Stats', value: [
          `**Servers**: ${client.guilds.cache.size}`,
          `**Channels**: ${client.channels.cache.size}`,
          `**Users**: ${client.users.cache.size}`,
        ].join('\n'), inline: false }
      )
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};

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
