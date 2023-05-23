import isEmpty from "is-empty";
import ProductsService from "../services/products.service.js";
import CartService from "../services/carts.service.js";

export default class CartController {
  static async getAllCarts(req, res) {
    try {
      const cartById = await CartService.findAll();

      if (!cartById)
        return res.status(404).json({ message: "Carrito no encontrado" });

      return res.json({
        message: "Carrito encontrado",
        data: cartById,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al buscar el carrito",
        error: err.message,
      });
    }
  }

  static async getCartById(req, res) {
    try {
      let { cid } = req.params;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({ detail: "El id tiene que ser de tipo numérico" })
        );

      const cartById = await CartService.getOne( cid );

      if (!cartById)
        return res.status(404).json({ message: "Carrito no encontrado" });

      return res.json({
        message: "Carrito encontrado",
        data: cartById,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al buscar el carrito",
        error: err.message,
      });
    }
  }

  static async addCart(req, res) {
    try {
      await CartService.create({});
      return res.json({
        message: "El carrito fue agregado exitosamente",
      });
    } catch (err) {}
  }

  static async addProductById(req, res) {
    try {
      const { pid } = req.params;
      const cid = req.user.cart[0].id;
      if (isNaN(cid)) {
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );
      }
      const cartById = await CartService.getById(cid);
      if (!cartById) {
        return res
          .status(404)
          .json({ message: `No se encontró un carrito con el id ${cid}` });
      }
      const productById = await ProductsService.getById({ _id: pid });
      if (!productById) {
        return res
          .status(404)
          .json({ message: `No se encontró un producto con el id ${pid}` });
      }
      let listProduct = cartById.products;
      const existingProduct = listProduct.find(
        (item) => item._id.toString() === pid
      );
      if (existingProduct && existingProduct.quantity >= productById.stock) {
        return res.status(400).json({
          message: `El producto ${productById.name} ya está agregado al carrito y no hay suficiente stock`,
        });
      }
      if (existingProduct) {
        listProduct = listProduct.map((item) =>
          item._id.toString() !== pid
            ? item
            : {
                _id: item._id,
                quantity: item.quantity + 1,
              }
        );
      } else {
        listProduct.push({
          _id: pid,
          quantity: 1,
        });
      }
      await CartService.updateOne(cid, listProduct);
      return res.json({
        message: "El producto fue agregado al carrito exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al insertar un producto en el carrito",
        error: err.message,
      });
    }
  }

  static async deleteProductCartById(req, res) {
    try {
      let { pid } = req.params;
      let cid = !isEmpty(req.user) && !isEmpty(req.user.cart) ? req.user.cart[0].id : 0;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );

      let cartById = await CartService.getById(cid);
      if (!cartById)
        return res
          .status(404)
          .json({ message: `No se encontró un carrito con el id ${cid}` });

      const productById = await ProductsService.getById({ _id: pid });
      if (!productById)
        return res
          .status(404)
          .json({ message: `No se encontró un producto con el id ${pid}` });

      let listProduct = cartById.products;
      const searchProductByIdInCart = listProduct.find(
        (data) => data._id.toString() === pid
      );
      if (!isEmpty(searchProductByIdInCart)) {
        listProduct = listProduct
          .map((item) => {
            if (item._id.toString() !== pid) return item;
            if (item.quantity > 1) {
              return {
                _id: item._id,
                quantity: --item.quantity,
              };
            } else {
              return null; // Eliminar el producto si la cantidad es 1
            }
          })
          .filter(Boolean); // Filtrar los elementos nulos (productos eliminados)
      } else {
        return res.status(404).json({
          message: `El producto con el id ${pid} no se encuentra en el carrito`,
        });
      }
      await CartService.updateOne(cid, listProduct);
      return res.json({
        message:
          "La cantidad del producto en el carrito se disminuyó exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al disminuir la cantidad del producto en el carrito",
        error: err.message,
      });
    }
  }

  static async deleteProductsByCartId(req, res) {
    try {
      let { cid } = req.params;
      cid = Number(cid);
      const products = []
      const result = await CartService.updateOne( cid, products );
      return res.json({
        message: "Productos eliminados del carrito exitosamente",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  }

  static async updateProductQuantityByCartId(req, res) {
    try {
      let { cid, pid } = req.params;
      let quantity = req.body.quantity;
      const result = await CartService.updateOneQuantity(cid, pid, quantity );
      if (result.nModified === 0)
        return res.status(404).json({ message: "Carrito no encontrado" });

      return res.json({
        message: "Cantidad de productos actualizada exitosamente",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  }

  static async updateProductsByCartId(req, res) {
    try {
      let { cid } = req.params;
      let products = req.body.products;
      const result = await CartService.updateOne( cid, products );
      if (result.nModified === 0)
        return res.status(404).json({ message: "Carrito no encontrado" });

      return res.json({
        message: "Productos actualizados exitosamente",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  }

  static async updateCartBeforeBuy(cid, products) {
    try {
      // let { cid } = req.params;
      // let products = req.body.products;
      const result = await CartService.updateOne( cid, products );
      return true
    } catch (e) {
      return false
    }
  }
  
}

