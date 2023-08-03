import CartService from "../services/carts.service.js";
import UsersService from "../services/users.service.js";
import {
  tokenGeneratorPass,
  tokenGenerator,
  createHash,
  isValidToken
} from "../utils/hash.js";
import isEmpty from "is-empty";
import getLogger from "../utils/logger.js";
import MailingController from "./MailingController.js";

const logger = getLogger();
class SessionsController {
  static current = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(404).json({
          success: false,
          message: "Se produjo un error al obtener token.",
        });
      }
      const { id } = req.user;
      const user = await UsersService.current(id);
      if (isEmpty(user)) {
        return res.status(404).json({
          success: false,
          message: "Se produjo un error al obtener usuario.",
        });
      }
      logger.info(`me: ${JSON.stringify(user)}.`);
      return res.send({status:"success",data:user})
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Error en el servidor." });
    }
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await UsersService.getOne(email);
      user = JSON.parse(JSON.stringify(user));
      const token = tokenGenerator(user);
      await UsersService.updateLastConnection(user._id,  new Date() );
      res
        .cookie("token", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .sendSuccess({ access_token: token });
      logger.info(`Usuario ${user.email} logueado correctamente.`);
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Error en el servidor." });
    }
  };

  static register = async (req, res) => {
    try {
      const createCart = await CartService.create();
      const findCart = await CartService.getCartById(createCart._id);
      let cartBody;
      if (findCart && findCart.id) {
        cartBody = [{ _id: createCart._id, id: findCart.id }];
      } else {
        cartBody = [{ _id: createCart._id, id: 0 }];
      }
      let user = await UsersService.create(req.body);
      const id = user[0]._id;
      const updateCart = await UsersService.updateUserCart(id, cartBody);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Email or password is incorrect." });
      }
      res.sendSuccess({ message: true });
    } catch (error) {
      const errorDetail = error.message;
      return res.sendServerError({
        message: "Error al crear usuario sesión",
        error: { detail: errorDetail },
      });
    }
  };

  static logout = async (req, res) => {
    try {
       const currentCookie = req.cookies.token
       const decodeToken = isValidToken(currentCookie)
      if (currentCookie) {
        await UsersService.updateLastConnection(decodeToken.id,  new Date() );
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

  static forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UsersService.getOne(email);
      const token = tokenGeneratorPass(user);
      const sendEmail = await MailingController.sendEmailResetPass(email, token);
      if (!sendEmail) {
        return res.sendServerError({
          message: "Error al enviar el correo electrónico.",
        });
      }
      logger.info(`Link de restablecimiento enviado exitosamente.`);
      return res.sendSuccess({
        message: "Correo electrónico enviado exitosamente.",
      });
    } catch (error) {
      const errorDetail = error.message;
      return res.sendServerError({
        message: "Error al generar link de restablecimiento.",
        error: { detail: errorDetail },
      });
    }
  };

  static resetPassword = async (req, res) => {
    try {
      if (isEmpty(req.body)) {
        return res.sendServerError({
          message: "No existe email o password.",
        });
      }
      const { email, password, token } = req.body;
      const user = await UsersService.getOne(email);
      // Verifica si el token ya se ha utilizado antes
      const tokens = user.passwordResetTokens.map((tokenObj) => tokenObj.token);
      const tokenExists = tokens.includes(token);
      if (tokenExists) {
        return res.sendServerError({
          message: "El token ya ha sido utilizado para cambiar la contraseña.",
        });
      }
      // Agrega el token generado al historial de tokens del usuario
      user.passwordResetTokens.push({
        token: token,
        used: false,
        createdAt: new Date(),
      });
      const hashedPassword = createHash(password);
      user.password = hashedPassword;
      await user.save();
      logger.info(`Contraseña cambiada exitosamente.`);
      return res.sendSuccess({
        message: "Se cambió la contraseña correctamente.",
      });
    } catch (error) {
      const errorDetail = error.message;
      return res.sendServerError({
        message: error,
        error: { detail: errorDetail },
      });
    }
  };
}

export default SessionsController;
