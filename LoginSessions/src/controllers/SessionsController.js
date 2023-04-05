import UserModel from "../dao/models/users.js";

class SessionsController {
  static async login(req, res) {
    const requiredFields = ["email", "password"];
    try {
      // Check if all required fields are present in the request body
      for (const field of requiredFields) {
        if (!req.body[field]) {
          throw new Error(`${field} is a required field.`);
        }
      }
  
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
  
      if (!user || user.password !== password) {
        throw new Error("Invalid email or password.");
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
    try {
      const requiredFields = [
        "first_name",
        "last_name",
        "email",
        "age",
        "occupation",
        "password",
      ];
      const userData = {};
      requiredFields.forEach((field) => {
        if (!req.body[field]) {
          throw new Error(`El campo ${field} es obligatorio`);
        }
        userData[field] = req.body[field];
      });

      const user = await UserModel.create(userData);
      console.log("new user", user);
      res.status(200).json(user);
    } catch (error) {
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
        res.status(200).send("Logout successful");
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
}

export default SessionsController;
