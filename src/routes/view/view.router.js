import CustomerRouter from '../Router.js'
import ViewController from '../../controllers/ViewController.js';
import chatController from './chat.js'
import { authHome, isLoged } from '../../middleware/sessionMiddleware.js';

export default class viewRouter extends CustomerRouter {

  init() {
    this.get('/products', ['USER','ADMIN'], ViewController.products)
    this.get('', ['PUBLIC'], authHome)
    this.get('/chat', ['ADMIN'] , chatController.chatRouter)
    this.get('/home', ['USER'], ViewController.home)
    this.get('/realtimeproducts', ['USER'], ViewController.realtimeproducts)
    this.get('/profile', ['ADMIN'], ViewController.profile)
    this.post("/carts/:cid/product/:pid", ['USER','ADMIN'], ViewController.addProductCartById)
    this.get('/cart/:cid', ['USER'], ViewController.getCart)
    this.get('/login' ,['PUBLIC'], isLoged, ViewController.login)
  }
}