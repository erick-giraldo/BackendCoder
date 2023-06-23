import CustomerRouter from '../Router.js'
import ProductsController from "../../controllers/ProductsController.js";
import { validAddProduct, validUpdateProduct, validateDeleteProduct } from '../../middleware/index.js';
import TestingMocking from '../../controllers/TestingMocking.js';

export default class productsRouter extends CustomerRouter {

    init() {

        //Testing
        this.get('/mockingproducts', ['ADMIN'], TestingMocking.createProduct);
        this.get('/loggerTest', ['ADMIN'], TestingMocking.loggerTest);

        this.get("", ['USER','ADMIN'], ProductsController.getProducts);
        this.get("/:pid", ['USER','ADMIN'], ProductsController.getProductById);
        this.post("", ['ADMIN', 'PREMIUM'], validAddProduct, ProductsController.addProduct);
        this.put("/:pid", ['ADMIN', 'PREMIUM'], validUpdateProduct, ProductsController.updateProduct);
        this.delete("/:pid", ['ADMIN', 'PREMIUM'], validateDeleteProduct, ProductsController.deleteProduct);
        this.put("/:pid/:qty", ['USER','ADMIN'], ProductsController.discountStockProduct)

    }
  }