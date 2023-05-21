import UsersService from "../services/users.service.js";
import { tokenGenerator, createHash } from "../utils/hash.js";
import isEmpty from "is-empty"
class SessionsController {
  static current = async (req, res) => {
    const token = req.cookies.token;
    try {
      if (token) {
        const { id } = req.user;
        const user = await UsersService.getById(id);

        if (!isEmpty(user)) {
          const userDto = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            createdAt: user.createdAt
          };
          return res.status(200).json(userDto);
        } else {
          return res.status(404).json({ success: false, message: "Se produjo un error." });
        }
      } else {
        return res.status(404).json({ success: false, message: "Se produjo un error." });
      }
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
    const body = {
      first_name: "Jorge",
      last_name: "Perez",
      email: req.body.email,
      age: 20,
      occupation: "Ingeniero",
      role: req.body.role,
      password: createHash(req.body.password),
    };

    const user = await UsersService.create(body);

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
