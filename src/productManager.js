//const { CardTitle } = require("react-bootstrap");
//const fs = require('fs');
import fs from 'fs';

class ProductManager {
    #products;
    #path;
    static productId = 0;

    constructor(){
        this.#path = './src/data/productos.json';
        this.#products = this.#getInFile();
    }

    #resetProductId() {
        let id = 1;
        if (this.#products.length !== 0) 
            id = this.#products[this.#products.length - 1].id + 1; 
        return id;
    }      

    #getInFile(){
        try {
            if (fs.existsSync(this.#path)){
                return JSON.parse(fs.readFileSync(this.#path,'utf-8'));
            }
            return [];
        } catch (error) {
            console.log(`se ha producido el siguiente error: ${error}`);
        }
    }

    #setInFile(){
        try {
            fs.writeFileSync(this.#path, JSON.stringify(this.#products))
        } catch (error) {
            console.log(`se ha producido el siguiente error: ${error}`);
        }
    }

    addProduct(title, description, price, thumbnail, code, stock){

        if (!title|| !description || !price || !thumbnail || !code || !stock)
            return `Ingrese todos los datos son requeridos`;

        const duplicateParam = this.#products.some(item => item.code == code);
        
        if (duplicateParam)
            return `El código ${code} ya se encuentra registrado`;

        ProductManager.productId = ProductManager.productId + 1;
        const id = this.#resetProductId();

        const newProduct = {
            id
            ,title
            ,description
            ,price
            ,thumbnail
            ,code
            ,stock        
        }

        this.#products.push(newProduct);
        this.#setInFile();
        return `Producto ha sido agregado con exito`;
    }

    getProduct(limit = 0){
        limit = Number(limit);
        if (limit >0)
            return this.#products.slice(0, limit);
        return this.#products;
    }

    getProductById(id){
        const producto = this.#products.find(item => item.id == id);
        if (producto)
            return producto;
        else
            return `Not found product id ${id}`;
    }

    updateProduct(id, updatedProduct){
        let message = `El producto ${id} no existe`;
        const index = this.#products.findIndex(item => item.id === id);
        if (index !== -1){
            const { id: productId, ...obj } = updatedProduct; // Extrae el id del objeto updatedProduct
            this.#products[index] = {...this.#products[index], ...obj}; // Fusiona el objeto restante con el producto existente
            this.#setInFile(); 
            message = 'El producto ha sido actualizado';
        }
        return message; 
    }

    deleteProduct(id){
        let message = `El producto ${id} no existe`;
        const index = this.#products.findIndex(item => item.id === id);
        if (index !== -1){
            this.#products.splice(index, 1); 
            this.#setInFile(); 
            message = 'El producto ha sido eliminado';
        }
        return message; 
    }    
}

//module.exports = ProductManager;
export default ProductManager;


