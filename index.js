const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const config = require('./config.json');
const { Player } = require('discord-player');
const {
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
  EmbedBuilder,
} = require('discord.js');
const path = require('path');
const http = require('http');
const discordModals = require('discord-modals');
const { Modal, TextInputComponent, showModal } = discordModals;
const { msToTime } = require('./methods/timeConverter');

const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client(config);
client.commands = new Discord.Collection();
const player = new Player(client);
client.player = player;

discordModals(client);

/* http
  .createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
  })
  .listen(8080);
console.log('request handler registered'); */

const server = require('./server/server');
server.start();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);
const eventsPath = path.resolve('events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

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
      { name: 'Song Duration', value: track.duration.toString(), inline: true }
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

client.on('voiceStateUpdate', (oldState, newState) => {
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
});

player.on('channelEmpty', (queue) => {
  queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
});

player.on('queueEnd', (queue) => {
  queue.metadata.send('✅ | Queue finished!');
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.login(client.config.token);
