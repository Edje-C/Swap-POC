var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

const session = require('express-session');
const passport = require('passport');

var index = require('./routes/index');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build'))).use(cors());

// Middle Ware
app.use(
  session({
  secret: "\x02\xf3\xf7r\t\x9f\xee\xbbu\xb1\xe1\x90\xfe'\xab\xa6L6\xdd\x8d[\xccO\xfe",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);


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


app.get("/spotify-login", passport.authenticate("spotify", {
  scope: ['user-read-private', 'user-read-email', 'user-library-read', 'user-top-read', 'user-follow-read', 'playlist-modify-private', 'playlist-modify-public', 'playlist-read-collaborative'],
  showDialog: true,
  'state': stateKey
}), function(req, res){}
);

app.get('/callback', passport.authenticate("spotify", {failureRedirect: 'https://spotify-swap.herokuapp.com/login'}), (req, res, body) => {
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

app.get('*', (req, res) => {
  res.sendfile(__dirname + '/frontend/build/index.html');
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
