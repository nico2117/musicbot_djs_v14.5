const {MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const Discord = require('discord.js');
const discordModals = require('discord-modals');
const { Modal, TextInputComponent, showModal } = discordModals;

module.exports = {
  name: 'formular',
  description: 'Formular Modal',
  options: [],
  execute: (interaction, client) => {

    let button = new MessageActionRow();
    button.addComponents(
      new MessageButton()
        .setCustomId('verification-button')
        .setStyle('PRIMARY')
        .setLabel('Open modal dialog'),
    );
    interaction.reply({
      components: [button],
    });
  }
};
