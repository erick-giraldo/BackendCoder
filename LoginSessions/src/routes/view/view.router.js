import { Router } from 'express';
import ViewController from '../../controllers/ViewController.js';
import chatController from '../view/chat.js'
import auth from '../../middleware/auth.js'
const viewRouter = Router();

viewRouter.get('/chat', chatController.chatRouter)
viewRouter.get('', ViewController.home)
viewRouter.get('/realtimeproducts', ViewController.realtimeproducts)
viewRouter.get('/products', ViewController.products)
viewRouter.post("/carts/:cid/product/:pid", ViewController.addProductCartById);
viewRouter.get('/carts/:cid', ViewController.getCart)
viewRouter.get('/login', ViewController.login)
viewRouter.get('/profile', auth , ViewController.profile)
export default viewRouter;