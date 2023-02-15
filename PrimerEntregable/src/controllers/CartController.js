import CartManager from "../class/CartManager.js";
import ProductManager from "../class/ProductManager.js";

import empty from "is-empty";

const cart = new CartManager("cart.json");
const items = new ProductManager("products.json");

export default class CartController {
  static async getCartById(req, res) {
    try {
      let error = {};
      let id = JSON.parse(req.params.cid);
      let result = await cart.getCartById(id);
      if (!result) {
        error = {
          message: `No se encuentra carrito con el id ${cid}`,
        };
        throw new Error(JSON.stringify({ error }));
      }
      return res.json({
        message: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Error al buscar Carrito",
        error: JSON.parse(error.message),
      });
    }
  }

  static async addProduct(req, res) {
    try {
      let error = {};
      const data = req.body;
      let result = await cart.addProductCart(data);
      res.send({
        result: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Error al agregar Producto a Carrito",
        error: JSON.parse(error.message),
      });
    }
  }

  static async addProductCartById(req, res) {
    try {
      let error = {};
      let cid = JSON.parse(req.params.cid);
      let pid  = JSON.parse(req.params.pid);
      const findCartId = await cart.getCartById(cid);
      if (!findCartId) {
        error = {
          message: `No se encuentra carrito con el id ${cid}`,
        };
        throw new Error(JSON.stringify({ error }));
      }
      const findProductId = await items.getProductById(pid);
      if (!findProductId) {
        error = {
          message: `No se encuentra Producto con el id ${pid}`,
        };
        throw new Error(JSON.stringify({ error }));
      }
      await cart.addProductCartById(cid, pid);
      return res.json({
        message: "El producto fue agregado exitosamente al carrito ",
      });
    } catch (error) {
      return res.status(400).json({
        message: "Error al insertar un producto en el carrito",
        error: JSON.parse(error.message),
      });
    }
  }
}
