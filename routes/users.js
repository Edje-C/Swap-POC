var express = require('express');
var request = require('request');
var router = express.Router();
var querystring = require('querystring');

const {loginRequired} = require("../auth/helpers");
const passport = require("../auth/local");
const db = require("../db/queries");

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({
    user: req.user.username,
    message: `${req.user.username} is logged in`
  });
  return;
});

router.post("/register", db.register)
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
router.patch("/saveURI", db.savePlaylistURI)
router.patch("/saveSpotifyID", db.saveSpotifyID)





// ~ * Spotify * ~ //

// console.log(process.env.DATABASE_URL);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

let {client_id, client_secret} = process.env

var redirect_uri = 'http://localhost:3100/users/callback';

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

var stateKey = 'spotify_auth_state';


///////////////////////////////////////////////////////////////////////


/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/spotifyLogin', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  var scope = 'user-read-private user-read-email user-library-read user-top-read user-follow-read playlist-modify-private playlist-modify-public playlist-read-collaborative';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/access/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


module.exports = router;
