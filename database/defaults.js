var mysql = require('mysql');
var bcrypt = require('bcrypt');
var credentials = require('./credentials');

// Create a MySQL connection
var con = credentials.connection;

const dbDefaults = () => {
    return new Promise((resolve, reject) => {
        console.log("Creating default datas...");
        // Connect to the MySQL server
        console.log("Setting up database defaults...");
        con.connect((err) => {
            if (err) {
                console.error("Error connecting to MySQL database: ", err);
                return;
            }
            console.log("Connected to MySQL database!");
        });

        // Create admin user
        let username = credentials.admin.username;
        let email = credentials.admin.email;
        let password = credentials.admin.password;
        con.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], function (err, result) {
            if (err) {
                console.log("FIND ERROR: ", err);
                res.status(500).send("Internal server error");
            } else {
                if (result.length > 0) {
                    console.log("Admin account already exists, not creating...");
                } else {
                    // hash the password
                    bcrypt.hash(password, 10, function (err, hash) {
                        if (err) {
                            console.log("HASHING ERROR: ", err);
                            res.status(500).send("Internal server error");
                        } else {
                            let firstName = credentials.admin.first_name;
                            let lastName = credentials.admin.last_name;
                            let idNumber = credentials.admin.id_number;
                            con.query('INSERT INTO users (first_name, last_name, id_number, username, email, password, user_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, idNumber, username, email, hash, 1], function (err, result) {
                                if (err) {
                                    console.log("INSERT REGISTER ERROR: ", hash, err);
                                } else {
                                    console.log("Admin created successfully: ", result);
                                }
                            });
                        }
                    });
                }
            }
        });

        // Create categories
        let categories = ['Electronics', 'Fashion', 'Home & Living', 'Health & Beauty', 'Books & Stationery', 'Sports & Outdoor', 'Automotive', 'Others'];

        // Define the SQL query
        let sql = `INSERT INTO categories (category_name) VALUES ?`;
        try {
            // Execute the SQL query with all categories as a single parameter
            con.query(sql, [categories.map(category => [category])], (err, result) => {
                if (err) {
                    console.error("Error seeding categories: ", err.message);
                    return;
                }
                console.log("Categories seeded successfully!");

                // Create product categories
                let productCategories = ["TVs", "Phones", "Laptops", "Cameras", "Speakers", "Headphones", "Watches", "Shoes", "Clothes", "Bags", "Furniture", "Kitchen", "Bedroom", "Bathroom", "Makeup", "Skincare", "Haircare", "Books", "Stationery", "Fitness", "Camping", "Hiking", "Cycling", "Cars", "Motorbikes", "Trucks", "Bicycles", "Others"];
                // Define an array to store the generated pairs of category_name and category_id
                let categoriesData = [];

                // Generate pairs of category_name and category_id
                for (let i = 0; i < productCategories.length; i++) {
                    categoriesData.push([productCategories[i], Math.floor(Math.random() * categories.length + 1)]);
                }
                sql = `INSERT INTO product_categories (category_name, category_id) VALUES ?`;

                try {
                    con.query(sql, [categoriesData], (err, result) => {
                        if (err) {
                            console.error("Error seeding product categories: ", err.message);
                            return;
                        }
                        console.log("Product categories seeded successfully!");
                        // if (callback) {
                        //     callback();
                        // }
                        resolve();
                    });
                } catch (err) {
                    console.log("Insert error, ", err);
                }
            });
        } catch (err) {
            console.log("Insert error, ", err);
        }
    });
};

module.exports = { dbDefaults };