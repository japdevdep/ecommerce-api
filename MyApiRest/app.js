const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(port, () => console.log(`Escuchando en el puerto ${port}!`))

app.post('/product/publish', function(req, res) {
    let productsData = fs.readFileSync('products.json');  
    let products = JSON.parse(productsData);  

    var name = req.body.productName;
    var description = req.body.productDescription;
    var cost = req.body.productCost;
    var currency = req.body.productCurrency;
    var imgSrc = "";
    var soldCount = 0;

    var newProduct = {"name": name, "description": description, "cost": cost, "currency": currency, "imgSrc": imgSrc, "soldCount": soldCount};
    
    products.push(newProduct);

    var jsonContent = JSON.stringify(products);
    
    fs.writeFile("products.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    
        console.log("JSON file has been saved.");
    });

    res.send(jsonContent);
});