const express = require("express");
const ProductManager = require("./productManager");
const CartManager = require("./cartManager");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

productManagerInstance = new ProductManager();
cartManagerInstance = new CartManager();

app.get("/", async (req, res) => {
  res.end("Bienvenido...");
});

/*EndPoint productos*/
app.get("/product/", async (req, res) => {
  const limit = req.query.limit;
  let nLimit = 0;

  if (!isNaN(limit)) {
    nLimit = parseInt(limit);
  }

  console.log("limit => ", nLimit);
  let products = await productManagerInstance.getProducts();

  if (limit > 0) products = products.slice(0, limit);

  res.send({ status: "ok", result: products });
});

/** Obtiene producto por su id */
app.get("/product/:id", async (req, res) => {
  console.log(req.params.id);
  const product = await productManagerInstance.getProductById(parseInt(req.params["id"])); 

  if (product) {
    res.json({ status: "ok", result: product });
  } else {
    res.send({ status: "error", result: "Producto no Encontrado" });
  }
});

/** Almacena un nuevo producto */
app.post("/api/product/", async (req, res) => {
  const status = await productManagerInstance.addProduct(
    req.query.title,
    req.query.description,
    req.query.price,
    req.query.thumbnail,
    req.query.code,
    req.query.stock,
    req.query.status
  );

  console.log(status);
  if (status === true)
    res.send({ status: "Ok", message: "Producto grabado" });
  else res.send({ status: "Error", message: status });
});

/** Endpoint Cart */
app.get("/carts/", async (req, res) => {
  res.end("ID requerido");
});

app.get("/carts/:idc", async (req, res) => {
  const product = await productManagerInstance.getProductById(parseInt(req.params.id));

  if (product) {
    res.json(product);
  } else {
    res.end("Error, producto no encontrado");
  }
});

app.post("/api/cart/", async (req, res) => {
  console.log(req.query.idc, req.query.idp, req.query.quantity);

  const status = await cartManager.addProduct2Cart(
    req.query.idc,
    req.query.idp,
    req.query.quantity
  );

  console.log(status);
  if (status === true)
    res.send({ status: "ok", message: "producto agregado al carro" });
  else res.send({ status: "error", message: status });
});

/* Inicializa el gestor de carros de compras */
cartManagerInstance.initialize();

/* Inicializa el gestor de productos y comienza a escuchar las solicitudes en el puerto 8080 */
productManagerInstance
  .initialize()
  .then(() => {
    app.listen(8080, function (err) {
      console.log("Servidor escuchando en el puerto", 8080);
    });
  })
  .catch((err) => {
    console.log("Error en el servidor...");
    console.err(err);
  });
