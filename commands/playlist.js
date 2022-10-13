const {
  GuildMember,
  User,
  ActionRowBuilder,
  SelectMenuBuilder,
  Interaction,
  CommandInteraction,
  EmbedBuilder,
} = require('discord.js');
const { QueryType } = require('discord-player');
const fs = require('fs');
const path = require('path');
/* const filePath = `c:/coding/Discord JS/music bot/data/playlist.json`; */
const filePath = path.resolve('data', 'playlist.json');
const db = require('../schema/playlist.js');

const mongoose = require('mongoose');

module.exports = {
  name: 'playlist',
  description: 'Create or delete a playlist for this server!',
  options: [
    {
      name: 'create',
      type: 1,
      description: 'Create new playlist!',
      options: [
        {
          name: 'name',
          type: 3, // 'STRING' Type
          description: 'Name of playlist',
          required: true,
        },
      ],
    },
    {
      name: 'delete',
      type: 1,
      description: 'Delete existing playlist!',
      options: [
        {
          name: 'name',
          type: 3, // 'STRING' Type
          description: 'Name of playlist',
          required: true,
        },
      ],
    },
    {
      name: 'list',
      type: 1,
      description: 'List tracks of existing playlist!',
      options: [
        {
          name: 'name',
          type: 3, // 'STRING' Type
          description: 'Name of playlist',
          required: true,
        },
      ],
    },
    {
      name: 'listall',
      type: 1, // 'STRING' Type
      description: 'List all existing playlists!',
      options: [],
    },
    {
      name: 'addtrack',
      type: 1, // 'STRING' Type
      description: 'Add a track to an existing playlist!',
      options: [
        {
          name: 'name',
          type: 3, // 'STRING' Type
          description: 'Name of playlist',
          required: true,
        },
        {
          name: 'query',
          type: 3, // 'STRING' Type
          description: 'Songname or URL of Song',
          required: true,
        },
      ],
    },
    {
      name: 'removetrack',
      type: 1, // 'STRING' Type
      description: 'Remove a track from an existing playlist!',
      options: [
        {
          name: 'name',
          type: 3, // 'STRING' Type
          description: 'Name of playlist',
          required: true,
        },
        {
          name: 'position',
          type: 4, // 'STRING' Type
          description: 'Track position in playlist',
          required: true,
        },
      ],
    },
    {
      name: 'play',
      type: 1,
      description: 'Play an existing playlist!',
      options: [
        {
          name: 'name',
          type: 3, // 'STRING' Type
          description: 'Name of playlist',
          required: true,
        },
      ],
    },
  ],
  async execute(interaction, player) {
    try {
      await interaction.deferReply();

      if (interaction.options.getSubcommand() === 'create') {
        const plname = interaction.options.get('name').value;
        const oldData = await db.find({
          GuildId: interaction.guild.id,
          PlaylistName: plname,
        });

        if (oldData.length >= 6) {
          return interaction.editReply({
            content: `You can only create 6 playlists per guild!`,
          });
        }

        if (oldData.length > 0) {
          return interaction.editReply({
            content: `Playlist ${plname} does already exist!`,
          });
        }

        const newData = new db({
          GuildId: interaction.guild.id,
          PlaylistName: plname,
          CreatedOn: Math.round(Date.now() / 1000),
        });
        await newData.save();
        return interaction.editReply({
          content: `✅ | New Playlist \`${plname}\` was created by <@${interaction.user.id}> !`,
        });
      } else if (interaction.options.getSubcommand() == 'delete') {
        const plname = interaction.options.get('name').value;
        const oldData = await db.findOne({
          GuildId: interaction.guild.id,
          PlaylistName: plname,
        });

        if (!oldData) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        if (oldData.length == 0) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        await oldData.delete();

        return interaction.editReply({
          content: `✅ | Playlist \`${plname}\` was deleted by <@${interaction.user.id}> !`,
        });
      } else if (interaction.options.getSubcommand() == 'list') {
        const plname = interaction.options.get('name').value;
        const data = await db.findOne({
          GuildId: interaction.guild.id,
          PlaylistName: plname,
        });

        if (!data) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        if (data.length == 0) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        let str = '';

        for (let key in data.Playlist) {
          str += `${Number(key) + 1}. ${data.Playlist[key].title} [\`${
            data.Playlist[key].duration
          }\`]\n`;
        }
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(data.PlaylistName.toUpperCase())
              .setDescription(str)
              .setColor(0xffffff),
          ],
        });
      } else if (interaction.options.getSubcommand() == 'listall') {
        const data = await db.find({
          GuildId: interaction.guild.id,
        });

        if (data.length == 0) {
          return interaction.editReply({
            content: `❌ | There are no playlists existing for this guild!`,
          });
        }
        let playlistEmbeds = data.map((playlist) => {
          let str = '';

          if (!playlist.Playlist.length) {
            str = 'No tracks in this playlist!';
          } else {
            for (let key in playlist.Playlist) {
              str += `${Number(key) + 1}. ${playlist.Playlist[key].title} [\`${
                playlist.Playlist[key].duration
              }\`]\n`;
            }
          }
          return new EmbedBuilder()
            .setTitle(String(playlist.PlaylistName).toUpperCase())
            .setDescription(str)
            .setColor(0xffffff);
        });

        return interaction.editReply({
          embeds: playlistEmbeds,
        });
      } else if (interaction.options.getSubcommand() == 'addtrack') {
        const plname = interaction.options.get('name').value;
        const query = interaction.options.get('query').value;

        const data = await db.findOne({
          GuildId: interaction.guild.id,
          PlaylistName: plname,
        });

        if (!data) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        if (data.length == 0) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        const searchResult = await player
          .search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
          })
          .catch(() => {});
        if (!searchResult || !searchResult.tracks.length)
          return void interaction.followUp({
            content: 'No results were found!',
          });
        const track = searchResult.tracks[0];
        let oldSong = data.Playlist;

        if (!Array.isArray(oldSong)) oldSong = [];

        oldSong.push({
          title: track.title,
          url: track.url,
          author: track.author,
          duration: track.duration,
        });
        await db.updateOne(
          {
            GuildId: interaction.guild.id,
            PlaylistName: data.PlaylistName,
          },
          {
            $push: {
              Playlist: {
                title: track.title,
                url: track.url,
                author: track.author,
                duration: track.duration,
              },
            },
          }
        );
        const embed = new EmbedBuilder()
          .setColor(0xffffff)
          .setDescription(
            `✅ | [${track.title.substr(0, 256)}](${
              track.url
            }) was added successfully to playlist \`${plname}\`!`
          )
          .setFooter({
            text: `added by: @${track.requestedBy.username}`,
            iconURL: track.requestedBy.avatarURL(),
          });
        return interaction.editReply({ embeds: [embed] });
      } else if (interaction.options.getSubcommand() == 'removetrack') {
        const plname = interaction.options.get('name').value;
        const position = interaction.options.get('position').value - 1;

        const data = await db.findOne({
          GuildId: interaction.guild.id,
          PlaylistName: plname,
        });

        if (!data) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        if (data.length == 0) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        if (position >= data.Playlist.length)
          return void interaction.followUp({
            content: '❌ | Track number greater than playlist depth!',
          });

        const oldSong = data.Playlist;

        await db.updateOne(
          {
            GuildId: interaction.guild.id,
            PlaylistName: data.PlaylistName,
          },
          {
            $pull: {
              Playlist: data.Playlist[position],
            },
          }
        );
        const embed = new EmbedBuilder()
          .setColor(0xffffff)
          .setDescription(
            `✅ | [${oldSong[position].title.substr(0, 256)}](${
              oldSong[position].url
            }) was removed successfully from playlist \`${plname}\`!`
          );
        return interaction.editReply({ embeds: [embed] });
      } else if (interaction.options.getSubcommand() == 'play') {
        const plname = interaction.options.get('name').value;

        const data = await db.findOne({
          GuildId: interaction.guild.id,
          PlaylistName: plname,
        });

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

        if (!data) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        if (data.length == 0) {
          return interaction.editReply({
            content: `❌ | Playlist ${plname} does not exist!`,
          });
        }

        const queue = await player.createQueue(interaction.guild, {
          ytdlOptions: {
            quality: 'highest',
            filter: 'audioonly',
            highWaterMark: 1 << 25,
            dlChunkSize: 0,
          },
          metadata: interaction.channel,
        });

        try {
          if (!queue.connection)
            await queue.connect(interaction.member.voice.channel);
        } catch {
          void player.deleteQueue(interaction.guildId);
          return void interaction.followUp({
            content: 'Could not join your voice channel!',
          });
        }

        await interaction.followUp({
          content: `⏱ | Loading playlist \`${plname}\`...`,
        });

        let searchResult = null;
        for (let t of data.Playlist) {
          searchResult = await player
            .search(t.url, {
              requestedBy: interaction.user,
              searchEngine: QueryType.AUTO,
            })
            .catch(() => {});
          if (!searchResult || !searchResult.tracks.length) {
            interaction.followUp({ content: 'No results were found!' });
          } else {
            queue.addTrack(searchResult.tracks[0]);
          }
        }

        if (!queue.playing) await queue.play();

        /*  const embed = new EmbedBuilder()
          .setColor(0xffffff)
          .setDescription(
            `✅ | Playlist \`${plname}\` was added to queue successfully!`
          );
        return interaction.editReply({ embeds: [embed] }); */
      } else {
        interaction.editReply({
          content: `❌ | Subcommand does not exist!`,
        });
      }
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content:
          'There was an error trying to execute that command: ' + error.message,
      });
    }
  },
};
