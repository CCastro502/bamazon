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
    directTraffic();
});

function directTraffic() {
    var trafficDirect = ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"];
    inquirer.prompt([
        {
            type: "list",
            message: "Manager Purview",
            choices: trafficDirect,
            name: "chooseDirection"
        }
    ]).then(function (response) {
        console.log(response.chooseDirection);
        if (response.chooseDirection === trafficDirect[0]) {
            viewProducts();
        } else if (response.chooseDirection === trafficDirect[1]) {
            lowInventory();
        } else if (response.chooseDirection === trafficDirect[2]) {
            addInventory();
        } else {
            addNewProduct();
        }
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log(`Item ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Price: $${res[i].price} | Stock: ${res[i].stock_quantity}\n----------------------------------------------------------------------\n`);
        }
        setTimeout(directTraffic, 1000);
    })

}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        if (res.length >=1) {
            for (i = 0; i < res.length; i++) {
                console.log(`Item ID: ${res[i].item_id} | Product Name: ${res[i].product_name} | Price: $${res[i].price} | Stock: ${res[i].stock_quantity}\n----------------------------------------------------------------------\n`);
            }
        } else {
            console.log("We have no low stock")
        }


    })
    setTimeout(directTraffic, 1000);
}

function addInventory() {
    connection.query("SELECT product_name, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        var productArray = [];
        var stockArray = [];
        for (i = 0; i < res.length; i++) {
            productArray.push(res[i].product_name);
            stockArray.push(res[i].stock_quantity);
        }
        inquirer.prompt([
            {
                type: "list",
                message: "Which item would you like to add stock to?",
                choices: productArray,
                name: "product"
            },
            {
                message: "How many units would you like to add to this stock?",
                name: "quantity",
                validate: function (value) {
                    if (!isNaN(value) && parseInt(value) > 0) {
                        return true
                    } else {
                        return "Must be a number bigger than 0."
                    }
                }
            }
        ]).then(function (response) {
            inquirer.prompt([
                {
                    type: "confirm",
                    message: `Are you sure you want to add ${response.quantity} to our stock of ${response.product}`,
                    name: "boolean"
                }
            ]).then(function (result) {
                if (result.boolean) {
                    connection.query("SELECT * FROM products WHERE ?", [{ "product_name": response.product }], function (uno, dos) {
                        if (uno) throw uno;
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                { "stock_quantity": parseInt(dos[0].stock_quantity) + parseInt(response.quantity) },
                                { "product_name": response.product }
                            ],
                            function (error, result) {
                                if (error) throw error;
                                console.log("Stock has been added.");
                            });
                    })
                    setTimeout(directTraffic, 1000);
                } else {
                    setTimeout(directTraffic, 1000);
                }
            })
        })
    })
}

function addNewProduct() {
    inquirer.prompt([
        {
            message: "Enter the name of the product you would like to add.",
            name: "name"
        },
        {
            message: "Which department will be in charge of monitoring and selling this product?",
            name: "department"
        },
        {
            message: "Enter the price that we will be selling this new item.",
            name: "price",
            validate: function (value) {
                if (!isNaN(value) && parseInt(value) > 0) {
                    return true
                } else {
                    return "Must be a number above 0"
                }
            }
        },
        {
            message: "Enter the number of units we will have in stock once this is added to our market.",
            name: "stock",
            validate: function (value) {
                if (!isNaN(value) && parseInt(value) > 0) {
                    return true
                } else {
                    return "Must be a number above 0"
                }
            }
        }
    ]).then(function (response) {
        var { name, department, price, stock } = response;
        console.log(name, department, price, stock);
        inquirer.prompt([
            {
                type: "confirm",
                message: `Are you sure you want to add ${stock} ${name}(s), sold at $${price} a pop, and managed by the ${department}?`,
                name: "boolean"
            }
        ]).then(function (response) {
            if (response.boolean) {
                connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ? ,?)", [name, department, parseFloat(price), parseInt(stock)], function (err, res) {
                    if (err) throw err;
                    console.log("Update successful. \nReturning back to Manager Purview");
                    setTimeout(directTraffic, 1000);
                })
            } else {
                console.log("Cancelling purchase; \nReturning to Manager Purview");
                setTimeout(directTraffic, 1000);
            }
        })
    })
}