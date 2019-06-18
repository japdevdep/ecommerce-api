const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3000;
const PRODUCTS_FILE_NAME = 'products.json';
const PRODUCT_PUBLISH_URL = '/product/publish';
const PRODUCT_ALL_URL = '/product/all';
const CATEGORIES_FILE_NAME = 'categories.json';
const CATEGORIES_ALL_URL = '/category/all';
const CART_URL = '/cart';
const CART_FILE_NAME = 'cart_987.json';
const CATEGORY_URL = '/category';
const CATEGORY_FILE_NAME = 'cat_1234.json';
const PRODUCT_URL = '/product';
const PRODUCT_FILE_NAME = 'product_5678.json';
const PRODUCT_SOLD_FILE_NAME = 'product_{0}_sold.json'
const ERROR_SAVE_FILE_MESSAGE = 'Ha ocurrido un error al intentar guardar el archivo!';
const SUCCESS_SAVE_FILE_MESSAGE = 'Se ha guardado el archivo con éxito!';
const UTF_8 = 'utf8';

const logRequestStart = (req, res, next) => {
    console.info(`${req.method} ${req.originalUrl}`);
    next();
}

app.use(logRequestStart);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Escuchando en el puerto ${port}!`))

//Se selecciona publicar un producto.
app.post(PRODUCT_PUBLISH_URL, function(req, res) {
    let productsData = fs.readFileSync(PRODUCTS_FILE_NAME);  
    let products = JSON.parse(productsData);  

    var name = req.body.productName;
    var description = req.body.productDescription;
    var cost = req.body.productCost;
    var currency = req.body.productCurrency;
    var imgSrc = "";
    var soldCount = 0;

    var newProduct = {"name": name, "description": description, "cost": cost, "currency": currency, "imgSrc": imgSrc, "soldCount": soldCount};
    
    products.push(newProduct);

    let jsonContent = JSON.stringify(products);
    
    fs.writeFile(PRODUCTS_FILE_NAME, jsonContent, UTF_8, function (err) {
        if (err) {
            console.log(ERROR_SAVE_FILE_MESSAGE);
            return console.log(err);
        }
    
        console.log(SUCCESS_SAVE_FILE_MESSAGE);
    });

    res.send(jsonContent);
});

//Se desea obtener el listado de productos
app.get(PRODUCT_ALL_URL, function(req, res) {
    let productsData = fs.readFileSync(PRODUCTS_FILE_NAME);  
    let products = JSON.parse(productsData);
    res.json(products);
});

//Se desea obtener el listado de categorías
app.get(CATEGORIES_ALL_URL, function(req, res) {
    let categoriesData = fs.readFileSync(CATEGORIES_FILE_NAME);  
    let categories = JSON.parse(categoriesData);
    res.json(categories);
});

//Se desea obtener el carrito de compra con artículos
app.get(CART_URL, function(req, res) {
    var cartId = req.query.id;

    if (cartId === '987')
    {
        let cartData = fs.readFileSync(CART_FILE_NAME);  
        let cart = JSON.parse(cartData);
        res.json(cart);
    }else
    {
        res.send("No existe un carro con ese identificador");
    }
});

//Se desea obtener una categoría a partir del id
app.get(CATEGORY_URL, function(req, res) {
    var categoryId = req.query.id;

    if (categoryId === '1234')
    {
        let categoryData = fs.readFileSync(CATEGORY_FILE_NAME);  
        let category = JSON.parse(categoryData);
        res.json(category);
    }else
    {
        res.send("No existe una categoría con ese identificador");
    }
});

//Se desea obtener un producto a partir del id
app.get(PRODUCT_URL, function(req, res) {
    var productId = req.query.id;

    if (productId === '5678')
    {
        let productData = fs.readFileSync(PRODUCT_FILE_NAME);  
        let product = JSON.parse(productData);
        res.json(product);
    }else
    {
        res.send("No existe un producto con ese identificador");
    }
});

//Se desea obtener un producto a partir del id
app.post(CART_URL, function(req, res) {
    var productName = req.body.productName;
    var shippingType = req.body.shippingType;
    var streetAddress = req.body.shippingStreet;
    var numberAddress = req.body.shippingStreetNumber;
    var cornerAddress = req.body.shippingCornerStreet;
    var paymentType = req.body.paymentType;
    
    var productSold = { "productName": productName, 
                        "shippingType": shippingType, 
                        "streetAddress": streetAddress,
                        "numberAddress": numberAddress,
                        "cornerAddress": cornerAddress,
                        "paymentType": paymentType
                    };

    fs.writeFile(PRODUCT_SOLD_FILE_NAME.replace('{0}', productName), JSON.stringify(productSold), UTF_8, function (err) {
        if (err) {
            console.log(ERROR_SAVE_FILE_MESSAGE);
            return console.log(err);
        }
    
        console.log(SUCCESS_SAVE_FILE_MESSAGE);
    });

    res.json(productSold);
});