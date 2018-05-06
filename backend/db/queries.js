const db = require("./index");
const authHelpers = require("../auth/helpers");
const passport = require("../auth/local");

function register(req, res) {
  const hash = authHelpers.createHash(req.body.password);
  db
    .one("INSERT INTO users (username, password_digest, email) VALUES (${username}, ${password}, ${email}) RETURNING username",
    {
      username: req.body.username,
      password: hash,
      email: req.body.email
    })
    .then((data) => {
      res
        .status(200)
        .json({data: data});
    })
    .catch(err => {
      res.status(500)
        .json({
          message: `Something went wrong: ${err}`
        })
    })
}

function getThisUser(req, res) {
  db
    .one("SELECT * FROM users WHERE username=${username}", {username: req.user.username})
    .then(data => {
      res
        .status(200)
        .json({user: data});
    })
};

function logout(req, res) {
  req.logout();
  res.status(200).send("log out success");
};

function getAllUsers(req, res) {
  db
    .any("SELECT * FROM users")
    .then(data => {
      res
        .status(200)
        .json({user: data});
    })
};

function getUser(req, res) {
  db
    .one("SELECT * FROM users WHERE username=${username}", {username: req.params.username})
    .then(data => {
      res
        .status(200)
        .json({user: data});
    })
};

function getPlaylistByUsername(req, res) {
  db
    .any("SELECT DISTINCT playlists.id, creator_id, name, date_created, collaborations.status AS accepted_status FROM playlists FULL JOIN collaborations ON playlist_id = playlists.id WHERE creator_id = (SELECT id FROM users WHERE username = ${username}) OR user_id = (SELECT id FROM users WHERE username = ${username}) ORDER BY date_created DESC", {username: req.params.username})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

function getTracksForPlaylist(req, res) {
  db
    .any("SELECT * FROM tracks WHERE playlist_id = ${playlistID}", {playlistID: req.params.playlistID})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

function getCollaboratorsForPlaylist(req, res) {
  db
    .any("SELECT * FROM collaborations WHERE playlist_id = ${playlistID}", {playlistID: req.params.playlistID})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

function getFollowers(req, res) {
  db
    .any("SELECT username FROM friends JOIN users ON follower_id = users.id WHERE following_id = (SELECT id FROM users WHERE username = ${username}) ORDER BY username", {username: req.params.username})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

function getFollowing(req, res) {
  db
    .any("SELECT username FROM friends JOIN users ON following_id = users.id WHERE follower_id = (SELECT id FROM users WHERE username = ${username}) ORDER BY username", {username: req.params.username})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

module.exports = {
  register,
  getThisUser,
  logout,
  getAllUsers,
  getUser,
  getPlaylistByUsername,
  getTracksForPlaylist,
  getCollaboratorsForPlaylist,
  getFollowers,
  getFollowing
}
