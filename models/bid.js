const mysql = require("mysql");
const credentials = require("../database/credentials");

// Create a MySQL connection
const con = credentials.connection;

// Define the Bid model functions
const Bid = {
  getAll: (callback) => {
    con.query("SELECT * FROM bids", (err, rows) => {
      if (err) {
        console.error("Error fetching bids: ", err);
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  },

  getById: (bidID, callback) => {
    con.query("SELECT * FROM bids WHERE id = ?", [bidID], (err, rows) => {
      if (err) {
        console.error("Error fetching bid by ID: ", err);
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  },

  updateForUser: (bidID, bidderID, amount, callback) => {
    con.query(
      "UPDATE bids SET user_id = ?, highest_bid = ? WHERE id = ?",
      [bidderID, amount, bidID],
      (err, result) => {
        if (err) {
          console.error("Error updating bid: ", err);
          callback(err, null);
          return;
        }
        callback(null, result);
      }
    );
  },

  getByProductId: (productId, callback) => {
    con.query(
      "SELECT * FROM bids WHERE product_id = ?",
      [productId],
      (err, rows) => {
        if (err) {
          console.error("Error fetching bid by product ID: ", err);
          callback(err, null);
          return;
        }
        callback(null, rows);
      }
    );
  },

  create: (bid, callback) => {
    con.query("INSERT INTO bids SET ?", bid, (err, result) => {
      if (err) {
        console.error("Error creating bid: ", err);
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  },

  update: (bidID, callback) => {
    con.query(
      "UPDATE bids SET ? WHERE id = ?",
      [bid, bid.id],
      (err, result) => {
        if (err) {
          console.error("Error updating bid: ", err);
          callback(err, null);
          return;
        }
        callback(null, result);
      }
    );
  },

  delete: (bidId, callback) => {
    con.query("DELETE FROM bids WHERE id = ?", bidId, (err, result) => {
      if (err) {
        console.error("Error deleting bid: ", err);
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  },
};

module.exports = Bid;
