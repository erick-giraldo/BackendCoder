import CustomerRouter from '../Router.js'
import ProductsController from "../../controllers/ProductsController.js";
import { validAddProduct, validUpdateProduct, validateDeleteProduct } from '../../middleware/sessionMiddleware.js';

export default class productsRouter extends CustomerRouter {

    init() {
        this.get("", ['USER','ADMIN'], ProductsController.getProducts);
        this.get("/:pid", ['USER','ADMIN'], ProductsController.getProductById);
        this.post("", ['ADMIN'], validAddProduct, ProductsController.addProduct);
        this.put("/:pid", ['ADMIN'], validUpdateProduct, ProductsController.updateProduct);
        this.delete("/:pid", ['ADMIN'], validateDeleteProduct, ProductsController.deleteProduct);
        this.put("/:pid/:qty", ['USER','ADMIN'], ProductsController.discountStockProduct)
    }
  }