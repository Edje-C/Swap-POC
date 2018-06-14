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
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
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
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
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
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
};

const getPlaylistsByUsername = (req, res) => {
  db
    .any("SELECT DISTINCT playlists.id, NULL AS status, name, creator_id, spotify_id, date_created, uri, complete FROM collaborations JOIN playlists ON playlists.id = playlist_id JOIN users ON creator_id = users.id WHERE creator_id = (SELECT id FROM users WHERE username = ${username}) UNION SELECT DISTINCT playlists.id, status, name, creator_id, spotify_id, date_created, uri, complete FROM collaborations JOIN playlists ON playlists.id = playlist_id JOIN users ON creator_id = users.id  WHERE user_id = (SELECT id FROM users WHERE username = ${username}) AND status <> 'd' ORDER BY date_created DESC", {username: req.params.username})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
};

const getPlaylistByID = (req, res) => {
  db
  .one("SELECT id, creator_id, name, length, date_created, complete, COUNT (status) AS collaborators FROM playlists JOIN collaborations ON playlists.id = playlist_id WHERE id = ${playlistID} GROUP BY id, creator_id, name, length, date_created, complete", {playlistID: req.params.playlistID})
  .then(data => {
    res
    .status(200)
    .json(data)
  })
  .catch(err => {
    res
    .status(500)
    .json({status: 'Failed'})
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
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
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
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
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
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
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
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
};

const getOtherFollowing = (req, res) => {
  db
    .any("SELECT users.username, COALESCE(this_user.follower_id, 0) AS this_following FROM friends AS other_user JOIN users ON following_id = id FULL JOIN (SELECT * FROM friends JOIN users ON following_id = id WHERE follower_id = ${thisUserID}) AS this_user ON other_user.following_id = this_user.following_id WHERE other_user.follower_id = (SELECT id FROM users WHERE username=${otherUsername})", {thisUserID: req.params.thisUserID, otherUsername: req.params.otherUsername})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
};

const getFollow = (req, res) => {
  db
    .any("SELECT * FROM friends WHERE follower_id = ${followerID} AND following_id = (SELECT id FROM users WHERE username = ${followingUsername})", {followerID: req.params.followerID, followingUsername: req.params.followingUsername})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
};

const createPlaylist = (req, res) => {
  db
    .one("INSERT INTO playlists (creator_id, name, length, date_created) VALUES ((SELECT id FROM users WHERE username = ${username}), ${name}, ${length}, to_timestamp(${date}, 'DD/MM/YYYY HH24:MI:SS')) RETURNING id", {username: req.body.username, name: req.body.name, length: req.body.length, date: req.body.date})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const addCollaborators = (req, res) => {
  db
    .none("INSERT INTO collaborations (playlist_id, user_id) VALUES" + req.body.userIDs.map(v => `(${req.body.playlistID}, ${v})`).join(','))
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const saveTracks = (req, res) => {
  db
    .none("INSERT INTO tracks (playlist_id, track_uri, name, duration, artists, album) VALUES" + req.body.tracks.map(v => `(${req.body.playlistID}, '${v.trackURI}', '${v.name}', '${v.duration}', '${v.artists}', '${v.album}')`).join(','))
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const acceptCollaboration = (req, res) => {
  console.log('!!!!', req.body)
  db
    .none("UPDATE collaborations SET status = 'a' WHERE playlist_id = ${playlistID} AND user_id = (SELECT id from users WHERE username = ${username})", {playlistID: req.body.playlistID, username: req.body.username})
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const declineCollaboration = (req, res) => {
  db
    .none("UPDATE collaborations SET status = 'd' WHERE playlist_id = ${playlistID} AND user_id = (SELECT id from users WHERE username = ${username})", {playlistID: req.body.playlistID, username: req.body.username})
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const getPlaylistStatus = (req, res) => {
  db
    .any("SELECT status FROM collaborations WHERE playlist_id = ${playlistID} GROUP BY status", {playlistID: req.params.playlistID})
    .then(data => {
      res
        .status(200)
        .json(data)
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })

}

const setAsComplete = (req, res) => {
  db
    .none("UPDATE playlists SET complete = true WHERE id = ${playlistID}", {playlistID: req.body.playlistID})
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const savePlaylistURI = (req, res) => {
  db
    .none("UPDATE playlists SET uri = ${uri} WHERE id = ${playlistID}", {playlistID: req.body.playlistID, uri: req.body.playlistURI})
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const saveSpotifyID = (req, res) => {
  db
    .none("UPDATE users SET spotify_id = ${spotifyID} WHERE id = ${userID}", {userID: req.body.userID, spotifyID: req.body.spotifyID})
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const followUser = (req, res) => {
  db
    .none("INSERT INTO friends (follower_id, following_id) VALUES(${followerID}, (SELECT id FROM users WHERE username = ${followingUsername}))", {followerID: req.body.followerID, followingUsername: req.body.followingUsername})
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(err => {
      res
        .status(500)
        .json({status: 'Failed'})
    })
}

const unfollowUser = (req, res) => {
  db
    .none("DELETE FROM friends WHERE follower_id = ${followerID} AND following_id = (SELECT id FROM users WHERE username = ${followingUsername})", {followerID: req.body.followerID, followingUsername: req.body.followingUsername})
    .then(data => {
      res
        .status(200)
        .json({status: 'Success'})
    })
    .catch(err => {
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
  getPlaylistsByUsername,
  getPlaylistByID,
  getTracksForPlaylist,
  getCollaboratorsForPlaylist,
  getFollowers,
  getFollowing,
  getOtherFollowing,
  getFollow,
  createPlaylist,
  addCollaborators,
  saveTracks,
  acceptCollaboration,
  declineCollaboration,
  getPlaylistStatus,
  setAsComplete,
  savePlaylistURI,
  saveSpotifyID,
  followUser,
  unfollowUser
}
