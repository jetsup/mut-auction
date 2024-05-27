const mysql = require("mysql");
const credentials = require("../database/credentials");

// Create a MySQL connection
const con = credentials.connection;

// Define the Product model functions
const Product = {
  getAll: (callback) => {
    con.query("SELECT * FROM products", (err, rows) => {
      if (err) {
        console.error("Error fetching products: ", err);
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  },

  getLatestProduct: (callback) => {
    // get the product with some of the foreign keys resolved
    con.query(
      "SELECT pr.*, c.id AS category_id, c.category_name FROM products pr\
        JOIN product_categories pc ON pr.product_category_id = pc.id\
        JOIN categories c on c.id = pc.id\
        ORDER BY pr.created_at DESC LIMIT 4",
      (err, rows) => {
        if (err) {
          console.error("Error fetching ordered products: ", err);
          callback(err, null);
          return;
        }
        callback(null, rows);
      }
    );
  },

  getById: (productId, callback) => {
    // get the product with some of the foreign keys resolved
    con.query(
      "SELECT pr.*, c.id AS category_id, c.category_name FROM products pr\
        JOIN product_categories pc ON pr.product_category_id = pc.id\
        JOIN categories c on c.id = pc.id where pr.id  = ?",
      [productId],
      (err, rows) => {
        if (err) {
          console.error("Error fetching product by ID: ", err);
          callback(err, null);
          return;
        }
        callback(null, rows[0]);
      }
    );
  },

  getByCategory: (categoryId, callback) => {
    con.query(
      "SELECT * FROM products pr WHERE pr.product_category_id = ?",
      [categoryId],
      (err, rows) => {
        if (err) {
          console.error("Error fetching products by category: ", err);
          callback(err, null);
          return;
        }
        callback(null, rows);
      }
    );
  },

  getUserPreferences: (callback) => {
    // get the product in preference category with some of the foreign keys resolved
    // get user preferences
    con.query("SELECT preference FROM user_preferences", (err, results) => {
      if (err) {
        console.error("Error fetching user preferences: ", err);
        callback(err, null);
        return;
      }
      if (results.length == 0) {
        // no preference should display all items category randomly
        con.query("SELECT id FROM product_categories", (err, result) => {
          if (err) {
            console.error("Error fetching user preferences: ", err);
            callback(err, null);
            return;
          }
          let allProductCategories = [];
          result.forEach((res) => {
            allProductCategories.push(res.id);
          });
          con.query(
            "SELECT pr.*, c.id AS category_id, c.category_name FROM products pr\
              JOIN product_categories pc ON pr.product_category_id = pc.id\
              LEFT JOIN categories c on c.id = pc.id\
              WHERE product_category_id IN (?)\
              ORDER BY pr.created_at DESC LIMIT 4",
            [allProductCategories],
            (err, rows) => {
              if (err) {
                console.error("Error fetching ordered products: ", err);
                callback(err, null);
                return;
              }
              callback(null, rows);
            }
          );
        });
      } else {
        con.query(
          "SELECT pr.*, c.id AS category_id, c.category_name FROM products pr\
          JOIN product_categories pc ON pr.product_category_id = pc.id\
          LEFT JOIN categories c on c.id = pc.id\
          WHERE product_category_id IN (?)\
          ORDER BY pr.created_at DESC LIMIT 4",
          [results],
          (err, rows) => {
            if (err) {
              console.error("Error fetching ordered products: ", err);
              callback(err, null);
              return;
            }
            callback(null, rows);
          }
        );
      }
    });
  },
  // create, update, delete
};

module.exports = Product;
