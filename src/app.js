import express from "express";
import ProductManager from "./productManager.js";

const app = express();
const PORT = 8080;

const productManagerInstance = new ProductManager();

app.get("/product", (req, res) => {
  const { limit } = req.query;
  //console.log({limit});
  const productos = productManagerInstance.getProduct(limit);
  return res.json({ productos });
});

app.get("/product/:pid", (req, res) => {
  const { pid } = req.params;
  const prodctos = productManagerInstance.getProductById(Number(pid));
  return res.json({prodctos});
});

app.listen(PORT, () => {
  console.log(`La aplicación se está ejecutando en el puerto ${PORT}`);
});
