import isEmpty from "is-empty";
import ProductsService from "../services/products.service.js";
import CartService from "../services/carts.service.js";
import ProductController from "./ProductsController.js";
import TicketsController from "./TicketsController.js";
import UsersService from "../services/users.service.js";
import { isValidToken } from "../utils/hash.js";

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
      const cartById = await CartService.getOne(cid);

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

  static async createCart(req, res) {
    try {
      const result = await CartService.create({});
      return res.json({
        message: "El carrito fue agregado exitosamente",
        data: result,
      });
    } catch (err) {}
  }

  static async addProductCartByIdView(req, res) {
    try {
      console.log("eeeee")
      const { pid } = req.params;
      const cid = req.user.cart[0].id;
      console.log("🚀 ~ file: CartController.js:64 ~ CartController ~ addProductCartById ~ cid:", cid)
      if (isNaN(cid)) {
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );
      }
      const cartById = await CartService.getByIdView(cid);
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
      const token = await isValidToken(req.cookies.token);
      if(token.role === 'premium' && token.email !== productById.owner){
          throw new Error(JSON.stringify({ detail: `No puedes agregar un producto que no te pertenece` }));
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

  static async addProductCartById(req, res) {
    try {
      console.log("eeeee")
      const { pid, cid } = req.params;
      console.log("🚀 ~ file: CartController.js:64 ~ CartController ~ addProductCartById ~ cid:", cid)
      if (isNaN(cid)) {
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );
      }
      const cartById = await CartService.getByIdView(cid);
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
      const token = await isValidToken(req.cookies.token);
      if(token.role === 'premium' && token.email !== productById.owner){
          throw new Error(JSON.stringify({ detail: `No puedes agregar un producto que no te pertenece` }));
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

  static async deleteCartById(req, res){
    try{
        const { cid } = req.params;
        const cartById = await CartService.getById(cid);
        if(!cartById){
            return res.status(404).json({ message: `No se encontró un carrito con el id ${cid}` });
        }
        await CartService.deleteById(cid);
        return res.json({ message: `El carrito con el id ${cid} fue eliminado exitosamente` });
    }catch(err){
        return res.status(400).json({ message: "Error al eliminar el carrito", error: err.message });
    }
  }

  static async discountQuantityProductCartById(req, res) {
    try {
      let { pid } = req.params;
      let cid =
        !isEmpty(req.user) && !isEmpty(req.user.cart) ? req.user.cart[0].id : 0;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );

      let cartById = await CartService.getByIdView(cid);
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
        message: "Se desconto Productos del carrito exitosamente",
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
      let { pid } = req.params;
      let products = req.body.products;
      const result = await CartService.deleteProducts(cid, pid);
      if (result.nModified === 0)
        return res.status(404).json({ message: "Carrito no encontrado" });

      return res.json({
        message: "Productos eliminados exitosamente",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
    
  }

  static async deleteProductsByCartId(req, res) {
    try {
      let { pid } = req.params;
      let cid =
        !isEmpty(req.user) && !isEmpty(req.user.cart) ? req.user.cart[0].id : 0;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );
       let cartById = await CartService.getByIdView(cid);
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
        listProduct = listProduct.filter((item) => item._id.toString() !== pid);
      } else {
        return res.status(404).json({
          message: `El producto con el id ${pid} no se encuentra en el carrito`,
        });
      }
      await CartService.updateOne(cid, listProduct);
      return res.json({
        message: "Se elimino producto del carrito exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al eliminar producto del carrito",
        error: err.message,
      });
    }
  }

  static async updateProductQuantityByCartId(req, res) {
      try {
        let { pid } = req.params;
        let cid =
          !isEmpty(req.user) && !isEmpty(req.user.cart) ? req.user.cart[0].id : 0;
        cid = Number(cid);
        if (isNaN(cid))
          throw new Error(
            JSON.stringify({
              detail: "El id del carrito tiene que ser de tipo numérico",
            })
          );
         let cartById = await CartService.getByIdView(cid);
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
          listProduct = listProduct.map((item) => {
            if (item._id.toString() !== pid) return item;
            return {
              _id: item._id,
              quantity: item.quantity + parseInt(req.body.quantity),
            };
          });
        } else {
          return res.status(404).json({
            message: `El producto con el id ${pid} no se encuentra en el carrito`,
          });
        }
        await CartService.updateOne(cid, listProduct);
        return res.json({
          message: "Se aumentó la cantidad de productos en el carrito exitosamente",
        });
      } catch (err) {
        return res.status(400).json({
          message: "Error al aumentar la cantidad del producto en el carrito",
          error: err.message,
        });
      }
  }

  static async updateProductsCartById(req, res) {
    try {
      let { products } = req.body;
      let cid = req.user.cart[0].id;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );
      let cartById = await CartService.getByIdView(cid);
      if (!cartById)
        return res
          .status(404)
          .json({ message: `No se encontró un carrito con el id ${cid}` });
       let listProduct = products.map((product) => {
        const { id, quantity } = product;
        return {
          _id: id,
          quantity: parseInt(quantity),
        };
      });
       await CartService.updateOne(cid, listProduct);
      return res.json({
        message: "Se actualizó la cantidad de los productos en el carrito exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al actualizar la cantidad de los productos en el carrito",
        error: err.message,
      });
    }
  }

  static async updateCartBeforeBuy(cid, products) {
    try {
      const result = await CartService.updateOne(cid, products);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  static async createOrder(req, res) {
    try {
      let { cid, total } = req.params;
      total = JSON.parse(total)
      if(isEmpty(cid) || isEmpty(total) ){
         throw new Error(
          JSON.stringify("No hay Productos para generar Ticket")
        );
      }
      let ticket;
      const purchaser = req.user.email;
      const response = await CartService.getOneView(cid);
      const products = JSON.parse(JSON.stringify(response.products));
      const newProducts = products.map((product) => {
        return {
          _id: product._id._id,
          quantity: product.quantity,
          available: product._id.stock >= product.quantity,
        };
      });

      const available = newProducts.filter((product) => product.available);
      const notAvailable = newProducts.filter((product) => !product.available);
      // console.log({ available, notAvailable });

      const payload = {
        products : available,
        purchaser,
        amount: total,
      };
      // descontar stock
      if (available) {
        const user = await UsersService.getOne(purchaser);
        ticket = await TicketsController.createTicket(payload);
        const body = [{ _id: ticket._id}];
        const result = await UsersService.updateTicket(user._id, body);
        available.map(async (e) => {
          await ProductController.discountStockProduct(e._id, e.quantity);
        });
      }
      const ticketID = JSON.parse(JSON.stringify(ticket._id))

      let carrito = [];

      if (notAvailable) {
        notAvailable.map((e) => {
          carrito.push({
            _id: e._id,
            quantity: e.quantity,
          });
        });
      }
      await CartController.updateCartBeforeBuy(cid, carrito);
  
      res
      .cookie("ticket", ticketID , {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .sendSuccess({ message: "Se realizo la compra verificar el ticket", noProcedProducts: notAvailable });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
