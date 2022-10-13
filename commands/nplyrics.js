const { default: axios } = require('axios');
const { GuildMember, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'nplyrics',
  description: 'Get the lyrics of the current playing song!',
  async execute(interaction, player) {
    function substring(length, value) {
      const replace = value.replace(/\n/g, '--');
      const regex = `.{1,${length}}`;
      const lines = replace
        .match(new RegExp(regex, 'g'))
        .map((line) => line.replace(/--/g, '\n'));
      return lines;
    }

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

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });

    const songTitle = queue.current.title;
    const url = new URL('https://some-random-api.ml/lyrics');
    url.searchParams.append('title', songTitle);
    try {
      const { data } = await axios.get(url.href);

      const embeds = substring(4000, data.lyrics).map((value, index) => {
        const isFirst = index === 0;

        return new MessageEmbed({
          title: isFirst ? `${data.title} - ${data.author}` : null,
          thumbnail: isFirst ? { url: data.thumbnail.genius } : null,
          description: value,
        });
      });

      return interaction.followUp({ embeds });
    } catch (err) {
      interaction.followUp({
        content: 'sorry but I am not able to find lyrics for that song title!',
      });
    }
  },
};
