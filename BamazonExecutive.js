var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "Bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
})

var runSearch = function() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Product Sales By Deparment",
            "Create New Department",
            "Exit"
        ]
    }).then(function(answer) {
        switch(answer.action) {
            case 'View Product Sales By Deparment':
                viewSales();
            break;

            case 'Create New Department':
                createNewDepartment();
            break;
            case 'Exit':
            	process.exit();
            break;

        }
    })
}

var viewSales = function(){
	var query = 'SELECT DepartmentName, sum(OverHeadCosts) as cost, sum(TotalSales) as sales FROM Departments GROUP BY DepartmentName'
        connection.query(query, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log(i+1, "Department name: " + res[i].DepartmentName, "OverheadCosts: " + res[i].cost, "ProductSales: " + res[i].sales,"TotalProfit: " +(res[i].sales-res[i].cost));
            }
            
            runSearch();
        })
}
var createNewDepartment = function() {
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: "New Department Name"
    },
    {
        name: "overhead",
        type: "input",
        message: "What is overhead cost?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "sales",
        type: "input",
        message: "How much sales?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    },

    ]).then(function(answer) {
	        var post  = {DepartmentName: answer.department, OverHeadCosts: answer.overhead, TotalSales: answer.sales};
 			var query = connection.query('INSERT INTO Departments SET ?', post, function(err, result) {
 				console.log(`Department ${answer.department} Inserted`);
 			});
            runSearch();
        })
};

