var pgp = require("pg-promise")({});
var dotenv = require('dotenv').load();
var connectionString = process.env.DATABASE_URL;
var db = pgp(connectionString)

module.exports = db;
