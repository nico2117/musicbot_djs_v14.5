const { GuildMember, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'queue',
  description: 'View the queue of current songs!',

  async execute(interaction, player) {
    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      return void interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.client.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.client.voice.channelId
    ) {
      return void interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      });
    }
    var queue = player.getQueue(interaction.guildId);
    if (typeof queue != 'undefined') {
      trimString = (str, max) =>
        str.length > max ? `${str.slice(0, max - 3)}...` : str;
      const progress = queue.createProgressBar();
      const perc = queue.getPlayerTimestamp();
      let npEmbed = new MessageEmbed();
      npEmbed.setTitle('Now Playing');
      npEmbed.setDescription(
        trimString(
          `**🎶 | [${queue.current.title}](${queue.current.url})**`,
          4095
        )
      );
      npEmbed.setFooter({
        text: `added by: @${queue.current.requestedBy.username}`,
        iconURL: queue.current.requestedBy.avatarURL(),
      });
      return void interaction.reply({
        embeds: [
          /* {
                    title: 'Now Playing',
                    description: trimString(`The current song playing is 🎶 | **${queue.current.title}**! \n 🎶 | **${queue}**! `, 4095),
                  }, */
          {
            title: 'Now Playing',
            description: `🎶 | **[${queue.current.title}](${queue.current.url})**! (\`${perc.progress}%\`)`,
            fields: [
              {
                name: '\u200b',
                value: progress,
              },
            ],
            footer: {
              text: `added by: @${queue.current.requestedBy.username}`,
              iconURL: queue.current.requestedBy.avatarURL(),
            },
            color: 0xffffff,
          },
          {
            title: 'Songs in queue',
            description: trimString(`🎶 | ${queue} `, 4095),
            color: 0xffffff,
          },
        ],
      });
    } else {
      return void interaction.reply({
        content: 'There is no song in the queue!',
      });
    }
  },
};
