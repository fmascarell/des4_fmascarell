//const { CardTitle } = require("react-bootstrap");
//const fs = require('fs');
import fs from "fs";
import ProductManager from "./productManager.js";

class CartsManager {
  #carts;
  #path;
  //static productId = 0;

  constructor() {
    this.#path = "./src/data/carro.json";
    this.#carts = this.#getCartInFile();
  }

  #resetCartId() {
    let id = 1;
    if (this.#carts.length !== 0)
      id = this.#carts[this.#carts.length - 1].id + 1;
    return id;
  }

  #getCartInFile() {
    try {
      if (fs.existsSync(this.#path)) {
        return JSON.parse(fs.readFileSync(this.#path, "utf-8"));
      }
      return [];
    } catch (error) {
      console.log(`se ha producido el siguiente error: ${error}`);
    }
  }

  #setInFile() {
    try {
      fs.writeFileSync(this.#path, JSON.stringify(this.#carts));
    } catch (error) {
      console.log(`se ha producido el siguiente error: ${error}`);
    }
  }

  setCart(){
    const newCart = {
        id: this.#resetCartId(),
        products: []
    };
    this.#carts.push(newCart);
    this.#setInFile();
    return newCart;
  }

  getCartById(id) {
    const producto = this.#carts.find((item) => item.id == id);
    if (producto) return producto;
    else return `Not found product id ${id}`;
  }

  addProductInCart(cid,pid){
    let msg = `El carrito id: ${cid} no existe`;
    const indexCart = this.#carts.findIndex(c=>c.id = cid);

    if (indexCart !== -1){
        const indexProd = this.#carts[indexCart].products.findIndex(p=>p.id === pid);
        const prod = new ProductManager();
        const producto = prod.getProductById(pid);

        if (producto.status && indexProd === -1){
            this.#carts[indexCart].products.push({id:pid, 'quantity':1});
            this.#setInFile();
            msg = 'Se ha agregado el producto al carro';
        }else if (producto.status && indexProd !== -1){
            this.#carts[indexCart].products[indexProd].quantity;
            this.#setInFile();
            msg = 'Se ha agregado el producto al carro';
        }else{
            msg = `El producto Id: ${pid} no existe`;
        }
    }
    return msg;
  }
}

//module.exports = CartsManager;
export default CartsManager;
