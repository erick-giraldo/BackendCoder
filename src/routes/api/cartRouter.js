import CustomerRouter from '../Router.js'
import CartController from "../../controllers/CartController.js";
import { validateFieldsCart } from '../../middleware/index.js';
import TicketsController from '../../controllers/TicketsController.js';

export default class cartProducts extends CustomerRouter {

    init() {
        this.get("/", ['USER','ADMIN'], CartController.getAllCarts);
        this.get("/:cid", ['USER','ADMIN'], CartController.getCartById);
        
        this.post("", ['USER','ADMIN'], CartController.createCart);
        this.delete("/:cid", ['USER', 'ADMIN'], CartController.deleteCartById)

        this.post("/product/:pid", ['USER','ADMIN', 'PREMIUM'], CartController.addProductCartById);
        this.put("/product/:pid", ['USER','ADMIN'], CartController.discountQuantityProductCartById);
        this.delete("/product/:pid", ['USER','ADMIN'], CartController.deleteProductsByCartId);
        this.put("/qty/product/:pid", ['USER','ADMIN'], CartController.updateProductQuantityByCartId);
        this.put("/qty/products", ['USER','ADMIN'], CartController.updateProductsCartById);

        this.post("/:cid/purchase/:total", ['USER','ADMIN'], CartController.createOrder)
        this.post("/:cid/ticket", ['USER'], TicketsController.createTicket)
    }
  }