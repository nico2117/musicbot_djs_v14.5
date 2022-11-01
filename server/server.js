module.exports = {
  start: () => {
    const express = require('express');
    const db = require('../schema/playlist.js');

    const PORT = 8080;
    const HOSTNAME = '0.0.0.0';
    const app = express();

    app.use(express.json());
    app.use(express.static('public'));

    app.get('/helloExpress', (req, res) => {
      res.status(200).send('Hello World by Express');
    });

    app.get('/api/playlists', async (req, res) => {
      const data = await db.find();
      if (data.length == 0) {
        return res.status(404).json([]);
      }

      let playlists = data.map((playlist) => {
        let playlistObject = {};

        playlistObject.name = playlist.PlaylistName;
        playlistObject.guild = playlist.GuildId;
        playlistObject.createdon = playlist.CreatedOn;
        if (!playlist.Playlist.length) {
          playlistObject.Playlist = 'No tracks in this playlist!';
        } else {
          playlistObject.tracks = [];
          for (let key in playlist.Playlist) {
            playlistObject.tracks.push(playlist.Playlist[key].title);
          }
        }
        return playlistObject;
      });

      res.status(200).json(playlists);
    });

    app.get('/api/playlists/:guildid', async (req, res) => {
      const data = await db.find({
        GuildId: req.params.guildid,
      });

      if (data.length == 0) {
        return res.status(404).send('no playlists found');
      }

      let playlists = data.map((playlist) => {
        let str = '';
        let playlistObject = {};

        playlistObject.name = playlist.PlaylistName;
        playlistObject.guild = playlist.GuildId;
        playlistObject.createdon = playlist.CreatedOn;
        if (!playlist.Playlist.length) {
          playlistObject.Playlist = 'No tracks in this playlist!';
        } else {
          playlistObject.tracks = [];
          for (let key in playlist.Playlist) {
            playlistObject.tracks.push(playlist.Playlist[key].title);
          }
        }
        return playlistObject;
      });

      res
        .status(200)
        .contentType('application/json')
        .send(JSON.stringify(playlists));
    });

    console.log('Starting webserver...');

    app.listen(PORT, HOSTNAME, () => {
      console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
    });
  },
};
