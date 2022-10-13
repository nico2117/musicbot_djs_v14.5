const { default: axios } = require('axios');
const { GuildMember, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'lyrics',
  description: 'Get the lyrics of your song title!',
  options: [
    {
      name: 'songtitle',
      description: 'title of the song',
      type: 3,
      required: true,
    },
  ],
  async execute(interaction, player) {
    function substring(length, value) {
      const replace = value.replace(/\n/g, '--');
      const regex = `.{1,${length}}`;
      const lines = replace
        .match(new RegExp(regex, 'g'))
        .map((line) => line.replace(/--/g, '\n'));
      return lines;
    }

    const songTitle = interaction.options.get('songtitle').value;

    interaction.deferReply();
    /* const data = null;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        data = JSON.parse(this.responseText);
      }
    };
    xhr.open(
      'GET',
      `https://some-random-api.ml/lyrics?title=${songTitle}`,
      true
    );
    xhr.send(); */

    const url = new URL('https://some-random-api.ml/lyrics');
    url.searchParams.append('title', songTitle);
    try {
      const { data } = await axios.get(url.href);
      /* if (!data) {
        console.log('Error while looking for lyrics');
        return interaction.followUp({
          content:
            'Sorry but I am not able to find lyrics for that song title!',
        });
      } */
      const embeds = substring(4000, data.lyrics).map((value, index) => {
        const isFirst = index === 0;

        return new MessageEmbed({
          title: isFirst ? `${data.title} - ${data.author}` : null,
          thumbnail: isFirst ? { url: data.thumbnail.genius } : null,
          description: value,
        });
      });

      return interaction.followUp({ embeds });
    } catch (err) {
      console.log('Error while looking for lyrics');
      interaction.followUp({
        content: 'Sorry but I am not able to find lyrics for that song title!',
      });
    }
  },
};
