const mysql = require("mysql");
const credentials = require("../database/credentials");

// Create a MySQL connection
const con = credentials.connection;

const User = {
  getAll: (callback) => {
    con.query("SELECT * FROM users", (err, rows) => {
      if (err) {
        console.error("Error fetching users: ", err);
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  },

  getUserCount: (callback) => {
    con.query("SELECT COUNT(*) as userCount FROM users", (err, row) => {
      if (err) {
        console.error("Error fetching users: ", err);
        callback(err, null);
        return;
      }
      callback(null, row[0].userCount);
    });
  },

  getUserById: (userIdNumber, callback) => {
    con.query(
      "SELECT * FROM users WHERE id_number  = ?",
      [userIdNumber],
      (err, rows) => {
        if (err) {
          console.error("Error fetching user by ID: ", err);
          callback(err, null);
          return;
        }
        callback(null, rows[0]);
      }
    );
  },
  // create, update, delete
};

module.exports = User;
