import { Router } from 'express';
import ViewController from '../../controllers/ViewController.js';

const viewRouter = Router();

viewRouter.get('', ViewController.home)
viewRouter.get('/realtimeproducts', ViewController.realtimeproducts)
viewRouter.get('/products', ViewController.products)
viewRouter.post("/carts/:cid/product/:pid", ViewController.addProductCartById);
viewRouter.get('/carts/:cid', ViewController.getCart)
export default viewRouter;