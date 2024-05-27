var mysql = require("mysql");

const username = "";
const password = "";
const database = "";
const host = "localhost";
const socketPath = "/var/run/mysqld/mysqld.sock"; // for linux users

const admin = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  id_number: "",
};

const con = mysql.createConnection({
  host: host,
  // socketPath: socketPath, // uncomment this for linux systems
  user: username,
  password: password,
  database: database,
});

module.exports = {
  connection: con,
  admin: admin,
};
