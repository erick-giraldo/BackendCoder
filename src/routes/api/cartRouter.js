import CustomerRouter from '../Router.js'
import CartController from "../../controllers/CartController.js";
import { validateFieldsCart } from '../../middleware/index.js';
import TicketsController from '../../controllers/TicketsController.js';

export default class cartProducts extends CustomerRouter {

    init() {
        this.get("/", ['USER','ADMIN'], CartController.getAllCarts);
        this.get("/:cid", ['USER','ADMIN'], CartController.getCartById);

        this.post("", ['USER','ADMIN'], CartController.addCart);
        this.post("/add/product/:pid", ['USER','ADMIN', 'PREMIUM'], CartController.addProductCartById);

        this.delete("/products/:pid", ['USER','ADMIN'], CartController.deleteProductCartById);
        this.delete("/:cid", ['USER','ADMIN'], validateFieldsCart, CartController.deleteProductsByCartId);

        this.put("/:cid/products/:pid", ['USER','ADMIN'], validateFieldsCart, CartController.updateProductQuantityByCartId);
        this.put("/:cid", ['USER','ADMIN'], validateFieldsCart, CartController.updateProductsByCartId);
        this.post("/:cid/purchase/:total", ['USER'], CartController.createOrder)
        this.post("/:cid/ticket", ['USER'], TicketsController.createTicket)
    }
  }