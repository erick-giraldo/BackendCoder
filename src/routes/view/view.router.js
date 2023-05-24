import CustomerRouter from '../Router.js'
import ViewController from '../../controllers/ViewController.js';
import chatController from './chat.js'
import { authHome, isLoged } from '../../middleware/sessionMiddleware.js';

export default class ViewRouter extends CustomerRouter {

  init() {
    this.get('/products', ['USER','ADMIN'], ViewController.products)
    this.get('', ['PUBLIC'], authHome)
    this.get('/mailing',  ['USER','ADMIN'], ViewController.mailling)
    this.get('/reset-password',  ['USER','ADMIN'], ViewController.resetPassword)
    this.get('/chat', ['USER'] , chatController.chatRouter)
    this.get('/home', ['USER'], ViewController.home)
    this.get('/realtimeproducts', ['USER'], ViewController.realtimeproducts)
    this.get('/profile', ['ADMIN'], ViewController.profile)
    this.get('/cart/:cid', ['USER','ADMIN'], ViewController.getCart)
    this.get('/login' ,['PUBLIC'], isLoged, ViewController.login)
    this.get('/invoice' , ['USER','ADMIN'], ViewController.invoice)

    this.post("/carts/product/:pid", ['USER'], ViewController.addProductById)
    
    this.delete("/deletecarts/product/:pid", ['USER','ADMIN'], ViewController.deleteProductCartById)

  }
}