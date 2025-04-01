const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'ping',
  description: 'Checks the bot\'s response time and API latency',
  execute(message, args, client) {
    const startTime = Date.now();
    
    message.channel.send('Pinging...').then(sent => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const embed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('🏓 Pong!')
        .addFields(
          { name: 'Response Time', value: `${responseTime}ms`, inline: true },
          { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true },
        )
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      sent.edit({ content: null, embeds: [embed] });
    });
  },
};
