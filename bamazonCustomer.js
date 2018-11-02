var inquirer = require('inquirer');
var mysql = require('mysql');


//create connection settings for mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

//establish a connection with the database
connection.connect(function (err) {

    //if an error, tell us what it is
    if (err) {
        throw err;
    }

    //if there is no error, lets call some functions
    displayAllItems();
})

function displayAllItems() {
    //a query that will grab the id, name and price of the products
    var query = "SELECT item_id, product_name, price FROM products";

    //create the search
    connection.query(query, function (err, response) {
        if (err) {
            throw err;
        }

        //a for loop that will display all the items
        console.log("LOADING ITEMS..../");
        console.log("-------------------------");
        for (var i = 0; i < response.length; i++) {
            console.log("Product Number: " + response[i].item_id + " || " + "Product Name: " + response[i].product_name + " || " + "Price: " + response[i].price);
        }
        console.log("\n\n");
        //after showing all data, ask the user what they want to do with the info
        displayPrompt();
    })
}

function displayPrompt() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "Enter the Product Number that you would like to buy."
        },
        {
            type: "input",
            name: "howMany",
            message: "How many would you like to buy?"
        }
    ]).then(function (response) {

        var isThere = checkQuantity(response.itemId, response.howMany);
        if (isThere) {
            //complete transaction
        } else {
            console.log("Insufficent Quantity");
        }

    })
}

function checkQuantity(productNum, howMany) {
    //create a query that will grab the quantity of the item and check
    var query = "SELECT stock_quantity FROM products WHERE ?";
    connection.query(query, { item_id: productNum }, function (err, response) {
        if (err) {
            throw err;
        }
        //a temp variable to hold the current quantity
        var temp = response[0].stock_quantity;
        if ((temp - howMany) < 0) {
            return false;
        }
        return true;
    })
}