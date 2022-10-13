const {
  Client,
  Collection,
  Intents,
  GatewayIntentBits,
} = require('discord.js');

module.exports = class extends Client {
  constructor(config) {
    super({
      intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
      ],
    });

    this.commands = new Collection();

    this.config = config;
  }
};
