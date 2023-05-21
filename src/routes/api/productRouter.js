import CustomerRouter from '../Router.js'
import ProductsController from "../../controllers/ProductsController.js";

export default class routerProducts extends CustomerRouter {

    init() {
        this.get("", ['USER','ADMIN'], ProductsController.getProducts);
        this.get("/:pid", ['USER','ADMIN'], ProductsController.getProductById);
        this.post("", ['ADMIN'], ProductsController.addProduct);
        this.put("/:pid", ['ADMIN'], ProductsController.updateProduct);
        this.delete("/:pid", ['ADMIN'], ProductsController.deleteProduct);
    }
  }