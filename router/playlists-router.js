const router = require('express').Router();

const { NotFound } = require('../errors/app-errors.js');
const db = require('../schema/playlist.js');

router.get('/', async (req, res) => {
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

router.get('/:guildid', async (req, res) => {
  const data = await db.find({
    GuildId: req.params.guildid,
  });

  if (data.length == 0) {
    throw new NotFound('no playlists found');
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

  res.status(200).json(playlists);
});

module.exports = router;
