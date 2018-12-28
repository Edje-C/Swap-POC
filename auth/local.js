const passport = require("passport");
const SpotifyStrategy = require('passport-spotify').Strategy
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/index");
const init = require("./passport");
const authHelpers = require("./helpers");
const debug = require("debug")("auth:local");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

let { client_id, client_secret } = process.env

const options = {};

init();

passport.use(
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: 'http://localhost:3100/callback/'
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      let {display_name, email} = profile._json;
      data = {
        accessToken,
        refreshToken
      }
      db
        .one("SELECT * FROM users WHERE username=${display_name}", {display_name})
        .then(user => {
          debug("user:", user);
          data.user = user
          return done(null, data);
        })
        .catch(err => {
          db
            .one("INSERT INTO users (username, email) VALUES (${display_name}, ${email}) RETURNING *", {display_name, email})
            .then(user => {
              data.user = user
              return done(null, data);
            })
          debug("error:", err);
        })
    }
  )
);


module.exports = passport;
