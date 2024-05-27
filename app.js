var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bcrypt = require("bcrypt");
var mysql = require("mysql");
const paginate = require("express-paginate");
const session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");

const projectConfig = require("./config.js");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  session({
    secret: "uedjiduwhUdeyygTFvytv", // a random text
    resave: false,
    saveUninitialized: /*true*/ false,
  })
);

// Pagination
app.use(
  paginate.middleware(
    projectConfig.productsPerPage,
    projectConfig.productsPerPage + 10
  )
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// removed admin and user from route
app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/", adminRouter);

// static files
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist")); // redirect JS jQuery
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css")); // redirect CSS bootstrap
app.use(
  "/js",
  express.static(__dirname + "/node_modules/ionicons/dist/ionicons/")
); // redirect bootstrap JS
app.use("/css", express.static(__dirname + "/node_modules/ionicons/dist/css")); // redirect CSS bootstrap

app.use("/js", express.static(__dirname + "/node_modules/boxicons/dist")); // boxicons
app.use("/fonts", express.static(__dirname + "node_modules/boxicons/fonts")); // boxicons
app.use("/css", express.static(__dirname + "/node_modules/boxicons/css")); // boxicons
app.use("/js", express.static(__dirname + "/node_modules/apexcharts/dist")); // apexcharts

// database credentials
app.use("/js", express.static(__dirname + "/database"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
