import { Router } from 'express';
import ProductManager from './productManager';

const router = Router();

router.get('/',(req,res)=>{
    const prod = new ProductManager();
    const productos = prod.getProducts();
    return res.render('home',{productos});
});

export default router;