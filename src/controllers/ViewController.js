import ProductsService from "../services/products.service.js";
import CartService from "../services/carts.service.js";
import CommonsUtil from "../utils/Commons.js";
import isEmpty from "is-empty";
import UsersService from "../services/users.service.js";
import ProductController from "../controllers/ProductsController.js";
import CartController from "./CartController.js";

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
      const cartById = await CartService.getById(cid);
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

      const newResponse = JSON.stringify(CommonsUtil.buidResponse(response));
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

  static async getCart(req, res) {
    try {
      const user = req.user;
      let { cid } = req.params;
      cid = Number(cid);
      if (isNaN(cid))
        throw new Error(
          JSON.stringify({ detail: "El id tiene que ser de tipo numérico" })
        );

      const cartById = await CartService.getOne(cid);
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

      const total = newProducts
        .filter((product) => !product.disable)
        .reduce(
          (accumulator, current) => accumulator + Number(current.totalPrice),
          0
        )
        .toFixed(2);
      const selectedProducts = newProducts.filter(
        (product) => !product.disable
      );
        const url = user.cart[0].id;
      return res.render("cart", {
        style: "style.css",
        products: newProducts,
        total,
        path: url
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
      let cid =
        !isEmpty(req.user) && !isEmpty(req.user.cart) ? req.user.cart[0].id : 0;
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

  static async login(req, res) {
    return res.render("login", { style: "style.css" });
  }

  static async profile(req, res) {
    try {
      const user = req.user;
      return res.render("profile", {
        style: "style.css",
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
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

  static async mailling(req, res) {
    res.send(`
    <div>
      <h1>Hello world!</h1>
      <ul>
        <li><a href="/api/message/email">Send email</a></li>
        <li><a href="/api/message/sms">Send SMS</a></li>
        <li><a href="/api/message/thanks">Send SMS Whit Params</a></li>
      </ul>
    </div>
    `);
  }

  static resetPassword = async (req, res) => {
    console.log("token", req.cookies.token);
    if (req.cookies.token) {
      res.send(`
      <div>
        <h1>Reset password 🛅</h1>
        <form action="/new-password" method="POST">
          <input type="email" name="email" placeholder="Email" />
          <button type="submit">Send</button>
        </form>
      </div>
      `);
    } else {
      res.send(`
    <div>
      <h1>No puedes estar acá 😥</h1>
    </div>
    `);
    }
  };
}
