import { Router } from 'express';
import ViewController from '../../controllers/ViewController.js';
import chatController from './chat.js'
import authHome from '../../middleware/authHome.js'
import isLoged from '../../middleware/isLoged.js'
import { authJWTMiddleware } from '../../utils/hash.js';

const viewRouter = Router()

.get('' , authHome)
.get('/chat', authJWTMiddleware(['admin'], 'chat'), chatController.chatRouter)
.get('/home' , authJWTMiddleware(['user'], 'home'), ViewController.home)
.get('/realtimeproducts', authJWTMiddleware(['user'], 'realtimeproducts'), ViewController.realtimeproducts)
.get('/products', authJWTMiddleware(['admin','user'],'products'), ViewController.products)
.get('/profile', authJWTMiddleware(['admin'],'profile'), ViewController.profile)
.post("/carts/:cid/product/:pid", ViewController.addProductCartById)
.get('/carts/:cid', ViewController.getCart)
.get('/login', isLoged, ViewController.login)
export default viewRouter;