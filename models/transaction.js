const mysql = require("mysql");
const credentials = require("../database/credentials");

// Create a MySQL connection
const con = credentials.connection;

const Transaction = {
  getAll: (callback) => {
    con.query("SELECT * FROM transactions", (err, rows) => {
      if (err) {
        console.error("Error fetching transactions: ", err);
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  },

  getTransactionCount: (callback) => {
    con.query("SELECT COUNT(*) as transactionCount FROM transactions", (err, row) => {
      if (err) {
        console.error("Error fetching transactions: ", err);
        callback(err, null);
        return;
      }
      callback(null, row[0].transactionCount);
    });
  },

  getTransactionById: (transactionId, callback) => {
    con.query(
      "SELECT * FROM transactions WHERE id  = ?",
      [transactionId],
      (err, rows) => {
        if (err) {
          console.error("Error fetching transaction by ID: ", err);
          callback(err, null);
          return;
        }
        callback(null, rows[0]);
      }
    );
  },
  // create, update, delete
};

module.exports = Transaction;
