import express from "express";
import { Server } from "socket.io";
import { engine, Engine } from "express-handlebars";

import products from './routers/products.js';
import carts from './routers/carts.js';
import __dirname from "./utils.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('views', __dirname + './views');
app.set('view engine','handlebars');

app.get('/', (req, res) => {
  return res.render('home');
});

app.use('./api/products', products);
app.use('./api/carts', carts);

app.listen(PORT, () => {
  console.log(`App run in port ${PORT}`);
});
