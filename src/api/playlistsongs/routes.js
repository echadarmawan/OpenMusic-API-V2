const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlist/{id}/songs',
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlist/{id}/songs',
    handler: handler.getPlaylistSongsHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlist/{id}/songs',
    handler: handler.deletePlaylistSongHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;