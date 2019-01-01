var express = require('express');
var request = require('request');
var router = express.Router();
var querystring = require('querystring');

const {loginRequired} = require("../auth/helpers");
const passport = require("../auth/local");
const db = require("../db/queries");

router.get("/logout", loginRequired, db.logout)

router.get("/getThisUser", loginRequired, db.getThisUser)
router.get("/getAllUsers", db.getAllUsers)
router.get("/getUser/:username", db.getUser)
router.get("/getPlaylists/:username", db.getPlaylistsByUsername)
router.get("/getPlaylist/:playlistID", db.getPlaylistByID)
router.get("/getTracks/:playlistID", db.getTracksForPlaylist)
router.get("/getCollaborators/:playlistID", db.getCollaboratorsForPlaylist)
router.get("/getFollowers/:username", db.getFollowers)
router.get("/getFollowing/:username", db.getFollowing)
router.get("/getOtherFollowing/:thisUserID/:otherUsername", db.getOtherFollowing)
router.get("/getFollow/:followerID/:followingUsername", db.getFollow)
router.get("/getPlaylistStatus/:playlistID", db.getPlaylistStatus)

router.post("/createPlaylist", db.createPlaylist)
router.post("/addCollaborators", db.addCollaborators)
router.post("/saveTracks", db.saveTracks)
router.post("/followUser", db.followUser)
router.post("/unfollowUser", db.unfollowUser)
router.post("/unfollowMany", db.unfollowMany)
router.post("/acceptCollaboration", db.acceptCollaboration)

router.patch("/declineCollaboration", db.declineCollaboration)
router.patch("/setAsComplete", db.setAsComplete)



// ~ * Spotify * ~ //

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = generateRandomString(16)


///////////////////////////////////////////////////////////////////////

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get("/spotify-login", passport.authenticate("spotify", {
    scope: ['user-read-private', 'user-read-email', 'user-library-read', 'user-top-read', 'user-follow-read', 'playlist-modify-private', 'playlist-modify-public', 'playlist-read-collaborative'],
    showDialog: true,
    'state': stateKey
  }), function(req, res){}
);

router.get('/callback', passport.authenticate("spotify", {failureRedirect: 'https://spotify-swap.herokuapp.com/login'}), (req, res, body) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var user = req.session.passport.user;

  if (user.access_token || user.refresh_token) {
    res.redirect('https://spotify-swap.herokuapp.com/login');
  }

  var accessToken = user.accessToken
  var refreshToken = user.refreshToken


  res.redirect('https://spotify-swap.herokuapp.com/access/#' +
    querystring.stringify({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  );
});


module.exports = router;