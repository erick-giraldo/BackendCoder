import UserModel from "../dao/models/users.js";
import { createHash, validatePassword } from "../utils/hash.js";

class SessionsController {
  static async login(req, res) {
    req.session.user = req.user;
    res.status(200).json({ messaje: "ok" });
  }

  static async register(req, res) {
    res.redirect("/login");
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

  static async resetPassword(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Los campos email and password son requeridos",
        });
      }
      let user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "Email invalido por favor revisar",
        });
      }
      user.password = createHash(password);
      await UserModel.updateOne({ email }, user);
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
  }
}

export default SessionsController;
