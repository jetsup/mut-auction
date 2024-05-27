var express = require("express");
var mysql = require("mysql");
var router = express.Router();

const credentials = require("../database/credentials.js");

// models
const Product = require("../models/product");
const User = require("../models/user");
const Transaction = require("../models/transaction.js");
let con = credentials.connection;

/* GET home page. */
router.get("/", async (req, res, next) => {
  // check if the user session is still active else redirect to login
  const getUsers = () => {
    return new Promise((resolve, reject) => {
      User.getUserCount((err, users) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(users);
      });
    });
  };

  const getTransactions = () => {
    return new Promise((resolve, reject) => {
      Transaction.getTransactionCount((err, users) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(users);
      });
    });
  };

  const userCount = await getUsers();
  const transactionCount = await getTransactions();

  console.log("COUNT:", userCount, "T_COUNT:", transactionCount);

  res.render("admin/dashboard", {
    title: "Admin",
    users: userCount,
    transactions: transactionCount,
  });
});

router.get("/auction-approval", function (req, res, next) {
  let product = {id:0}
  res.render("admin/approval", { title: "Auction Approval", product:product });
});

router.get("/auction-approval/approve/:productID", function (req, res, next) {
  let productid = req.params.productID;
  let product = {id:0}
  res.render("admin/approval", { title: "Auction Approval" });
});

router.get("/orders", async (req, res, next) => {
    res.render("admin1/orders", {
        title: "Admin",
        // users: userCount,
        // transactions: transactionCount,
      });
});

module.exports = router;
