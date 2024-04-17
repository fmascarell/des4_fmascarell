import express from "express";
import { Server, Socket } from "socket.io";
import { engine, Engine } from "express-handlebars";

import products from './routers/products.js';
import carts from './routers/carts.js';
import views from './routers/views.js';
import __dirname from "./utils.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('views', __dirname + './views');
app.set('view engine','handlebars');

//app.get('/', (req, res) => {
//  return res.render('home');
//});

app.use('/', views);
app.use('./api/products', products);
app.use('./api/carts', carts);

const expServer = app.listen(PORT, () => {console.log(`App run in port ${PORT}`);});
const sockServer = new Server(expServer);

sockServer.on('connection', socket => {
  console.log('Client connected from the front');
});

/*<script src="/socket.io/socket.io.js"></script>
<script src="/js/index.js"></script>*/