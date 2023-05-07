const { default: mongoose } = require('mongoose');
const { ActivityType, EmbedBuilder } = require('discord.js');
const { msToTime } = require('../methods/timeConverter');

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

    const { player } = client;
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

    //#region player-events
    player.on('error', (queue, error) => {
      console.log(
        `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
      );
    });

    player.on('connectionError', (queue, error) => {
      console.log(
        `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
      );
    });

    player.on('trackStart', (queue, track) => {
      /* queue.metadata.send(`▶ | Started playing: **${track.title}** in **${queue.connection.channel.name}**! Track added by: ${track.requestedBy}`); */
      let trackAddedEmbed = new EmbedBuilder()
        .setTitle('▶ Start playing')
        .setDescription(`**[${track.title}](${track.url})**`)
        /* .setURL(track.url) */
        .setThumbnail(track.thumbnail)
        .addFields(
          { name: 'Channel', value: track.author, inline: true },
          {
            name: 'Song Duration',
            value: track.duration.toString(),
            inline: true,
          }
        )
        .setColor(0xffffff)
        .setFooter({
          text: `added by: @${track.requestedBy.username}`,
          iconURL: track.requestedBy.avatarURL(),
        });

      queue.metadata.send({ embeds: [trackAddedEmbed] });
    });

    player.on('trackAdd', (queue, track) => {
      //queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
      let trackAddedEmbed = new EmbedBuilder()
        .setTitle('Track added to queue')
        .setDescription(`**[${track.title}](${track.url})**`)
        /* .setURL(track.url) */
        .setThumbnail(track.thumbnail)
        /* .addFields(
        { name: 'Channel', value: track.author, inline: true },
        { name: 'Song Duration', value: track.duration.toString(), inline: true },
        { name: 'Position in queue', value: queue.tracks.length}
      ) */
        .addFields([
          { name: 'Channel', value: track.author, inline: true },
          { name: 'Song Duration', value: track.duration, inline: true },
          {
            name: 'Position in queue',
            value: queue.tracks.length.toString(),
            inline: true,
          },
          {
            name: 'Song starts playing in:',
            value: msToTime(queue.totalTime),
            inline: true,
          },
        ])
        .setColor(0xffffff)
        .setFooter({
          text: `added by: @${track.requestedBy.username}`,
          iconURL: track.requestedBy.avatarURL(),
        });
      queue.metadata.send({ embeds: [trackAddedEmbed] });
    });

    player.on('botDisconnect', (queue) => {
      queue.metadata.send(
        '❌ | I was manually disconnected from the voice channel, clearing queue!'
      );
    });

    player.on('channelEmpty', (queue) => {
      queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
    });

    player.on('queueEnd', (queue) => {
      queue.metadata.send('✅ | Queue finished!');
    });
    //#endregion

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
