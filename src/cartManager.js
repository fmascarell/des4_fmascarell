const fs = require("fs");
const filename = "../assets/cart.json";

class CartManager {
  #carts = [];
  #maxId = 0;

  constructor() {
    this.#carts = [];
  }

  /** Recorre los carritos existentes para obtener el ID máximo y calcular el siguiente ID disponible */
  getMaxId(arr) {
    let max = 0;

    for (let i = 0; i < arr.length; i++) {
      parseInt(arr[i].id) > max ? (max = arr[i].id) : max;
    }
    return max + 1;
  }

  async initialize() {
    this.#carts = await this.readCartsFromFile();
    this.#maxId = this.getMaxId(this.#carts);
  }

  /** Método para leer y convertir el contenido del archivo JSON en un objeto 
   * JavaScript que representa los carritos */
  async readCartsFromFile() {
    try {
      const CartsFileContent = await fs.promises.readFile(filename, "utf-8");

      const jsonFC = JSON.parse(CartsFileContent);
      console.log(jsonFC);
      return jsonFC;
    } catch (err) {
      return [];
    }
  }

  /** Método que devuelve todos los carritos almacenados. */
  async getCarts() {
    return await this.readCartsFromFile();
  }

  /** Método que busca la posición de un carrito por su ID. */
  findCartIndex(idcart) {
    const cartIndex = this.#carts.findIndex((c) => c.id === idcart);
    return cartIndex;
  }

  /** Método para agregar un producto a un carrito especificado por su ID.
   * se manejan casos donde el carrito ya existe o es nuevo, y se actualiza o 
   * crea según corresponda*/
  async addProductCart(idc, idp, quantity) {
    if (!idc || !idp || !quantity)
      return "Todos los valores son requeridos (idc, idp, cant)";

    if (isNaN(quantity)) return "Cantidad no válida";

    const cartIndex = this.findCartIndex(idc);

    if (cartIndex > -1) {
      const cart = this.#carts[cartIndex];
      const products = cart["products"];
      const pIndex = products.findIndex((c) => c.id === idp);

      if (pIndex > -1) {
        const updatedProduct = {
          id: products[pIndex].id,
          quantity: parseInt(products[pIndex].quantity) + parseInt(quantity),
        };

        const prod = { ...products[pIndex], ...updatedProduct };

        products[pIndex] = updatedProduct;

        cart["products"] = products;

        console.log("carro actualizado", cart);

        this.#carts[cartIndex] = cart;
      } else {
        const product = { id: idp, quantity: parseInt(quantity) };
        products.push(product);
      }
    } else {
      const id = this.#maxId++;

      const products = [{ id: idp, quantity: parseInt(quantity) }];

      const cart = {
        id: idc,
        products: products,
      };

      this.#carts.push(cart);
    }

    return await this.#updateFile();
  }


  /** Método para obtener un carrito por su ID */
  async getCartById(idc) {
    const cartBuscado = this.#carts.find((cart) => cart.id === idc);
    if (!cartBuscado) {
      console.error("Carro no encontrado");
      return;
    }
    return cartBuscado;
  }

  /** Método para escribir los carritos actualizados en el archivo JSON */
  async #updateFile() {
    await fs.promises.writeFile(
      filename,
      JSON.stringify(this.#carts, null, "\t")
    );
    return true;
  }

  /** Método para actualizar la información de un producto dentro de un carrito */
  async updateProduct(updatedProduct) {
    console.log("Nuevos datos => ", updatedProduct);
    const cartIndex = this.findProductIndex(updatedProduct.code);

    if (productIndex < 0) {
      console.error("Producto no encontrado");
      return;
    }

    const cart = { ...this.#carts[cartIndex], ...updatedProduct };
    this.#carts[cartIndex] = cart;

    await this.#updateFile();
  }

  /** Método para eliminar un producto de un carrito */
  async deleteProduct(code) {
    const productIndex = this.findProductIndex(code);

    if (productIndex < 0) {
      console.error("Producto no encontrado");
      return;
    }

    this.#carts.splice(productIndex, 1);
    await this.#updateFile();
  }
}

module.exports = CartManager;
