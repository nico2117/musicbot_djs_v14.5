module.exports = {
  name: 'ban',
  description: 'Ban a member',
  options: [
    {
      name: 'user',
      type: 6, //USER Type
      description: 'The user you want to ban',
      required: true,
    },
  ],
  execute: (interaction, client) => {
    const member = interaction.options.get('user').value;

    if (!member) {
      return message.reply('You need to mention the member you want to ban him');
    }

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return message.reply("I can't ban this user.");
    }

    const userinfo = client.users.cache.get(member);

    return interaction.guild.members
      .ban(member)
      .then(() => {
        interaction.reply({
          content: `${userinfo.username} was banned.`,
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
