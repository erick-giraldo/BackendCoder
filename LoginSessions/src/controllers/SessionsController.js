import UserModel from "../dao/models/users.js";
import empty from "is-empty";
class SessionsController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Los campos email and password son requeridos",
        });
      }
      let user;
      const isAdminUser =
        email === " " && password === "adminCod3r123";
      if (isAdminUser) {
        user = {
          first_name: "adminCoder",
          rol: "Admin",
          email: "adminCoder@coder.com",
        };
      } else {
        user = await UserModel.findOne({ email });
        if (empty(user) || user.password !== password) {
          return res.status(400).json({
            message:
              "Credenciales invalidas por favor revisar y volver a iniciar sesión",
          });
        }
        user = JSON.parse(JSON.stringify(user))
        user.rol = 'Usuario'
      }
      req.session.user = user;
      res.json({ success: true });
    } catch (error) {
      const errorDetail = error.message;
      return res.status(400).json({
        message: "Error al iniciar sesión",
        error: { detail: errorDetail },
      });
    }
  }

  static async register(req, res) {
    const body = {
      first_name: "Jorge",
      last_name: "Perez",
      email: req.body.email,
      age: 20,
      occupation: "Ingeniero",
      password: req.body.password,
    };

    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "age",
      "occupation",
      "password",
    ];

    try {
      const userData = requiredFields.reduce((data, field) => {
        if (!body[field]) {
          throw new Error(`El campo ${field} es obligatorio`);
        }
        return { ...data, [field]: body[field] };
      }, {});

      const user = await UserModel.create(userData);

      console.log("new user", user);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      const message = error.message || "Error al registrar usuario";
      res.status(400).json({ message, error });
    }
  }

  static async logout(req, res) {
    try {
      // req.session.destroyError = true;
      // if (req.session.destroyError) {
      //   throw new Error('Error al destruir la sesión');
      // }
      req.session.destroy((err) => {
        if (err) throw err;
        res.status(200).send("Cierre de sesión exitoso");
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error del servidor");
    }
  }

  static async addRole(req, res) {
    const { rol } = req.body;
    if (req.session.user) {
      req.session.user.rol = rol;
      res.status(200).json({ message: "Rol agregado a la sessión" });
    } else {
      res.status(400).json({ message: "Ningún usuario en sesión" });
    }
  }
}

export default SessionsController;
