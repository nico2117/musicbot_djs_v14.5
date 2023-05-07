module.exports = {
  name: 'voiceStateUpdate',
  execute: async (oldState, newState) => {
    const { client } = oldState;
    const { player } = client;
    // Represents a mute/deafen update
    if (oldState.channelId === newState.chanelId)
      return console.log('Mute/Deafen Update');

    // Some connection
    if (!oldState.channelId && newState.channelId)
      return console.log('Connection Update');

    // Disconnection
    if (oldState.channelId && !newState.channelId) {
      console.log('Disconnection Update');
      // Bot was disconnected?
      if (newState.id === client.user.id) {
        const queue = player.getQueue(oldState.guild.id);
        if (queue) {
          queue.metadata.send(
            '❌ | I was manually disconnected from the voice channel, clearing queue!'
          );
          queue.destroy();
        }
        return console.log(`${client.user.username} was disconnected!`);
      }
    }
  },
};
