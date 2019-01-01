var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var {generateRandomString} = require('./routes/helpers');

const session = require('express-session');
const passport = require('passport');

var index = require('./routes/index');

var app = express();

// app.use(express.static(path.join(__dirname, 'client/build'))).use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Middle Ware
app.use(
  session({
    secret: "\x02\xf3\xf7r\t\x9f\xee\xbbu\xb1\xe1\x90\xfe'\xab\xa6L6\xdd\x8d[\xccO\xfe",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

app.get("/spotify-login", 
  passport.authenticate("spotify", {
    scope: [
      'user-read-private', 
      'user-read-email', 
      'user-library-read', 
      'user-top-read', 
      'user-follow-read', 
      'playlist-modify-private', 
      'playlist-modify-public', 
      'playlist-read-collaborative'
    ],
    showDialog: true,
    'state': generateRandomString(16)
  }), 
  function(req, res){}
);

app.get('/callback', passport.authenticate("spotify", {
  failureRedirect: 'https://spotify-swap.herokuapp.com/login'}), 
  (req, res, body) => {

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
  }
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
