const passport = require("passport");
const SpotifyStrategy = require('passport-spotify').Strategy;
const db = require("../db/index");
const init = require("./passport");
const debug = require("debug")("auth:local");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

let { client_id, client_secret } = process.env

init();

passport.use(
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: 'https://spotify-swap.herokuapp.com/callback/'
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      let {display_name, id, email} = profile._json;
      data = {
        accessToken,
        refreshToken
      }
      db
        .one("SELECT * FROM users WHERE email=${email}", {email})
        .then(user => {
          debug("user:", user);
          data.user = user
          return done(null, data);
        })
        .catch(err => {
          db
            .one("INSERT INTO users (username, spotify_id, email) VALUES (${display_name}, ${id}, ${email}) RETURNING *", {display_name, id, email})
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