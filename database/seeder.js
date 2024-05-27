var mysql = require('mysql');
var bcrypt = require('bcrypt');
var credentials = require('./credentials');

// Create a MySQL connection
let con = credentials.connection;

// Seed the users table
/*
desc users;
+--------------+--------------+------+-----+---------------------+----------------+
| Field        | Type         | Null | Key | Default             | Extra          |
+--------------+--------------+------+-----+---------------------+----------------+
| id           | int(11)      | NO   | PRI | NULL                | auto_increment |
| first_name   | varchar(15)  | NO   |     | NULL                |                |
| last_name    | varchar(15)  | NO   |     | NULL                |                |
| id_number    | varchar(20)  | NO   | UNI | NULL                |                |
| id_pictures  | varchar(600) | YES  |     | NULL                |                |
| dp           | varchar(255) | YES  |     | NULL                |                |
| username     | varchar(25)  | NO   | UNI | NULL                |                |
| email        | varchar(35)  | NO   | UNI | NULL                |                |
| password     | varchar(256) | NO   |     | NULL                |                |
| user_type_id | int(1)       | YES  | MUL | 2                   |                |
| last_login   | timestamp    | YES  |     | current_timestamp() |                |
| created_at   | timestamp    | YES  |     | current_timestamp() |                |
+--------------+--------------+------+-----+---------------------+----------------+
*/
const seedUsers = () => {
    // Connect to the MySQL server
    console.log("Seeding users...");

    // Define the SQL query
    let sql = `INSERT INTO users (first_name, last_name, id_number, dp, username, email, password, user_type_id) VALUES ?`;

    // Define the values
    let values = [
        ['John', 'Doe', '1234567890', 'user.png', 'john_doe', 'doe@email.com', 'sdhiuhewwkiodwdwewefpokojoef', 3],
        ['Jane', 'Doe', '0987154321', 'user.png', 'jane_doe', 'jane@email.com', 'sdhiuhlnidjsnjidnsmdiejdiowjed', 2],
        ['James', 'Smith', '1294567290', 'user.png', 'james_smith', 'smith@email.com', 'sdhiuhewniuawhsuihwiduhw', 3],
        ['Janet', 'Smith', '0967654321', 'user.png', 'janet_smith', 'j.smith@email.com', 'sdhiuhewniuawhsuihwiduhw', 2],
        ['Jack', 'Brown', '1224567890', 'user.png', 'jack_brown', 'jbrown@email.com', 'sdhiuhewniuawhsuihwiduhw', 3],
        ['Jill', 'Brown', '0987654321', 'user.png', 'jill_brown', 'jillbrown@email.com', 'sdhiuhewniuawhsuihwiduhw', 2]
    ];

    // Execute the SQL query
    try {
        con.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding users: ");
                return;
            }
            console.log("Users seeded successfully!");
        });
    } catch (err) {
        console.log("Insert error, ", err);
    }
};

/*
desc products;
+---------------------+---------------+------+-----+---------------------+----------------+
| Field               | Type          | Null | Key | Default             | Extra          |
+---------------------+---------------+------+-----+---------------------+----------------+
| id                  | int(3)        | NO   | PRI | NULL                | auto_increment |
| product_name        | varchar(15)   | NO   |     | NULL                |                |
| images              | varchar(9999) | YES  |     | NULL                |                |
| seller_id           | int(11)       | YES  |     | NULL                |                |
| description         | varchar(2500) | YES  |     | NULL                |                |
| minimum_price       | int(6)        | YES  |     | NULL                |                |
| bid_price           | int(6)        | YES  |     | NULL                |                |
| biddable            | int(1)        | YES  |     | 0                   |                |
| product_category_id | int(3)        | YES  | MUL | NULL                |                |
| brand               | varchar(10)   | YES  |     | NULL                |                |
| approved            | int(1)        | YES  |     | 0                   |                |
| bidder_id           | int(11)       | YES  | MUL | NULL                |                |
| bidded_at           | timestamp     | YES  |     | NULL                |                |
| end_time            | timestamp     | YES  |     | NULL                |                |
| collected_at        | timestamp     | YES  |     | NULL                |                |
| brought_at          | timestamp     | YES  |     | NULL                |                |
| created_at          | timestamp     | YES  |     | current_timestamp() |                |
+---------------------+---------------+------+-----+---------------------+----------------+
*/
const seedProducts = () => {
    // Connect to the MySQL server
    console.log("Seeding products...");
    // con.connect((err) => {
    //     if (err) {
    //         console.error("Error connecting to MySQL database: ", err);
    //         return;
    //     }
    //     console.log("Connected to MySQL database!");
    // });

    // Define the SQL query
    let sql = `INSERT INTO products (product_name, images, seller_id, description, minimum_price, bid_price, biddable, product_category_id, brand, approved, bidder_id, end_time) VALUES ?`;

    // Define the values
    let values = [
        ['Product 01', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 2, 'This is product 1', 100, 0, 0, 1, 'Brand 1', 1, 1, '2024-12-08 23:59:59'],
        ['Product 02', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 2, 'This is product 2', 200, 0, 0, 2, 'Brand 2', 1, 2, '2024-10-08 23:59:59'],
        ['Product 03', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 3, 'This is product 3', 300, 0, 0, 3, 'Brand 3', 1, 3, '2024-11-08 23:59:59'],
        ['Product 04', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 4, 'This is product 4', 400, 0, 0, 4, 'Brand 4', 1, 2, '2024-09-08 23:59:59'],
        ['Product 05', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 3, 'This is product 5', 500, 0, 0, 2, 'Brand 5', 1, 4, '2025-06-08 23:59:59'],
        ['Product 06', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 4, 'This is product 6', 600, 0, 0, 1, 'Brand 6', 1, 1, '2024-02-21 23:59:59'],
        ['Product 07', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 4, 'This is product 7', 700, 0, 0, 3, 'Brand 7', 1, 3, '2025-11-08 23:59:59'],
        ['Product 08', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 2, 'This is product 8', 800, 0, 0, 4, 'Brand 8', 1, 4, '2024-08-08 23:59:59'],
        ['Product 09', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 3, 'This is product 9', 900, 0, 0, 1, 'Brand 9', 1, 2, '2024-07-08 23:59:59'],
        ['Product 10', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 2, 'This is product 10', 1000, 0, 0, 1, 'Brand 10', 1, 6, '2024-03-08 23:59:59'],
        ['Product 11', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 3, 'This is product 11', 1100, 0, 0, 1, 'Brand 11', 1, 5, '2024-05-08 23:59:59'],
        ['Product 12', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 4, 'This is product 12', 1200, 0, 0, 2, 'Brand 12', 1, 2, '2025-04-08 23:59:59'],
        ['Product 13', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 2, 'This is product 13', 1300, 0, 0, 4, 'Brand 13', 1, 3, '2024-01-08 23:59:59'],
        ['Product 14', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 3, 'This is product 14', 1400, 0, 0, 2, 'Brand 14', 1, 4, '2024-12-08 23:59:59'],
        ['Product 15', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 2, 'This is product 15', 1500, 0, 0, 3, 'Brand 15', 1, 2, '2024-10-08 23:59:59'],
        ['Product 16', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 3, 'This is product 16', 1600, 0, 0, 4, 'Brand 16', 1, 6, '2024-11-08 23:59:59'],
        ['Product 17', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 2, 'This is product 17', 1700, 0, 0, 2, 'Brand 17', 1, 3, '2024-09-08 23:59:59'],
        ['Product 18', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 4, 'This is product 18', 1800, 0, 0, 1, 'Brand 18', 1, 4, '2025-06-08 23:59:59'],
        ['Product 19', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 2, 'This is product 19', 1900, 0, 0, 3, 'Brand 19', 1, 2, '2024-02-01 23:59:59'],
        ['Product 20', 'gallery-1.jpg,gallery-2.jpg,gallery-3.jpg,gallery-4.jpg', 3, 'This is product 20', 2000, 0, 0, 4, 'Brand 20', 1, 5, '2024-11-08 23:59:59']
    ];

    // Execute the SQL query
    con.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error seeding products: ", err);
            return;
        }
        console.log("Products seeded successfully!");
    });
};

module.exports = {
    seedUsers,
    seedProducts
};