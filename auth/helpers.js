const db = require("../db/index");

function loginRequired(req, res, next) {
  if(!req.user) {
    res.status(401)
    .json({
      status: "Please log in."
    });
    return;
  }
  next();
}

module.exports = {
    loginRequired
};
