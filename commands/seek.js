const { GuildMember } = require('discord.js');
const timeConverter = require('../methods/timeConverter');

module.exports = {
  name: 'seek',
  description: 'Skip to a exact position of the current track!',
  options: [
    {
      name: 'position',
      type: 3, // 'STRING' Type
      description: 'Position of the current track you want to skip to',
      required: true,
    },
  ],
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
    const trackPosition = interaction.options.get('position').value;
    const timeNumber = timeConverter.timeToMs(trackPosition);
    console.log(timeNumber);
    const success = queue.seek(timeNumber);
    return void interaction.followUp({
      content: success
        ? `✅ | Song position changed to ${trackPosition}!`
        : '❌ | Something went wrong!',
    });
  },
};
