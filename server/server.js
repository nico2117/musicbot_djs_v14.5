const { BadRequest } = require('../errors/app-errors');

module.exports = {
  start: () => {
    const express = require('express');

    const PORT = 8080;
    const HOSTNAME = '0.0.0.0';
    const app = express();
    const { errorHandler } = require('../errors/error-handler');

    app.use(express.json());
    app.use(express.static('public'));
    app.use('/api/playlists', require('../router/playlists-router'));

    app.post('/api/files', (req, res) => {
      console.log(req.body);
      const file = req.body;

      if (!file) {
        throw new BadRequest();
      }
      console.log(file);
      res.status(200).json(file);
    });

    app.use(errorHandler);

    console.log('Starting webserver...');

    app.listen(PORT, HOSTNAME, () => {
      console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
    });
  },
};
