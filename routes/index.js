var express = require("express");
var bcrypt = require("bcrypt");
const session = require("express-session");
const paginate = require("express-paginate");
const moment = require("moment");

var prjConfig = require("../config.js");
var seeder = require("../database/seeder.js");
var defaults = require("../database/defaults.js");
// const bodyParser = require('body-parser');
var router = express.Router();

const credentials = require("../database/credentials.js");

// models
const Product = require("../models/product");
let con = credentials.connection;

if (prjConfig.seedDummy) {
  console.log("Creating defaults and seeding...");
  defaults
    .dbDefaults()
    .then(() => {
      console.log("Seeding products...");

      seeder.seedUsers();
      seeder.seedProducts();
    })
    .catch((err) => {
      console.error("Error setting up database defaults:", err);
    })
    .finally(() => {
      console.log("ALL OPERATIONS DONE!");
    });
} else {
  console.log("Just creating defaults...");
  defaults.dbDefaults().finally(() => {
    console.log("ALL OPERATIONS DONE!");
  });
}

// Middleware to parse URL-encoded request bodies
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(
  session({
    secret: "uedjiduwhUdeyygTFvytv", // a random text
    user: null,
    resave: false,
    saveUninitialized: /*true*/ false,
    cookie: { maxAge: 9000000 },
  })
);

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const sortedProducts = () => {
      return new Promise((resolve, reject) => {
        Product.getLatestProduct((err, products) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(products);
        });
      });
    };

    const suggested = () => {
      return new Promise((resolve, reject) => {
        Product.getUserPreferences((err, products) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(products);
        });
      });
    };
    console.log(req.session);
    const products = await sortedProducts();
    const suggestedProducts = await suggested();
    res.render("index", { title: "Home", products, suggestedProducts });
    if (req.session.user.user_type_id == 1) {
      res.render("admin/dashboard");
    } else if (req.session.user.user_type_id == 2) {
      const products = await sortedProducts();
      const suggestedProducts = await suggested();
      res.render("index", { title: "Home", products, suggestedProducts });
    } else if (req.session.user.user_type_id == 3) {
      const products = await sortedProducts();
      const suggestedProducts = await suggested();
      res.render("index", { title: "Home", products, suggestedProducts });
    }
  } catch (err) {
    console.log("ERROR: ", err);
  }
});

router.get("/test", function (req, res, next) {
  res.render("admin/dashboard");
});

router.get("/product-approval", function (req, res, next) {
  res.render("seller1/product-approval");
});

router.get("/products/product/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Fetch the product from the database based on the productId
    const getProduct = () => {
      return new Promise((resolve, reject) => {
        Product.getById(productId, (err, product) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(product);
        });
      });
    };

    const product = await getProduct();

    // Render the product details page
    res.render("product-details", { title: "Product Details", product });
  } catch (err) {
    // Handle errors
    console.log("PRODUCTS/PRODUCT: ", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/products/make-your-offer", function (req, res, next) {
  const postRequest = req.body;
  const offer = postRequest.myOffer;
  const productID = postRequest.productID;

  con.query(
    "SELECT highest_bid FROM bids WHERE product_id = ?",
    productID,
    (err, row) => {
      if (err) {
        console.log("ERR:", err.message);
        return;
      }

      console.log(row[0].highest_bid);
      if (row.length == 0) {
        con.query(
          "INSERT INTO bids(product_id, user_id, highest_bid) VALUES (?, ?, ?)",
          [productID, 1, offer],
          (err, r) => {
            if (err) {
              console.log("INSERT BID ERR:", err);
              return;
            }
            console.log("BID INSERTED:", r);
          }
        );
      } else {
        let presentBid = row[0].highest_bid;
        if (presentBid < offer) {
          // add the user to the products interested list and update the user_id and highest bid in bids table
        } else {
          // add the user to the product's interested list
          con.query("SELECT ");
        }
      }
    }
  );
});

router.use("/products", async (req, res, next) => {
  try {
    // Fetch the product from the database based on the productId
    const getProducts = () => {
      return new Promise((resolve, reject) => {
        Product.getAll((err, products) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(products);
        });
      });
    };

    const products = await getProducts();
    const productsPerPage = prjConfig.productsPerPage;
    const pageCount = Math.ceil(products.length / productsPerPage);
    const currentPage = parseInt(req.query.page) || 1;
    const pagination = paginate.getArrayPages(req)(3, pageCount, currentPage);

    // Render the product details page
    console.log("LOGGED AS: ", req.session.user);
    res.render("products", {
      title: "Products",
      products: products.slice(
        currentPage * productsPerPage - productsPerPage,
        currentPage * productsPerPage
      ),
      pagination,
      pageCount,
      currentPage,
    });
  } catch (err) {
    // Handle errors
    console.log("PRODUCTS/PRODUCT: ", err);
    res.status(500).send("Internal Server Error");
  }
});

router.use("/cart", function (req, res, next) {
  res.render("authenticated/cart", { title: "Cart" });
});

router.use("/about", function (req, res, next) {
  res.render("about-us", { title: "About Us" });
});

router.use("/contacts", function (req, res, next) {
  res.render("contacts", { title: "Contact Us" });
});

// Bids and Biddings
// EndBids

// Authentication
router.get("/auth", function (req, res, next) {
  res.render("auth", { title: "Auth" });
});

router.post("/signup", function (req, res, next) {
  // Validate incoming data (e.g., email format, password strength) before proceeding

  // check if the user with that email already exists
  // con.connect(function (err) {
  //   if (err) {
  //     console.error("Error connecting to MySQL server:", err);
  //     return;
  //   }
  //   console.log("Connected to MySQL server");
  let username = req.body.username;
  let email = req.body.email;
  con.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    function (err, result) {
      if (err) {
        console.log("FIND ERROR: ", err);
        res.status(500).send("Internal server error");
      } else {
        if (result.length > 0) {
          res.status(400).send("User with that email already exists");
        } else {
          // hash the password
          bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) {
              console.log("HASHING ERROR: ", err);
              res.status(500).send("Internal server error");
            } else {
              let firstName = req.body.first_name;
              let lastName = req.body.last_name;
              let idNumber = req.body.id_number;
              // let username = req.body.username;
              // let email = req.body.email;
              con.query(
                "INSERT INTO users (first_name, last_name, id_number, username, email, password) VALUES (?, ?, ?, ?, ?, ?)",
                [firstName, lastName, idNumber, username, email, hash],
                function (err, result) {
                  if (err) {
                    console.log("INSERT REGISTER ERROR: ", hash, err);
                    res.status(500).send("Internal server error");
                  } else {
                    // login user session and redirect to dashboard
                    req.session.user = result;
                    res.redirect("/admin/dashboard");
                  }
                }
              );
            }
          });
        }
      }
    }
  );
});
// });

router.post(
  "/signin",
  function (req, res, next) {
    // check if the user with that email already exists
    // con.connect(function (err) {
    //   if (err) {
    //     console.log("SIGNIN ERR: ", err);
    //   }
    let username = req.body.username;
    let password = req.body.password;
    con.query(
      "SELECT username, password, user_type_id FROM users WHERE username = ?",
      [username],
      function (err, result, fields) {
        if (err) {
          console.log("SELECT ERROR: ", err);
          throw err;
        }
        if (result.length > 0) {
          console.log("USER: ", result);
          let userType = result[0].user_type_id; // make this global
          bcrypt.compare(password, result[0].password, function (err, isMatch) {
            if (err) {
              console.log("HASH COMPARE: ", err);
              throw err;
            }
            if (isMatch) {
              console.log("User found...");
              let user = Object.values(JSON.parse(JSON.stringify(result)))[0];
              req.session.user = user;
              next();
            } else {
              console.log(
                "Incorrect password. Please try again or reset your password."
              );
            }
          });
        } else {
          console.log(
            "User not found. Check your credentials or try to signup to the system."
          );
        }
      }
    );
    // });
  },
  (req, res) => {
    if (req.session.user.user_type_id == 1 /*ADMIN*/) {
      // window.href = "dashboard-admin.html";
      console.log("Admin logged in...", req.session.user.username);
      res.redirect("/");
    } else if (req.session.user.user_type_id == 2) {
      console.log("Customer logged in...");
      res.redirect("/");
    } else if (req.session.user.user_type_id == 3) {
      console.log("Seller logged in...");
      res.redirect("/");
    }
  }
);
// EndAuthentication

//
module.exports = router;
