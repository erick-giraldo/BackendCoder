import UserModel from "../dao/models/users.js";
import {
  tokenGenerator,
  createHash,
  validatePassword,
  authJWTMiddleware,
} from "../utils/hash.js";

class SessionsController {
  static async me(req, res) {
    const token = req.cookies.token
    if(token){
      const { id } = req.user
      const result = await UserModel.findById(id)
      res.status(200).json(result)
    }else{
      return res.status(404).end()
    }
   
  }
  static async login(req, res) {
    const { email } = req.body;
    let user = await UserModel.findOne({ email });
    console.log("🚀 ~ file: SessionsController.js:13 ~ SessionsController ~ login ~ user:", user)
    const token = tokenGenerator(user);
    res
      .cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .status(200)
      .json({ success: true , token});
  }

  static async register(req, res) {
    const {
      body: { email, password },
    } = req;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email or password is incorrect." });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie('token').status(200).json({ success: true })
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
