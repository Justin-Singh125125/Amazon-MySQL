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

        for (var i = 0; i < response.length; i++) {
            console.log("-------------------------------");
            console.log("Product Number: " + response[i].item_id);
            console.log("Product Name: " + response[i].product_name);
            console.log("price: $" + response[i].price);
            //after showing all data, ask the user what they want to do with the info

        }
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

        checkQuantity(response.itemId, response.howMany);
    })
}

//this function checks quanity, if enough, totals of price and passes it over to complete transaction function
function checkQuantity(productNum, howMany) {
    //create a query that will grab the quantity of the item and check
    var query = "SELECT stock_quantity, price FROM products WHERE ?";
    connection.query(query, { item_id: productNum }, function (err, response) {
        if (err) {
            throw err;
        }
        //a new variable to hold the updated quantity
        var newStock = response[0].stock_quantity;
        newStock -= howMany;
        if (newStock < 0) {
            console.log('Insufficient quantity');
            connection.end();
            return 1;
        } else {
            var userPrice = response[0].price;
            userPrice *= howMany;
            completeTransaction(userPrice, newStock, productNum);
        }

    })
}
function completeTransaction(userPrice, updatedStock, productNum) {
    var query = "UPDATE products SET ? WHERE ?";
    connection.query(query, [{ stock_quantity: updatedStock }, { item_id: productNum }], function (err) {
        if (err) {
            throw err;
        }
        console.log("\nYour total price is: $" + userPrice);
        console.log("\nYour order is being processed, thank you for your purchase.\n");
        connection.end();
        return 0;
    })



}