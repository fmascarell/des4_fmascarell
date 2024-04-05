const fs = require("fs");
const filename = "../assets/productos.json";

class ProductManager {
  #products = [];
  #maxId = 0;

  constructor() {
    this.#products = [];
  }

  /*Método para obtener el ID máximo de los productos. */
  getMaxId(arr) {
    let max = 0;

    for (let i = 0; i < arr.length; i++)
      parseInt(arr[i].id) > max ? (max = arr[i].id) : max;
    return max + 1;
  }

  /**lee los productos del archivo JSON y establece el ID máximo */
  async initialize() {
    this.#products = await this.readProductsFromFile();
    this.#maxId = this.getMaxId(this.#products);
  }

  /**lee el contenido del archivo JSON y lo convierte en un objeto JavaScript */
  async readProductsFromFile() {
    try {
      const ProductsFileContent = await fs.promises.readFile(filename, "utf-8");
      const jsonFC = JSON.parse(ProductsFileContent);

      return jsonFC;
    } catch (err) {
      return [];
    }
  }

  /**Método que devuelve todos los productos */
  async getProducts() {
    return await this.readProductsFromFile();
  }

  /**Método que busca la posición de un producto por su código */
  findProductIndex(code) {
    const productIndex = this.#products.findIndex((p) => p.code === code);
    return productIndex;
  }

  async isNumeric(value) {
    return /^\d+$/.test(value);
  }

  /**Método que agrega un nuevo producto al arreglo de productos */
  async addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status = true
  ) {
    if (!title || !description || !price || !thumbnail || !code || !stock)
      return "Debe enviar todos los valores (title, description, price, thumbnail, code, stock, status)";

    if (isNaN(price)) return "Price no válidos";
    if (isNaN(stock)) return "Stock no válidos";

    const productIndex = this.findProductIndex(code);

    if (productIndex > -1) {
      console.error("Producto ya existe");
      return "Producto ya existe";
    }

    const id = this.#maxId++;

    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
    };

    this.#products.push(product);
    return await this.#updateFile();
  }

  /**Método que busca un producto por su ID*/
  async getProductById(idProd) {
    const prdBuscado = this.#products.find((prd) => prd.id === idProd);
    if (!prdBuscado) {
      console.error("producto no encontrado");
      return;
    }
    return prdBuscado;
  }

  /*Escribe los productos en el archivo JSON.*/
  async #updateFile() {
    await fs.promises.writeFile(
      filename,
      JSON.stringify(this.#products, null, "\t")
    );

    return true;
  }

  /**Actualiza la información de un producto */
  async updateProduct(updatedProduct) {
    console.log("Nuevos datos => ", updatedProduct);
    const productIndex = this.findProductIndex(updatedProduct.code);

    if (productIndex < 0) {
      console.error("Producto no encontrado");
      return;
    }

    const product = { ...this.#products[productIndex], ...updatedProduct };
    this.#products[productIndex] = product;

    await this.#updateFile();
  }

  /**Elimina un producto del arreglo*/
  async deleteProduct(code) {
    const productIndex = this.findProductIndex(code);

    if (productIndex < 0) {
      console.error("Producto no encontrado");
      return;
    }

    this.#products.splice(productIndex, 1);
    await this.#updateFile();
  }
}

module.exports = ProductManager;
