//const { CardTitle } = require("react-bootstrap");
//const fs = require('fs');
import fs from "fs";

class ProductManager {
  #products;
  #path;
  //static productId = 0;

  constructor() {
    this.#path = "./src/data/productos.json";
    this.#products = this.#getInFile();
  }

  #resetProductId() {
    let id = 1;
    if (this.#products.length !== 0)
      id = this.#products[this.#products.length - 1].id + 1;
    return id;
  }

  #getInFile() {
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
      fs.writeFileSync(this.#path, JSON.stringify(this.#products));
    } catch (error) {
      console.log(`se ha producido el siguiente error: ${error}`);
    }
  }

  addProduct(
    {title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    category,
    status = true}
  ) {
    let msg = "Ha ocurrido un error inesperado";
    if (!title || !description || !price || !code || !stock || !category)
      msg = `Información incompleta, todos los datos son requeridos`;
    else {
      const duplicateParam = this.#products.some((item) => item.code == code);

      if (duplicateParam) msg = `Código ${code} ya se encuentra registrado`;
      else {
        const id = this.#resetProductId();

        const newProduct = {
          id,
          title,
          description,
          price,
          thumbnails,
          code,
          stock,
          category,
          status,
        };
        this.#products.push(newProduct);
        this.#setInFile();
        msg = 'Producto agregado exitosamente';
      }
    }
    return msg;
  }

  getProduct(limit = 0) {
    limit = Number(limit);
    if (limit > 0) return this.#products.slice(0, limit);
    return this.#products;
  }

  getProductById(id) {
    let status = false;
    let result = `El producto Id: ${id} mo existe`
    const producto = this.#products.find((item) => item.id == id);
    if (producto){
        status=true;
        result = producto; 
    }
    return {status,result};
  }

  updateProduct(id, updatedProduct) {
    let message = `El producto ${id} no existe`;
    const index = this.#products.findIndex((item) => item.id === id);
    if (index !== -1) {
      const { productId, ...rest } = updatedProduct; // Extrae el id del objeto updatedProduct
      const propsOk = ['title','description','price','thumbnails','code','stock','category','status'];
      const propsUpd = Object.keys(rest)
        .filter(p => propsOk.includes(p))
        .reduce((obj,key)=>{
            obj[key]=rest[key];
            return obj;
        },{});
      this.#products[index] = { ...this.#products[index], ...propsUpd }; // Fusiona el objeto restante con el producto existente
      this.#setInFile();
      message = {
        msg: 'Se ha actualizado el producto',
        producto: this.#products[index]
      };
    }
    return message;
  }

  deleteProduct(id) {
    let message = `El producto ${id} no existe`;
    const index = this.#products.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.#products.splice(index, 1);
      this.#setInFile();
      message = "El producto ha sido eliminado";
    }
    return message;
  }
}

//module.exports = ProductManager;
export default ProductManager;
