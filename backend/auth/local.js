const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/index");
const init = require("./passport");
const authHelpers = require("./helpers");
const debug = require("debug")("auth:local");

const options = {};

init();

passport.use(
    // getting username and password from req.body
    new LocalStrategy(options, (username, password, done) => {
        debug("trying to authenticate");
        console.log('reached passport')
        db
        .any("SELECT * FROM users WHERE username=${username}", {username})
        .then(rows => {
            const user = rows[0];
            console.log(rows[0])
            debug("user:", user);
            if(!user) {
              console.log('user doesn\'t exist')
              return done(null, false);
            }
            if(!authHelpers.comparePass(password, user.password_digest)) {
              console.log('passes don\'t match')
              return done(null, false);
            } else {
              console.log('match')
              return done(null, user);
            }
        })
        .catch(err => {
            console.log('catch')
            debug("error:", err);
            return done(err)
        })
    })
);


module.exports = passport;
