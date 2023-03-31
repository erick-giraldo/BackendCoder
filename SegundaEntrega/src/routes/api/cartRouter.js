import { Router } from "express";
import CartController from "../../controllers/CartController.js";

const cartProducts = Router();

cartProducts.get("/:cid", CartController.getCartById);
cartProducts.post("", CartController.addCart);
cartProducts.post("/:cid/product/:pid", CartController.addProductCartById);
cartProducts.delete("/:cid/products/:pid", CartController.deleteProductById);
cartProducts.delete("/:cid", CartController.deleteProductsByCartId);
cartProducts.put("/:cid/products/:pid", CartController.updateProductQuantityByCartId);
cartProducts.put("/:cid", CartController.updateProductsByCartId);

export default cartProducts;