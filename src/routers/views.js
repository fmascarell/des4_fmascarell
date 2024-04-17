import { Router } from 'express';
import ProductManager from './productManager';

const router = Router();

router.get('/',(req,res)=>{
    const prod = new ProductManager();
    const productos = prod.getProducts();
    return res.render('home',{productos, styles: 'styles.css'});
    //return res.render('home',{productos});
});

router.get('/realtimeproducts',(req,res)=>{
    return res.render('realTimeProducts');
});

export default router;