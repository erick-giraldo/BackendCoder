import isEmpty from "is-empty";
import CartModel from "../dao/models/carts.js";
import ProductModel from "../dao/models/products.js";
import { Types } from "mongoose";
class CartController {
  static async getCartById(req, res) {
    try {
      let { cid } = req.params;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({ detail: "El id tiene que ser de tipo numérico" })
        );

      const cartById = await CartModel.findOne({ id: cid }).populate(
        "products._id"
      );

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
      await CartModel.create({});
      return res.json({
        message: "El carrito fue agregado exitosamente",
      });
    } catch (err) {}
  }

  static async addProductCartById(req, res) {
    try {
      let { cid, pid } = req.params;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );

      pid = Number(pid);
      if (isNaN(pid))
        throw new Error(
          JSON.stringify({
            detail: "El id del producto tiene que ser de tipo numérico",
          })
        );

      let cartById = await CartModel.findOne({ id: cid });
      if (!cartById)
        return res
          .status(404)
          .json({ message: `No se encontró un carrito con el id ${cid}` });

      const productById = await ProductModel.findOne({ id: pid });
      if (!productById)
        return res
          .status(404)
          .json({ message: `No se encontró un producto con el id ${pid}` });

      let listProduct = cartById.products;
      const searchProductByIdInCart = listProduct.find(
        (data) => data.product === pid
      );
      if (!isEmpty(searchProductByIdInCart)) {
        listProduct = listProduct.map((item) => {
          if (item.product !== pid) return item;
          return {
            ...item,
            quantity: ++item.quantity,
          };
        });
      } else {
        listProduct.push({
          product: pid,
          quantity: 1,
        });
      }

      await CartModel.updateOne(
        { id: cid },
        { $set: { products: listProduct } }
      );
      return res.json({
        message: "El producto fue agregado al carrito exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al insertar un producto en el carrito",
        error: JSON.parse(err.message),
      });
    }
  }

  static async deleteProductById(req, res) {
    try {
      let { cid, pid } = req.params;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );
      const cartById = await CartModel.updateOne(
        { id: cid },
        { $pull: { products: { _id: pid } } }
      );
      if (isEmpty(cartById))
        return res
          .status(404)
          .json({ message: "El producto a eliminar no existe" });

      return res.json({
        message: "El producto fue eliminado exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al buscar el producto",
        error: err.message,
      });
    }
  }

  static async deleteProductsByCartId(req, res) {
    try {
        const result = await CartModel.updateOne({ _id: req.params.cid }, { $set: { products: [] } })
        if (result.nModified === 0) return res.status(404).json({ message: 'Carrito no encontrado' })

        return res.json({
            message: 'Productos eliminados del carrito exitosamente'
        })
    } catch (e) {
        return res.status(500).json({
            message: e.message
        })
    }
}

static async updateProductQuantityByCartId(req, res) {
    try {
        const result = await CartModel.updateOne({
            _id: req.params.cid,
            'products._id': req.params.pid
        }, {
            $set: {
                'products.$.quantity': req.body.quantity
            }
        })
        if (result.nModified === 0) return res.status(404).json({ message: 'Carrito no encontrado' })

        return res.json({
            message: 'Cantidad de productos actualizada exitosamente'
        })
    } catch (e) {
        return res.status(500).json({
            message: e.message
        })
    }
}

static async updateProductsByCartId(req, res) {
    try {
        const result = await CartModel.updateOne({
            _id: req.params.cid
        }, {
            $set: {
                products: req.body.products
            }
        })
        if (result.nModified === 0) return res.status(404).json({ message: 'Carrito no encontrado' })

        return res.json({
            message: 'Productos actualizados exitosamente'
        })
    } catch (e) {
        return res.status(500).json({
            message: e.message
        })
    }
}

// static async removeProductByCartId(req, res) {
//     try {
//         const result = await CartModel.updateOne({
//             id: req.params.cid
//         }, {
//             $pull: {
//                 products: {
//                     product: req.params.pid
//                 }
//             }
//         })
//         if (result.nModified === 0) return res.status(404).json({ message: 'Carrito no encontrado' })

//         return res.json({
//             message: 'Producto eliminado del carrito exitosamente'
//         })
//     } catch (e) {
//         return res.status(500).json({
//             message: e.message
//         })
//     }
// }
}

export default CartController;
