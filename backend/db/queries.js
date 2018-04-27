const db = require("./index");
const authHelpers = require("../auth/helpers");
const passport = require("../auth/local");

function registerUser(req, res) {
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
      console.log(err);
      res.status(500)
        .json({
          message: `Something went wrong: ${err}`
        })
    })
}

function getUser(req, res) {
  db
    .one("SELECT * FROM users WHERE username=${username}", {username: req.user.username})
    .then(data => {
      res
        .status(200)
        .json({user: data});
    })
};

function logoutUser(req, res) {
  req.logout();
  res.status(200).send("log out success");
};

function getAllUsers(req, res) {
  db
    .any("SELECT * FROM users")
    .then(data => {
      res
        .status(200)
        .json({user: data});
    })
};

module.exports = {
  registerUser,
  getUser,
  logoutUser,
  getAllUsers
}
