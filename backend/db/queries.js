const db = require("./index");
const authHelpers = require("../auth/helpers");
const passport = require("../auth/local");

exports.register = (req, res) => {
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

exports.getThisUser = (req, res) => {
  db
    .one("SELECT id, username, spotify_id, email FROM users WHERE username=${username}", {username: req.user.username})
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

exports.logout = (req, res) => {
  req.logout();
  res.status(200).send("log out success");
};

exports.getAllUsers = (req, res) => {
  db
    .any("SELECT id, username, spotify_id, email FROM users")
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

exports.getUser = (req, res) => {
  db
    .one("SELECT id, username, spotify_id, email FROM users WHERE username=${username}", {username: req.params.username})
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

exports.getPlaylistsByUsername = (req, res) => {
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

exports.getPlaylistByID = (req, res) => {
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

exports.getTracksForPlaylist = (req, res) => {
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

exports.getCollaboratorsForPlaylist = (req, res) => {
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

exports.getFollowers = (req, res) => {
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

exports.getFollowing = (req, res) => {
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

exports.getOtherFollowing = (req, res) => {
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

exports.getFollow = (req, res) => {
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

exports.createPlaylist = (req, res) => {
  db
    .one("INSERT INTO playlists (creator_id, name, length, date_created) VALUES ((SELECT id FROM users WHERE username = ${username}), ${name}, ${length}, to_timestamp(${date}, 'DD/MM/YYYY HH24:MI:SS')) RETURNING id", {username: req.body.username, name: req.body.name, length: req.body.length, date: req.body.date})
    .then(data => {
      db
        .tx(t => {
          let addCollaborators = t.none("INSERT INTO collaborations (playlist_id, user_id) VALUES" + req.body.userIDs.map(v => `(${data.id}, ${v})`).join(','))
          let saveTracks = t.none("INSERT INTO tracks (playlist_id, track_uri, name, duration, artists, album) VALUES" + req.body.tracks.map(v => `(${data.id}, '${v.trackURI}', '${v.name}', '${v.duration}', '${v.artists}', '${v.album}')`).join(','))

          return t.batch([addCollaborators, saveTracks]);
        })
        .then(data => {
          res
            .status(200)
            .json({status: 'Success'})
        })
        .catch(err => {
          console.log('fdshfjlk', data.id)
          db
            .none("DELETE FROM playlists WHERE id = ${playlistID}", {playlistID: data.id})
            .then(data => {
              res
                .status(500)
                .json({status: 'Failed'})
            })
            .catch(err => {
              console.log('error')
              res
                .status(500)
                .json({status: 'Failed'})
            })
        });

    });
}

exports.addCollaborators = (req, res) => {
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

exports.saveTracks = (req, res) => {
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

exports.acceptCollaboration = (req, res) => {
  db
    .tx(t => {
      let acceptCollab = t.none("UPDATE collaborations SET status = 'a' WHERE playlist_id = ${playlistID} AND user_id = (SELECT id from users WHERE username = ${username})", {playlistID: req.body.playlistID, username: req.body.username})
      let saveTracks = t.none("INSERT INTO tracks (playlist_id, track_uri, name, duration, artists, album) VALUES" + req.body.tracks.map(v => `(${req.body.playlistID}, '${v.trackURI}', '${v.name}', '${v.duration}', '${v.artists}', '${v.album}')`).join(','))

      return t.batch([acceptCollab, saveTracks]);
    })
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

exports.declineCollaboration = (req, res) => {
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

exports.getPlaylistStatus = (req, res) => {
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

exports.setAsComplete = (req, res) => {
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

exports.savePlaylistURI = (req, res) => {
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

exports.saveSpotifyID = (req, res) => {
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

exports.followUser = (req, res) => {
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

exports.unfollowUser = (req, res) => {
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

exports.unfollowMany = (req, res) => {
  db
    .none("DELETE FROM friends WHERE follower_id = ${followerID} AND following_id = ANY (array ${followingIDs:raw})", {followerID: req.body.followerID, followingIDs: JSON.stringify(req.body.followingIDs)})
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
