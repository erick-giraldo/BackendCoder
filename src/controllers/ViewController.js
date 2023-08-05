import ProductsService from "../services/products.service.js";
import CartService from "../services/carts.service.js";
import UsersService from "../services/users.service.js";
import CommonsUtil from "../utils/commons.js";
import isEmpty from "is-empty";
import TicketsController from "./TicketsController.js";
import moment from "moment";
export default class ViewController {
  static async home(req, res) {
    try {
      const response = await ProductsService.get();
      return res.render("home", {
        style: "style.css",
        products: response,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar productos",
        error: JSON.parse(err.message),
      });
    }
  }

  static realtimeproducts(req, res) {
    return res.render("realtimeproducts", {
      style: "style.css",
    });
  }

  static async products(req, res) {
    const user = req.user;
    const cid = isEmpty(user.cart) ? "0" : user.cart[0].id;
    let totalItems = 0;
    try {
      const { query } = req;
      const { limit = 3, page = 1, sort } = query;
      const opts = { limit, page };
      if (sort === "asc" || sort === "desc") {
        opts.sort = { price: sort };
      }
      let response = await ProductsService.paginate(
        CommonsUtil.getFilter(query),
        opts
      );
      const cartById = await CartService.getByIdView(cid);
      if (!isEmpty(cartById)) {
        totalItems = cartById.products.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
      }
      const path =
        !isEmpty(user) && !isEmpty(user.cart)
          ? `/cart/${user.cart[0].id}`
          : "#";

      const newResponse = JSON.stringify(CommonsUtil.buildResponse(response));
      response = JSON.parse(newResponse);
      return res.render("products", {
        style: "style.css",
        products: response,
        cartItems: JSON.stringify(totalItems),
        email: user.email,
        user: {
          name: user.name,
          email: user.email,
          occupation: user.occupation,
          role: user.role,
          age: user.age,
          cart: path,
          avatar:
            user.avatar || "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
        },
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar productos",
        error: err.message,
      });
    }
  }

  static async usersAdmin(req, res) {
    try {
      const user = req.user;
      const data = await UsersService.get();
  
      if (!data || data.length === 0) {
        throw new Error(JSON.stringify({ detail: "No se encontraron usuarios" }));
      }
  
      const newData = data.map((obj) => {
        const documents = obj.documents.map((doc) => {
          if (typeof doc === 'object') {
            return JSON.stringify(doc);
          }
          return { doc };
        });
  
        return { ...obj, newDocuments: documents };
      });
  
      const path = !isEmpty(user) && !isEmpty(user.cart)
        ? `/cart/${user.cart[0].id}`
        : "#";
  
      return res.render("users-admin", {
        style: "style.css",
        data: newData,
        user: {
          name: user.name,
          email: user.email,
          occupation: user.occupation,
          role: user.role,
          age: user.age,
          cart: path,
          avatar: user.avatar || "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
        },
      });
    }catch (err) {
      return res.status(400).json({
        message: "Error al listar productos",
        error: err.message,
      });
    }
  }


  static async getCart(req, res) {
    try {
      const user = req.user;
      const url = user.cart[0].id;
      let { cid } = req.params;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({ detail: "El id tiene que ser de tipo numérico" })
        );

      const cartById = await CartService.getOneView(cid);
      if (isEmpty(cartById))
        return res.status(404).json({ message: "Carrito no encontrado" });

      const newProducts = [];

      for (const product of cartById.products) {
        const productData = await ProductsService.getById(product._id);
        const newProduct = {
          ...product._id._doc,
          quantity: product._doc.quantity,
          totalPrice: (product._doc.quantity * product._id.price).toFixed(2),
        };

        if (productData.stock >= product._doc.quantity) {
          newProduct.disable = false;
        } else {
          newProduct.disable = true;
          newProduct.stockMessage = `La cantidad es mayor al stock disponible, cantidad disponible : ${newProduct.stock}`;
        }

        newProducts.push(newProduct);
      }

      newProducts.sort((a, b) => {
        if (a.disable && !b.disable) {
          return 1;
        }
        if (!a.disable && b.disable) {
          return -1;
        }
        return 0;
      });
      const subtotal = newProducts
        .filter((product) => !product.disable)
        .reduce(
          (accumulator, current) => accumulator + Number(current.totalPrice),
          0
        );

      const igv = subtotal * 0.18; // IGV peruano (18%)
      const shippingCost = !isEmpty(newProducts) ? 50 : 0; // Gastos de envío (50)

      const total = (subtotal + igv + shippingCost).toFixed(2);

      return res.render("cart", {
        style: "style.css",
        products: newProducts,
        subtotal: subtotal.toFixed(2),
        igv: igv.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        total,
        path: url,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al mostrar Carrito",
        error: err.message,
      });
    }
  }

  static async addProductById(req, res) {
    try {
      const { pid } = req.params;
      const arrayPid = [pid];
      const quantityProducts = arrayPid.length;
      const cid = req.user.cart[0].id;
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
      let listProduct = cartById.products;
      const existingProduct = listProduct.find(
        (item) => item._id.toString() === pid
      );

      if (productById.stock < quantityProducts) {
        return res.status(400).json({
          message: `El producto ${productById.name} no cuenta con suficiente stock`,
        });
      }
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

  static async login(req, res) {
    return res.render("login", { style: "style.css" });
  }

  static async profile(req, res) {
    try {
      const user = req.user;
      return res.render("profile", {
        style: "style.css",
        user: {
          id:user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          avatar:
            user.avatar || "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
        },
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar perfil",
        error: JSON.parse(err.message),
      });
    }
  }

  static async invoice(req, res) {
    try {
      const user = req.user;
      const ticketId = req.cookies.ticket;
      const ticket = await TicketsController.getTicketById(ticketId);
      let amount = ticket.amount;
      const products = ticket.products.map((p) => {
        return {
          name: p._id.name,
          code: p._id.code,
          quantity: p.quantity,
          price: p._id.price,
        };
      });
      const shippingCost = 50; // Gastos de envío (50)
      const amountShip = amount - shippingCost;
      const igvPercentage = 0.18; // IGV en Perú (18%)
      const subTotal = amountShip / (1 + igvPercentage);
      const igv = subTotal * igvPercentage;

      return res.render("invoice", {
        style: "invoice.css",
        subTotal,
        igv,
        shippingCost,
        amount,
        products,
        code: ticket.code,
        date: moment(ticket.purchase_datetime).format("MMMM Do YYYY"),
        user: user.name,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar productos",
        error: JSON.parse(err.message),
      });
    }
  }

  static async mailling(req, res) {
    res.send(`
    <div>
      <h1>Hello world!</h1>
      <ul>
        <li><a href="/api/message/sms">Send SMS</a></li>
        <li><a href="/api/message/thanks">Send SMS Whit Params</a></li>
      </ul>
    </div>
    `);
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.user;
      const { token } = req.query;
      return res.render("forgotPassword", {
        style: "resetPassword.css",
        email: email,
        token
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al actualizar contraseña",
        error: JSON.parse(err.message),
      });
    }
  }
}
