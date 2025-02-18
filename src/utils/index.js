const mapSongDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  username,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  username,
});

module.exports = { mapSongDBToModel };