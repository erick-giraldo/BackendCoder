import UserModel from "../dao/models/users.js";

class SessionsController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error(
          JSON.stringify({ detail: "Todo los campos son obligatorios" })
        );
      }
      const user = await UserModel.findOne({ email }).catch((error) => {
        throw new Error(JSON.stringify({ detail: "Email invallido" }));
      });
      if (!user || user.password !== password) {
        return res.render("login", { error: "Email o password invalido." });
      }
      req.session.user = user;
      res.json({ success: true });
    } catch (error) {
      return res.status(400).json({
        message: "Error al iniciar sesión",
        error: JSON.parse(error.message),
      });
    }
  }

  static async register(req, res) {
    try {
      const {
        body: { first_name, last_name, email, age, occupation, password },
      } = req;

      if (
        !first_name ||
        !last_name ||
        !email ||
        !age ||
        !occupation ||
        !password
      ) {
        throw new Error(
          JSON.stringify({ detail: "Todo los campos son obligatorios" })
        );
      }
      const user = await UserModel.create({
        first_name,
        last_name,
        email,
        age,
        occupation,
        password,
      }).catch((err) => {
        throw new Error(
          JSON.stringify({
            detail:
              "El usuario ya existe o valida que los datos ingresados sean correctos",
          })
        );
      });
      console.log("new user", user);
      res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({
        message: "Error al regitrar usuario",
        error: JSON.parse(error.message),
      });
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
        res.status(200).send('Logout successful');
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
}

export default SessionsController;
