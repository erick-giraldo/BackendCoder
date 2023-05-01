import { Router } from 'express';
import ViewController from '../../controllers/ViewController.js';
import chatController from './chat.js'
import auth from '../../middleware/auth.js'
import authHome from '../../middleware/authHome.js'
import isLoged from '../../middleware/isLoged.js'
import { authJWTMiddleware } from '../../utils/hash.js';

const viewRouter = Router();

viewRouter.get('/chat', chatController.chatRouter)
viewRouter.get('', authHome ,ViewController.home)
viewRouter.get('/realtimeproducts', ViewController.realtimeproducts)
viewRouter.get('/products', authJWTMiddleware(['admin','user'],'products'), ViewController.products)
viewRouter.get('/profile', authJWTMiddleware(['admin'],'profile'), ViewController.profile)

viewRouter.post("/carts/:cid/product/:pid", ViewController.addProductCartById);
viewRouter.get('/carts/:cid', ViewController.getCart)
viewRouter.get('/login', isLoged, ViewController.login)
viewRouter.get('/401' , ViewController.Unauthorized)
export default viewRouter;