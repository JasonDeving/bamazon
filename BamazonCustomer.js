var mysql = require('mysql');
var prompt = require('prompt');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "Bamazon"
})

connection.query('SELECT * FROM Product', function(err, res) {
    if (err) throw err;
    console.log(res);
})
var schema = {
    properties: {
      items: {
      	pattern: '^[0-9]+$',
        message: 'What ItemId would you like to buy?',
        required: true
      },
      quantity: {
        pattern: '^[0-9]+$',
        message: 'How many?',
      	required: true
     }
  }
};

prompt.start();

function insert(department, totalSales) {
   var post  = {DepartmentName: department, OverHeadCosts: 10, TotalSales: totalSales};
   connection.query('INSERT INTO Departments SET ?', post, function(err, result) {
 });
}


var start = function() {
	prompt.get(schema, function (err, result) {

	function decrease(unit) {
	connection.query(`UPDATE Product SET StockQuantity = StockQuantity - ${unit} WHERE ?`, {ItemId: result.items} , function(err, res){
			console.log(res.message);
			console.log("What ItemId would you like to buy?")
		})
	}
    connection.query('SELECT * FROM Product where ? ', {ItemId: result.items}, function(err, res) {
	    if (err) throw err;
	    		if(res[0]['StockQuantity'] <= 0) {
	    			console.log("Insufficient Quantity! ");
	    			start();
	    		} else {
	    			decrease(result.quantity);
            var revenue = result.quantity*res[0]['Price'];
            insert(res[0].DepartmentName, revenue);
	    			console.log("Spent: $", revenue + " on " + res[0]['ProductName']);
	    			start();
	    		}
	    		
		})

    // prompt variables being passed through input
    // console.log('  Command: ' + result.items);
    // console.log('  Command: ' + result.quantity);


 });

}
start();



