import CustomerRouter from '../Router.js'
import OrderController from '../../controllers/OrderController.js';

export default class ordersRouter extends CustomerRouter {

    init() {
        // this.get("/:cid", ['USER','ADMIN'], OrderController.getCartById);
        this.post("/addTicket", ['USER','ADMIN'], OrderController.createTicket);
        // this.post("/:cid/product/:pid", ['USER','ADMIN'], OrderController.addProductCartById);
        // this.delete("/:cid/products/:pid", ['USER','ADMIN'], OrderController.deleteProductById);
        // this.delete("/:cid", ['USER','ADMIN'], OrderController.deleteProductsByCartId);
        // this.put("/:cid/products/:pid", ['USER','ADMIN'], OrderController.updateProductQuantityByCartId);
        // this.put("/:cid", ['USER','ADMIN'], OrderController.updateProductsByCartId);
    }
  }