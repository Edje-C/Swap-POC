const db = require("./index");
const authHelpers = require("../auth/helpers");
const passport = require("../auth/local");

const register = (req, res) => {
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

const getThisUser = (req, res) => {
  db
    .one("SELECT * FROM users WHERE username=${username}", {username: req.user.username})
    .then(data => {
      res
        .status(200)
        .json({user: data});
    })
};

const logout = (req, res) => {
  req.logout();
  res.status(200).send("log out success");
};

const getAllUsers = (req, res) => {
  db
    .any("SELECT * FROM users")
    .then(data => {
      res
        .status(200)
        .json({user: data});
    })
};

const getUser = (req, res) => {
  db
    .one("SELECT * FROM users WHERE username=${username}", {username: req.params.username})
    .then(data => {
      res
        .status(200)
        .json({user: data});
    })
};

const getPlaylistByUsername = (req, res) => {
  db
    .any("SELECT DISTINCT playlists.id, creator_id, name, date_created, collaborations.status AS accepted_status FROM playlists FULL JOIN collaborations ON playlist_id = playlists.id WHERE creator_id = (SELECT id FROM users WHERE username = ${username}) OR user_id = (SELECT id FROM users WHERE username = ${username}) ORDER BY date_created DESC", {username: req.params.username})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

const getTracksForPlaylist = (req, res) => {
  db
    .any("SELECT * FROM tracks WHERE playlist_id = ${playlistID}", {playlistID: req.params.playlistID})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

const getCollaboratorsForPlaylist = (req, res) => {
  db
    .any("SELECT * FROM collaborations WHERE playlist_id = ${playlistID}", {playlistID: req.params.playlistID})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

const getFollowers = (req, res) => {
  db
    .any("SELECT id, username FROM friends JOIN users ON follower_id = users.id WHERE following_id = (SELECT id FROM users WHERE username = ${username}) ORDER BY username", {username: req.params.username})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

const getFollowing = (req, res) => {
  db
    .any("SELECT id, username FROM friends JOIN users ON following_id = users.id WHERE follower_id = (SELECT id FROM users WHERE username = ${username}) ORDER BY username", {username: req.params.username})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
};

const createPlaylist = (req, res) => {
  db
    .one("INSERT INTO playlists (creator_id, name, length, date_created) VALUES ((SELECT id FROM users WHERE username = ${username}), ${name}, ${length}, to_date(${date}, 'DD/MM/YYYY')) RETURNING id", {username: req.body.username, name: req.body.name, length: req.body.length, date: req.body.date})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
    .catch(data => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const addCollaborators = (req, res) => {
  console.log('ADdIGN', req.body, req.body.userIDs)
  db
    .none("INSERT INTO collaborations (playlist_id, user_id, status) VALUES" + req.body.userIDs.map(v => `(${req.body.playlistID}, ${v}, 'p')`).join(','))
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(data => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const saveTracks = (req, res) => {
  console.log('ADdIGN', req.body, req.body.userIDs)
  db
    .none("INSERT INTO collaborations (playlist_id, user_id, status) VALUES" + req.body.userIDs.map(v => `(${req.body.playlistID}, ${v}, 'p')`).join(','))
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(data => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}


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
  getFollowing,
  createPlaylist,
  addCollaborators,
  saveTracks
}
