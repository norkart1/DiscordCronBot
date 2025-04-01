module.exports = {
  prefix: process.env.PREFIX || '!',
  botActivity: {
    type: 'PLAYING', // Can be PLAYING, STREAMING, LISTENING, WATCHING, COMPETING
    message: 'with Discord.js',
    status: 'online' // Can be online, idle, dnd, invisible
  },
  keepAliveInterval: '*/5 * * * *', // Run every 5 minutes
  maxCommands: 10, // Maximum number of commands to display in help
  colors: {
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
    warning: '#FF9800'
  },
  ownerID: process.env.OWNER_ID || '', // Bot owner's Discord ID
  renderURL: process.env.HOST_URL || 'http://localhost:8000',
  // Command settings
  commands: {
    help: {
      emoji: '📚',
      description: 'Shows a list of all commands or details about a specific command'
    },
    ping: {
      emoji: '🏓',
      description: 'Checks the bot\'s response time'
    },
    status: {
      emoji: '📊',
      description: 'Shows the current status of the bot and server'
    },
    activity: {
      emoji: '🎮',
      description: 'Changes the bot\'s activity status (Admin only)'
    }
  }
};
