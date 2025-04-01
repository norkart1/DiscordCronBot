const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'help',
  description: 'Displays a list of available commands or information about a specific command',
  execute(message, args, client) {
    const { commands } = client;
    const prefix = config.prefix;
    
    // Create embed
    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setAuthor({ 
        name: 'Bot Commands', 
        iconURL: client.user.displayAvatarURL() 
      })
      .setFooter({ 
        text: `Requested by ${message.author.tag}`, 
        iconURL: message.author.displayAvatarURL() 
      })
      .setTimestamp();
    
    if (!args.length) {
      // Display all commands with emojis from config
      embed.setTitle('📚 Help Menu')
        .setDescription(`Here are all the available commands. Use \`${prefix}help [command]\` for more information on a specific command.`);
      
      // Group commands by type or category if needed
      const commandFields = [];
      
      commands.forEach(cmd => {
        const cmdConfig = config.commands[cmd.name];
        const emoji = cmdConfig?.emoji || '🔹';
        const description = cmdConfig?.description || cmd.description || 'No description provided';
        
        commandFields.push({
          name: `${emoji} \`${prefix}${cmd.name}\``, 
          value: description
        });
      });
      
      // Sort commands alphabetically
      commandFields.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      // Add sorted commands to embed (up to maxCommands limit)
      for (let i = 0; i < Math.min(commandFields.length, config.maxCommands); i++) {
        embed.addFields(commandFields[i]);
      }
      
      return message.channel.send({ embeds: [embed] });
    }
    
    // Display info for a specific command
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName);
    
    if (!command) {
      const errorEmbed = new EmbedBuilder()
        .setColor(config.colors.error)
        .setDescription(`❌ The command \`${commandName}\` doesn't exist!`);
      return message.reply({ embeds: [errorEmbed] });
    }
    
    const cmdConfig = config.commands[command.name];
    const emoji = cmdConfig?.emoji || '🔹';
    
    embed.setTitle(`${emoji} Command: ${prefix}${command.name}`)
      .setDescription(command.description || 'No description provided');
    
    // Add usage field
    embed.addFields({ 
      name: '📝 Usage', 
      value: `\`${prefix}${command.name}\`` 
    });
    
    // Add examples if available
    if (command.examples) {
      const exampleText = Array.isArray(command.examples) 
        ? command.examples.map(ex => `\`${prefix}${command.name} ${ex}\``).join('\n')
        : `\`${prefix}${command.name} ${command.examples}\``;
        
      embed.addFields({ 
        name: '💡 Examples', 
        value: exampleText 
      });
    }
    
    // Add permissions if required
    if (command.permissions) {
      embed.addFields({ 
        name: '🔒 Required Permissions', 
        value: Array.isArray(command.permissions) 
          ? command.permissions.join(', ')
          : command.permissions
      });
    }
    
    message.channel.send({ embeds: [embed] });
  },
};
