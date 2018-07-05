var pgp = require("pg-promise")({});
var connectionString = "postgres://localhost/swap"
var db = pgp(connectionString)

module.exports = db;
