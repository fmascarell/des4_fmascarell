import { Router } from 'express';
import CartsManager from '../cartsManager.js';
const router = Router();

router.get('/:cid',(req,res)=>{
    const {cid} = req.params;
    const cart = new CartManager();
    const result = cart.getCartById(Number(cid));
    return res.json({result});
});

router.post('/',(req,res)=>{
    const cart = new CartsManager();
    const result = cart.setCart();
    return res.json({result});
});

router.post('/:cid/product/:pid',(req,res)=>{
    const {cid,pid} = req.params;
    const cart = new CartsManager();
    const result = cart.addProductInCart(Number(cid),Number(pid));
    return res.json({result});
});

export default router;