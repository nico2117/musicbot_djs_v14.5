const { DiscordAPIError } = require('@discordjs/rest');
const { Collection } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  execute: async (message) => {
    const path = require('path');
    const fs = require('fs');
    const { client } = message;
    if (message.author.bot) return;
    if (!message.content.startsWith(client.config.prefix)) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (
      message.content === '!deploy' &&
      message.author.id === client.application?.owner?.id
    ) {
      //deploy guild commands
      await message.guild.commands
        .set(client.commands)
        .then(() => {
          message.reply('Deployed!');
        })
        .catch((err) => {
          message.reply(
            'Could not deploy commands! Make sure the bot has the application.commands permission!'
          );
          console.error(err);
        });
    }

    if (
      message.content === '!invite' &&
      message.author.id === client.application?.owner?.id
    ) {
      let invite = await message.channel.createInvite();

      message.reply(invite.toString());
    }

    if (
      message.content === '!inviteBP' &&
      message.author.id === client.application?.owner?.id
    ) {
      let c = client.guilds.cache
        .get('827249257807478854')
        .channels.cache.get('949054022000709642');
      let invite = await c.createInvite();

      message.reply(invite.toString());
    }
  },
};
