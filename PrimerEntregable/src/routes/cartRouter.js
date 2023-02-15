import { Router } from "express";
import CartController from "../controllers/CartController.js";

const cartProducts = Router();

cartProducts.get("/:cid", CartController.getCartById);
cartProducts.post("", CartController.addProduct);
cartProducts.post("/:cid/product/:pid", CartController.addProductCartById);

export default cartProducts;