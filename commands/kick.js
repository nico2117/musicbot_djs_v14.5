module.exports = {
  name: 'kick',
  description: 'Kick a member',
  options: [
    {
      name: 'user',
      type: 6, //USER Type
      description: 'The user you want to kick',
      required: true,
    },
  ],
  execute: (interaction, client) => {
    const member = interaction.options.get('user').value;

    if (!member) {
      return message.reply('You need to mention the member you want to kick him');
    }

    if (!interaction.member.permissions.has('kick_MEMBERS')) {
      return message.reply("I can't kick this user.");
    }

    const userinfo = client.users.cache.get(member);

    return interaction.guild.members
      .kick(member)
      .then(() => {
        interaction.reply({
          content: `${userinfo.username} was kicked.`,
          ephemeral: true,
        });
      })
      .catch(error =>
        interaction.reply({
          content: `Sorry, an error occured.`,
          ephemeral: true,
        }),
      );
  },
};
