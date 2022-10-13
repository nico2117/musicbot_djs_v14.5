module.exports = {
  name: "interactionCreate",
  execute: async (interaction) => {
    const discordModals = require("discord-modals");
    const { Modal, TextInputComponent, showModal } = discordModals;

    const { client } = interaction;
    const { player } = client;
    discordModals(client);
    if (interaction.isCommand()) {
      const command = client.commands.get(
        interaction.commandName.toLowerCase()
      );

      try {
        if (
          interaction.commandName == "kick" ||
          interaction.commandName == "ban" ||
          interaction.commandName == "userinfo"
        ) {
          command.execute(interaction, client);
        } else {
          command.execute(interaction, player);
        }
      } catch (error) {
        console.error(error);
        interaction.followUp({
          content: "There was an error trying to execute that command!",
        });
      }
    } else if (interaction.isButton()) {
      /* console.log(interaction);
    const filter = i => i.customId === 'primary';

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'primary') {
        await i.deferUpdate();
        await wait(4000);
        await i.update({ content: 'A button was clicked!', components: [] });
      }
    });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`)); */

      if (interaction.customId === "verification-button") {
        const modal = new Modal() // We create a Modal
          .setCustomId("verification-modal")
          .setTitle("Verify yourself")
          .addComponents([
            new TextInputComponent()
              .setCustomId("verification-input")
              .setLabel("Answer")
              .setStyle("SHORT")
              .setMinLength(4)
              .setMaxLength(12)
              .setPlaceholder("ABCDEF")
              .setRequired(true),
          ]);

        showModal(modal, {
          client,
          interaction,
        });
      }

      if (interaction.customId === "formModal") {
        // Create the modal
        const modal = new Modal().setCustomId("formModal").setTitle("Formular");
        // Add components to modal
        // Create the text input components
        const favoriteColorInput = new TextInputComponent()
          .setCustomId("favoriteColorInput")
          // The label is the prompt the user sees for this input
          .setLabel("What's your favorite color?")
          // Short means only a single line of text
          .setStyle("SHORT");
        const hobbiesInput = new TextInputComponent()
          .setCustomId("hobbiesInput")
          .setLabel("What's some of your favorite hobbies?")
          // Paragraph means multiple lines of text.
          .setStyle("PARAGRAPH");
        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new MessageActionRow().addComponents(
          favoriteColorInput
        );
        const secondActionRow = new MessageActionRow().addComponents(
          hobbiesInput
        );
        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);
        // Show the modal to the user
        showModal(modal, {
          client,
          interaction,
        });
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "formModal") {
        const favoriteColor =
          interaction.fields.getTextInputValue("favoriteColorInput");
        const hobbies = interaction.fields.getTextInputValue("hobbiesInput");
        console.log({ favoriteColor, hobbies });
      }

      if (interaction.customId === "verification-modal") {
        const response =
          interaction.fields.getTextInputValue("verification-input");
        interaction.reply(`Your answer is submitted: "${response}"`);
      }
    } /*  else if (interaction.isMessageContextMenuCommand()) {
      const command = client.commands.get(
        interaction.commandName.toLowerCase()
      );

      try {
        command.execute(interaction);
      } catch (error) {
        console.error(error);
        interaction.followUp({
          content: "There was an error trying to execute that command!",
        });
      }
    } */
  },
};
