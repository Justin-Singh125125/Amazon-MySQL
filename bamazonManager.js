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
    console.log("Welcome Manager");
    displayManagerMenu();

})
function displayManagerMenu() {

    console.log("-----------------------");

    inquirer.prompt([
        {
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "userChoice"
        }
    ]).then(function (res) {
        if (res.userChoice == "View Products for Sale") {
            viewAllProducts();
        }
        if (res.userChoice == "View Low Inventory") {
            viewLowInventory();
        }
        if (res.userChoice == "Add to Inventory") {
            addInventory();
        }
        if (res.userChoice == "Add New Product") {

        }
        if (res.userChoice == "Exit") {
            connection.end();
            return 0;
        }
    })
}

function viewAllProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, response) {
        if (err) {
            throw err;
        }
        console.log("\nLOADING INVENTORY......");

        for (var i = 0; i < response.length; i++) {
            console.log("-------------------------------");
            console.log("Product Number: " + response[i].item_id);
            console.log("Product Name: " + response[i].product_name);
            console.log("price: $" + response[i].price);
            console.log("# of Inventory: " + response[i].stock_quantity);
        }
        displayManagerMenu();
    })
}

function viewLowInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, response) {
        if (err) {
            throw err;
        }

        console.log("\nLOADING LOW INVENTORIES......");

        for (var i = 0; i < response.length; i++) {
            if (response[i].stock_quantity < 5) {
                console.log("-------------------------------");
                console.log("Product Number: " + response[i].item_id);
                console.log("Product Name: " + response[i].product_name);
                console.log("price: $" + response[i].price);
                console.log("# of Inventory: " + response[i].stock_quantity);
            }

        }
        displayManagerMenu();
    })
}
function addInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, results) {
        if (err) {
            throw err;
        }
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                }
            },

        ]).then(function (response) {
            for (var i = 0; i < results.length; i++) {
                if (response.choice == results[i].product_name) {
                    //a seperate function to make the code look cleaner
                    updateStock(response.choice, results[i].stock_quantity);
                }
            }
        })
    })

}

function updateStock(productName, newStock) {
    inquirer.prompt([
        {
            type: "input",
            message: "How much would you like to add",
            name: "updatedQuantity",

        }
    ]).then(function (response) {

        newStock += parseInt(response.updatedQuantity);


        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query, [{ stock_quantity: newStock }, { product_name: productName }], function (err) {
            if (err) {
                throw err;
            }
            console.log("Updated Inventory....");
            displayManagerMenu();
        })
    })

}