import { Router } from 'express';
import ProductManager from '../productManager.js';

const router = Router();

router.get('/', (req,res) => {
    const {limit} = req.query;
    console.log(req.query);
    const prod = new ProductManager();
    const productos = prod.getProduct(limit);
    res.render('productos', { productos }); 
    //return res.json({ productos: prod.getProduct(limit)});
});

router.get('/:pid', (req,res) => {
    const {limit} = req.query;
    const prod = new ProductManager();
    return res.json({ productos: prod.getProductById(Number(pid))});
});

router.post('/',(req,res)=>{
    //const{title,description,price,thumbnails,code,stock,category,status}=req.body;
    const prod = new ProductManager();
    const resultado = prod.addProduct({...req.body});
    return res.json({resultado});
});

router.put('/:pid',(req,res)=>{
    const {pid}=req.params;
    const prod = new ProductManager();
    const resultado = prod.updateProduct(Number(pid),req.body);
    return res.json({resultado});
});

router.delete('/:pid',(req,res)=>{
    const {pid}=req.params;
    const prod = new ProductManager();
    const resultado = prod.deleteProduct(Number(pid));
    return res.json({resultado});
});

export default router;