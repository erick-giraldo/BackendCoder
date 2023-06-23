import CustomerRouter from '../Router.js'
import ViewController from '../../controllers/ViewController.js';
import chatController from './chat.js'
import { authHome, isLoged, viewResetPassword } from '../../middleware/index.js';
export default class ViewRouter extends CustomerRouter {

  init() {
    this.get('/products', ['USER','ADMIN', 'PREMIUM'], ViewController.products)
    this.get('', ['PUBLIC'], authHome)
    this.get('/mailing',  ['USER','ADMIN'], ViewController.mailling)
    this.get('/forgotPassword',  ['PUBLIC'], viewResetPassword , ViewController.forgotPassword)
    this.get('/chat', ['USER'] , chatController.chatRouter)
    this.get('/home', ['USER'], ViewController.home)
    this.get('/realtimeproducts', ['USER', 'PREMIUM'], ViewController.realtimeproducts)
    this.get('/profile', ['ADMIN'], ViewController.profile)
    this.get('/cart/:cid', ['USER','ADMIN', 'PREMIUM'], ViewController.getCart)
    this.get('/login' ,['PUBLIC'], isLoged, ViewController.login)
    this.get('/invoice' , ['USER','ADMIN'], ViewController.invoice)

    this.post("/carts/product/:pid", ['USER', 'PREMIUM'], ViewController.addProductById)
    
    this.delete("/deletecarts/product/:pid", ['USER','ADMIN'], ViewController.deleteProductCartById)



  }
}