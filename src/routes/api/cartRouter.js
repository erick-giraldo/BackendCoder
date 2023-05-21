import CustomerRouter from '../Router.js'
import CartController from "../../controllers/CartController.js";

export default class cartProducts extends CustomerRouter {

    init() {
        this.get("/:cid", ['USER','ADMIN'], CartController.getCartById);
        this.post("", ['USER','ADMIN'], CartController.addCart);
        this.post("/:cid/product/:pid", ['USER','ADMIN'], CartController.addProductCartById);
        this.delete("/:cid/products/:pid", ['USER','ADMIN'], CartController.deleteProductById);
        this.delete("/:cid", ['USER','ADMIN'], CartController.deleteProductsByCartId);
        this.put("/:cid/products/:pid", ['USER','ADMIN'], CartController.updateProductQuantityByCartId);
        this.put("/:cid", ['USER','ADMIN'], CartController.updateProductsByCartId);
    }
  }