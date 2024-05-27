let credentials = require("./db_credentials");
let mysql = require("mysql");
const bcrypt = require('bcrypt');

const con = mysql.createConnection({
    host: "localhost",
    database: credentials.database,
    user: credentials.username,
    password: credentials.password,
});

function login(username, password) {
    con.connect(function (err) {
        con.query(
            "SELECT username, password, user_type_id FROM users WHERE username = '" +
            username +
            "'",
            function (err, result, fields) {
                if (err) {
                    throw err;
                }
                if (result.length > 0) {
                    let userType = result[0].user_type_id; // make this global
                    bcrypt.compare(password, result[0].password, function (err, isMatch) {
                        if (err) {
                            throw err;
                        }
                        if (isMatch) {
                            console.log("User found...");
                            if (userType == 1 /*ADMIN*/) {
                                // window.href = "dashboard-admin.html";
                                console.log("Admin logged in...");
                            } else if (userType == 2) {
                                console.log("Customer logged in...");
                            } else if (userType == 3) {
                                console.log("Seller logged in...");
                            }
                        } else {
                            console.log("Incorrect password. Please try again or reset your password.");
                        }
                    });
                } else {
                    console.log(
                        "User not found. Check your credentials or try to signup to the system."
                    );
                }
                con.end();
            }
        );
    });
}

function register(
    firstName,
    lastName,
    idNumber,
    idPictures,
    dp,
    email,
    username,
    password
) {
    // check if a user exists before adding
    let userFound = false;
    con.connect(function (err) {
        con.query("SELECT username FROM users WHERE username='" + username + "' OR email='" + email + "'", function (err, result, fields) {
            if (err) {
                console.log("Error reading user...", err);
                con.end();
                return err.errno;
            }
            if (result.length > 0) {
                console.log("User already exists...");
                con.end();
                userFound = true;
                return false;
            }
        });
    });
    if (!userFound) {
        con.connect(function (err) {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    console.log("Password hashing error...", err);
                    con.end();
                    return err.errno;
                }
                con.query(
                    "INSERT IGNORE INTO users(`first_name`, `last_name`, `id_number`, `id_pictures`, `dp`, `username`, `email`, `password`) VALUES('" +
                    firstName +
                    "', '" +
                    lastName +
                    "', '" +
                    idNumber +
                    "', '" +
                    idPictures +
                    "', '" +
                    dp +
                    "', '" +
                    username +
                    "', '" +
                    email +
                    "', '" +
                    hash +
                    "')",
                    function (err, result, fields) {
                        if (err) {
                            con.end();
                            console.log("Register error...", err);
                            return err.errno;
                        }
                        con.end();
                        console.log("Registered...");
                        return true;
                    }
                );
            });
        });
    }
}
