import { Router } from "express";
import ProductsController from "../../controllers/ProductsController.js";

const routerProducts = Router();

routerProducts.get("", ProductsController.getProducts);
routerProducts.get("/:pid", ProductsController.getProductById);
routerProducts.post("", ProductsController.addProduct);
routerProducts.put("/:pid", ProductsController.updateProduct);
routerProducts.delete("/:pid", ProductsController.deleteProduct);

export default routerProducts;