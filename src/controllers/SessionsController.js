import UsersService from "../services/users.service.js";
import { tokenGenerator, createHash } from "../utils/hash.js";

class SessionsController {
  static current = async (req, res) => {
    const token = req.cookies.token;
    if (token) {
      const { id } = req.user;
      const result = await UsersService.getById(id);
      res.status(200).json(result);
    } else {
      return res.status(404).end();
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    const isAdminUser =
      email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
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
      .status(200)
      .json({ success: true, token });
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

    res.status(200).json({ message: true });
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token").status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error del servidor");
    }
  };

  static resetPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await UsersService.getOne(email);
      user.password = createHash(password);

      await UsersService.update(email, user);
      return res.status(200).json({
        success: true,
        message: "Se cambio la contraseña correctamente",
      });
    } catch (error) {
      const errorDetail = error.message;
      return res.status(400).json({
        message: "Error al iniciar sesión",
        error: { detail: errorDetail },
      });
    }
  };
}

export default SessionsController;
