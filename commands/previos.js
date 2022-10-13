const { GuildMember } = require('discord.js');

module.exports = {
  name: 'previos',
  description: 'Play the previos song!',
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

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    const currentTrack = queue.current;
    const success = queue.back();
    return void interaction.followUp({
      content: success
        ? `✅ | Skipped to previos song: **${currentTrack}**!`
        : '❌ | Something went wrong!',
    });
  },
};
