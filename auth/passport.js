const passport = require("passport");
const db = require("../db/index");
const debug = require("debug")("auth:passport");

module.exports = () => {
	passport.serializeUser((data, done) => {
		done(null, data);
	})
}

passport.deserializeUser((data, done) => {
  debug("deserializeUser")
  db
    .one("SELECT * FROM users WHERE username=$1", [data.user.username])
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});