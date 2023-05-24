import CartService from "../services/carts.service.js";
import UsersService from "../services/users.service.js";
import { tokenGenerator, createHash } from "../utils/hash.js";
import isEmpty from "is-empty"
class SessionsController {
  static current = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(404).json({ success: false, message: "Se produjo un error al obtener token." });
      }
      const { id } = req.user;
        const user = await UsersService.current(id);
      if (isEmpty(user)) {
        return res.status(404).json({ success: false, message: "Se produjo un error al obtener usuario." });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Error en el servidor." });
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;
    const isAdminUser =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;
    let user = isAdminUser
      ? {
        first_name: process.env.ADMIN_NAME,
        last_name: "",
        role: "admin",
        email: process.env.ADMIN_EMAIL,
        password: createHash(process.env.ADMIN_PASSWORD),
      }
      : await UsersService.getOne(email);
    if (!isAdminUser) {
      user = JSON.parse(JSON.stringify(user));
    }

    const token = tokenGenerator(user);
    res
      .cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .sendSuccess({ access_token: token });
  };

  static register = async (req, res) => {
    const user = await UsersService.create(req.body);
    const createCart = await CartService.create()
    const findCart = await CartService.getCartById(createCart._id);
    const cart = [{ _id: createCart._id, id: findCart.id }];
    const result = await UsersService.updateUserCart(user._id, cart);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email or password is incorrect." });
    }
    res.sendSuccess({ message: true });
  };

  static logout = async (req, res) => {
    try {
      if (req.cookies.token) {
        res
          .clearCookie("token")
          .sendSuccess({ message: "El usuario a sido deslogueado." });
      } else {
        res.sendSuccess({ message: "El usuario ya está deslogueado." });
      }
    } catch (err) {
      console.error(err);
      res.sendServerError({ message: `${err} - Error del servidor` });
    }
  };

  static resetPassword = async (req, res) => {
    try {
      const { email, password } = req.body;

      let user = await UsersService.getOne(email);
      if (!user) {
        return res.sendUserError({
          message: "Email or password is incorrect.",
        });
      }
      await UsersService.update(email, { password: createHash(password) });
      return res.sendSuccess({
        message: "Se cambio la contraseña correctamente.",
      });
    } catch (error) {
      const errorDetail = error.message;
      return res.sendServerError({
        message: "Error al iniciar sesión",
        error: { detail: errorDetail },
      });
    }
  }
};


export default SessionsController;
