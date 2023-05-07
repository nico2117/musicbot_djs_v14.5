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

const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client(config);
client.commands = new Discord.Collection();
const player = new Player(client);
client.player = player;

discordModals(client);

const server = require('./server/server');
server.start();
//Starts http server

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

/* client.on('voiceStateUpdate', (oldState, newState) => {
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
}); */

/* client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
}); */

client.login(client.config.token);
