import CustomerRouter from '../Router.js'
import CartController from "../../controllers/CartController.js";
import { validateFieldsCart } from '../../middleware/index.js';
import TicketsController from '../../controllers/TicketsController.js';

export default class cartProducts extends CustomerRouter {

    init() {
        this.get("/", ['ADMIN'], CartController.getAllCarts);
        this.get("/:cid", ['ADMIN'], CartController.getCartById);
        
        this.post("", ['ADMIN'], CartController.createCart);
        this.delete("/:cid", ['ADMIN'], CartController.deleteCartById)

        this.post("/:cid/product/:pid", ['USER','ADMIN', 'PREMIUM'], CartController.addProductCartById);
        this.put("/:cid/product/:pid", ['USER','ADMIN', 'PREMIUM'], CartController.discountQuantityProductCartById);
        
        this.delete("/:cid/product/:pid", ['USER','ADMIN', 'PREMIUM'], CartController.deleteProductsByCartId);
        this.put("/qty/:cid/product/:pid", ['ADMIN'], CartController.updateProductQuantityByCartId);
        this.put("/qty/:cid/products", ['ADMIN'], CartController.updateProductsCartById);

        this.post("/:cid/purchase/:total", ['USER','ADMIN', 'PREMIUM'], CartController.createOrder)
    }
  }