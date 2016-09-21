var mysql = require('mysql');
var prompt = require('prompt');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "Bamazon"
})
connection.connect(function(err) {
    if (err) throw err;
})

var productsForSale = function() {
    connection.query('SELECT * FROM Product', function(err, res) {
        if (err) throw err;
            console.log("");
            for (var i = res.length - 1; i >= 0; i--) {
                console.log(res[i].ItemId,res[i].ProductName, "$ "+res[i].Price,"Inventory: "+res[i].StockQuantity)
            }
        })
};

var lowInventory = function(){
    console.log("low inventory")
    connection.query('SELECT * FROM Product where StockQuantity <= 1', function(err, res) {
        if (err) throw err;
            for (var i = res.length - 1; i >= 0; i--) {
                console.log(res[i].ItemId,res[i].ProductName, "$ "+res[i].Price,"Inventory: "+res[i].StockQuantity)
            }
            if(res.length == 0){
                console.log("There is no low inventory. ")
            }
        })
}

var another = {
    properties: {
      items: {
        pattern: '^[0-9]+$',
        message: 'What ItemId would you add? ',
        required: true
      },
      quantity: {
        pattern: '^[0-9]+$',
        message: 'How many?',
        required: true
     }
  }
};

var addInventory = function() {
    prompt.get(another, function (err, result) {

    function increase(unit) {
    connection.query(`UPDATE Product SET StockQuantity = StockQuantity + ${unit} WHERE ?`, {ItemId: result.items} , function(err, res){
            console.log(res.message);
            console.log(`
           What do you want to do?
                  productsForSale
                  lowInventory
                  addInventory
                  addNewProduct
        `)
        })
    }
    connection.query('SELECT * FROM Product where ? ', {ItemId: result.items}, function(err, res) {
        if (err) throw err;
                    increase(result.quantity);
                    console.log("Quantity increased ");
                    start();
                                
        })

    // prompt variables being passed through input
    // console.log('  Command: ' + result.items);
    // console.log('  Command: ' + result.quantity);


 });

}

var newProduct = {
    properties: {
      name: {
        message: 'What is name of product would you add? ',
        required: true
      },
      department: {
        message: 'What department?',
        required: true
     },
     price: {
        pattern: '^[0-9]+$',
        message: "How much? ",
        required: true
     },
     quantity: {
        pattern: '^[0-9]+$',
        message: "How many ? ",
        required: true
     }
  }
};

var addNewProduct = function() {
    prompt.get(newProduct, function (err, result) {
    var post = {ProductName: result.name, DepartmentName: result.department, Price: result.price, StockQuantity: result.quantity};
    connection.query('INSERT INTO Product SET ?', post,function(err, res) {
        if (err) throw err;
                    console.log("New Item has been Added");        
        })
    // prompt variables being passed through input
    // console.log('  Command: ' + result.items);
    // console.log('  Command: ' + result.quantity);
        start();

 });

}

function add(unit) {
    connection.query(`UPDATE Product SET StockQuantity = StockQuantity + ${unit} WHERE ?`, {ItemId: result.items} , function(err, res){
            console.log(res.message);
        })
}

var schema = {
    properties: {
      name: {
        pattern: /^[a-zA-Z\s\-]+$/,
        message: `
           What do you want to do?
                  productsForSale
                  lowInventory
                  addInventory
                  addNewProduct
        `,
        required: true
      }
    }
  };
function print(){
    console.log(schema.properties.name.message);
}
print();
prompt.start();

var start = function() {
    prompt.get(schema, function (err, result) {
    print();
    // console.log('  name: ' + result.name);
    
    switch(result.name) {
        case 'productsForSale':
            productsForSale();
            start();
            break;
        case 'lowInventory':
            lowInventory();
            start();
            break;
        case 'addInventory':
            addInventory();
            break;
        case 'addNewProduct':
            addNewProduct();
            break;
        case 'help' || 'show':
            console.log(`
            Type Commands as is "case sensitive"
                 productsForSale
                 lowInventory
                 addInventory
                 addNewProduct       
                `)
            break;
        default:
            start();
        }

    });
}


start();

