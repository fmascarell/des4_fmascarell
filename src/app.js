import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

import products from './routers/products.js';
import carts from './routers/carts.js';
import views from './routers/views.js';
import __dirname from "./utils.js";
import ProductManager from "./productManager.js";

const app = express();
const PORT = 8080;
const prod = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine','handlebars');

//app.get('/',(req,res)=>{
//  return res.render('home');
//})

app.use('/', views);
app.use('./api/products', products);
app.use('./api/carts', carts);

const expServer = app.listen(PORT, () => {console.log(`App run in port ${PORT}`);});
const sockServer = new Server(expServer);

sockServer.on('connection', socket => {
  console.log('Client connected from the front');
  const productos = prod.getProduct();
  socket.emit('productos', productos);
  //console.log(productos);

  socket.on('addProduct', product =>{
    const result = prod.addProduct({...product});
    console.log({result});
    if (result.product)
      socket.emit('productos', result.product);
  })
});

