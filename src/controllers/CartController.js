import { isValidToken } from "../utils/hash.js";
import isEmpty  from "is-empty";
import ProductsService from "../services/products.service.js";
import CartService from "../services/carts.service.js";
import ProductController from "./ProductsController.js";
import TicketsController from "./TicketsController.js";
import UsersService from "../services/users.service.js";

export default class CartController {
  static async createCart(req, res) {
    try {
      const result = await CartService.create();
      if(!result){
        throw new Error("No se pudo crear el carrito")
      }
      const findCart = await CartService.getById({ _id: result._id });
      return res.sendSuccess({
        message: "El carrito fue agregado exitosamente",
        data: findCart,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al crear el carrito",
        error: error.message,
      });
    }
  }

  static async getAllCarts(req, res) {
    try {
      const carts = await CartService.findAll();
      if (isEmpty(carts)){
        throw new Error("No se encontraron carritos")
    }
      return res.sendSuccess({
        message: "Carrito encontrado",
        data: carts,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al buscar el carrito",
        error: error.message,
      });
    }
  }

  static async getCartById(req, res) {
    try {
      const { cid } = req.params;
      if (isNaN(cid)) {
        throw new Error("El id del carrito tiene que ser de tipo numérico");
      }
      const cartById = await CartService.getByIdView(cid);

      if (!cartById){
        throw new Error(`No se encontró un carrito con el id ${cid}`);
      }
      return res.sendSuccess({
        message: "Carrito encontrado",
        data: cartById,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al buscar el carrito",
        error: error.message,
      });
    }
  }

  static async deleteCartById(req, res) {
    try {
      let { cid } = req.params;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error("El id del carrito tiene que ser de tipo numérico");

      const cartById = await CartService.getByIdView(cid);
      if (!cartById) {
        throw new Error(`No se encontró un carrito con el id ${cid}`);
      }
      await CartService.deleteById({ id: cid });
      return res.sendSuccess({ message: `El carrito con el id ${cid} fue eliminado exitosamente` });
    } catch (error) {
      return res.sendServerError({ message: "Error al eliminar el carrito", error: error.message });
    }
  }

  static async addProductCartById(req, res) {
    try {
      const { pid, cid } = req.params;
      if (isNaN(cid)) {
        throw new Error(
          JSON.stringify({
            detail: "El id del carrito tiene que ser de tipo numérico",
          })
        );
      }
      const cartById = await CartService.findOne(cid);
      if (!cartById) {
        return res
          .status(404)
          .json({ message: `No se encontró un carrito con el id ${cid}` });
      }
      const productById = await ProductsService.getOne({ _id: pid });
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
      await CartService.updateOne({ id: cid } , { products: listProduct});
      const result = await CartService.getByIdView(cid);
      return res.json({
        message: "El producto fue agregado al carrito exitosamente",
        data: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al insertar un producto en el carrito",
        error: err.message,
      });
    }
  }
  
  static async discountQuantityProductCartById(req, res) {
    try {
      let { pid, cid } = req.params;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error("El id del carrito tiene que ser de tipo numérico");

      let cartById = await CartService.findOne(cid);
      if (!cartById){
        throw new Error(`No se encontró un carrito con el id ${cid}`);
      }
      const productById = await ProductsService.getOne({ _id: pid });
      if (!productById){
        throw new Error(`No se encontró un producto con el id ${pid}`);
      }
      let listProduct = cartById.products;
      const searchProductByIdInCart = listProduct.find((data) => data._id.toString() === pid);
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
              return null;
            }
          })
          .filter(Boolean);
      } else {
        throw new Error(`El producto con el id ${pid} no se encuentra en el carrito`);
      }
      await CartService.updateOne({ id: cid } , { products: listProduct});
      const result = await CartService.getByIdView(cid);
      return res.sendSuccess({
        message: "Se descontó Productos del carrito exitosamente",
        data: result,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al disminuir la cantidad del producto en el carrito",
        error: error.message,
      });
    }
  }

  static async deleteProductsByCartId(req, res) {
    try {
      let { pid, cid } = req.params;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error("El id del carrito tiene que ser de tipo numérico");

      let cartById = await CartService.findOne(cid);
      if (!cartById){
        throw new Error(`No se encontró un carrito con el id ${cid}`);
      }
      const productById = await ProductsService.getOne({ _id: pid });
      if (!productById){
        throw new Error(`No se encontró un producto con el id ${pid}`);
      }
      let listProduct = cartById.products;
      const searchProductByIdInCart = listProduct.find((data) => data._id.toString() === pid);
      if (!isEmpty(searchProductByIdInCart)) {
        listProduct = listProduct.filter((item) => item._id.toString() !== pid);
      } else {
        throw new Error(`El producto con el id ${pid} no se encuentra en el carrito`);
      }

      await CartService.updateOne({ id: cid } , { products: listProduct});
      const result = await CartService.getByIdView(cid);
      return res.sendSuccess({
        message: "Se eliminó producto del carrito exitosamente",
        data: result,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al eliminar producto del carrito",
        error: error.message,
      });
    }
  }

  static async updateProductQuantityByCartId(req, res) {
    try {
      let { pid, cid } = req.params;
      cid = Number(cid);
      if (isNaN(cid)){
        throw new Error("El id del carrito tiene que ser de tipo numérico");
      }
      let cartById = await CartService.findOne(cid);
      if (!cartById){
        throw new Error(`No se encontró un carrito con el id ${cid}`);
      }
      const productById = await ProductsService.getOne({ _id: pid });
      if (!productById){
        throw new Error(`No se encontró un producto con el id ${pid}`);
      }
      let listProduct = cartById.products;
      const searchProductByIdInCart = listProduct.find((data) => data._id.toString() === pid);
      if (!isEmpty(searchProductByIdInCart)) {
        listProduct = listProduct.map((item) => {
          if (item._id.toString() !== pid) return item;
          return {
            _id: item._id,
            quantity: item.quantity + parseInt(req.body.quantity),
          };
        });
      } else {
        throw new Error(`El producto con el id ${pid} no se encuentra en el carrito`);
      }

      await CartService.updateOne({ id: cid } , { products: listProduct});
      const result = await CartService.getByIdView(cid);
      return res.sendSuccess({
        message: "Se actualizó la cantidad del producto en el carrito exitosamente",
        data: result,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error en acctualiazr la cantidad del producto en el carrito",
        error: error.message,
      });
    }
  }

  static async updateProductsCartById(req, res) {
    try {
      const { products } = req.body;
      let { cid } = req.params;
      cid = Number(cid);
      if (isNaN(cid)){
        throw new Error("El id del carrito tiene que ser de tipo numérico");
      }

      let cartById = await CartService.findOne(cid);
      if (!cartById){
        throw new Error(`No se encontró un carrito con el id ${cid}`);
      }
      let listProduct = products.map((product) => {
        const { _id, quantity } = product;
        return {
          _id,
          quantity: parseInt(quantity),
        };
      });

      await CartService.updateOne({ id: cid } , { products: listProduct});
      const result = await CartService.getByIdView(cid);
      return res.sendSuccess({
        message: "Se actualizarón los productos en el carrito exitosamente",
        data: result,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al actualizar los productos en el carrito",
        error: error.message,
      });
    }
  }

  static async updateCartBeforeBuy(cid, products) {
    try {
      await CartService.updateOne({ id: cid } , { products: products});
      return true;
    } catch (e) {
      return false;
    }
  }
  
  static async createOrder(req, res) {
    try {
      let { cid, total } = req.params;
      total = JSON.parse(total);
      if (isEmpty(cid) || isEmpty(total)) {
        throw new Error("No hay Productos para generar Ticket");
      }

      let ticket;
      const purchaser = req.user.email;
      const response = await CartService.getByIdView(cid); //getOneView
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

      const payload = {
        products: available,
        purchaser,
        amount: total,
      };

      // descontar stock
      if (available) {
        const user = await UsersService.getOne({ email : purchaser });
        ticket = await TicketsController.createTicket(payload);
        const body = [{ _id: ticket._id }];
        const result = await UsersService.updateTicket(user._id, body);
        available.map(async (e) => {
        console.log("🚀 ~ file: CartController.js:363 ~ CartController ~ available.map ~ e:", e)

          await ProductController.discountStockProduct(e._id, e.quantity);
        });
      }

      const ticketID = JSON.parse(JSON.stringify(ticket._id));

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
        .cookie("ticket", ticketID, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .sendSuccess({ message: "Se realizó la compra, verificar el ticket", noProcedProducts: notAvailable });
    } catch (error) {
      res.sendServerError({ message: error.message });
    }
  }
}
