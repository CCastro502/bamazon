var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    displayItems();
});

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var productListLength = res.length;
        for (i = 0; i < res.length; i++) {
            console.log(`Item ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Price: $${res[i].price}\n------------------------------------------------------------\n`);
        }
        startShop(productListLength);
    })

}

function startShop(length) {

    inquirer.prompt([
        {
            message: "Which item would you like to buy (choose by Item ID)",
            name: "productID",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= length) {
                    return true;
                } else {
                    return "To buy a product, type in the corresponding Item ID";
                }
            }
        },
        {
            message: "What quantity of this item would you like to buy (choose a number)",
            name: "productQuantity",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0) {
                    return true;
                } else {
                    return "Enter a number to buy the product. Number must be greater than 0";
                }
            }
        }
    ]).then(function (response) {
        connection.query("SELECT * FROM products WHERE item_id = ?", [response.productID], function (err, res) {
            if (err) throw err;
            if (parseInt(res[0].stock_quantity) > parseInt(response.productQuantity)) {
                inquirer.prompt([
                    {
                        message: `Are you sure you would like to purchase this? ${response.productQuantity} ${res[0].product_name} for ${res[0].price} each will cost ${parseInt(response.productQuantity) * res[0].price}.`,
                        type: "confirm",
                        name: "boolean"
                    }
                ]).then(function (results) {
                    if (results.boolean) {
                        connection.query(
                            "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                            [res[0].stock_quantity - parseInt(response.productQuantity), response.productID],
                            function (error, result) {
                                if (error) throw error;
                                console.log("Purchase confirmed. Returning to purchasing menu...");
                                setTimeout(displayItems, 3000);
                            });
                    } else {
                        console.log("Purchase cancelled. Returning back to purchasing menu...");
                        setTimeout(displayItems, 3000);
                    }
                })
            } else {
                console.log(`We only have ${res[0].stock_quantity} of this item, which is not enough for your purchase.\nReturning back to purchasing menu...`);
                setTimeout(displayItems, 3000);

            }

        });
    })
}