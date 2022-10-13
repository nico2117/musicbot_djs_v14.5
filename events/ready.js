const { default: mongoose } = require('mongoose');
const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute: async (client) => {
    client.user.setActivity(client.config.activity, {
      type: ActivityType.Playing,
    });
    const guildNames = client.guilds.cache.map(
      (guild) => `${guild.id}: ${guild.name}`
    );
    console.log(guildNames);
    /* await client.application.commands
      .set(client.commands)
      .then(() => {
        console.log("Deployed global commands!");
      })
      .catch((err) => {
        console.log(
          "Could not deploy commands! Make sure the bot has the application.commands permission!"
        );
        console.error(err);
      }); */
    try {
      mongoose.connect(process.env.MONGO_URI);
      console.log('Data Base connected');
    } catch (err) {
      console.log(err);
    }

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
