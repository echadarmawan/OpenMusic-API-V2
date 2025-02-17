const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = `playlistsong-${ nanoid(16) }`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongs(playlistId) {
    // memunculkan detail mengenai playlist yang dipilih
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      INNER JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const resultPlaylist = await this._pool.query(queryPlaylist);

    // Memunculkan daftar lagu di dalam detail playlist
    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      INNER JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };
    const resultSongs = await this._pool.query(querySongs);

    if (!resultPlaylist.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return {
      id: resultPlaylist.rows[0].id,
      name: resultPlaylist.rows[0].name,
      username: resultPlaylist.rows[0].username,
      songs: resultSongs.rows
    };;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }
  }

  async verifyPlaylist(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal diverifikasi');
    }
  }
}

module.exports = PlaylistSongsService;