import CartService from "../services/carts.service.js";
import UsersService from "../services/users.service.js";
import {
  tokenGenerator,
  tokenGeneratorPass,
  createHash,
  isValidToken,
} from "../utils/hash.js";
import isEmpty from "is-empty";
import getLogger from "../utils/logger.js";
import MailingController from "./MailingController.js";

const logger = getLogger();

class SessionsController {
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UsersService.getOne({ email });
      const token = tokenGenerator(user);
      await UsersService.updateLastConnection(user._id, new Date());
      res.cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      }).sendSuccess({ access_token: token });

      logger.info(`Usuario ${user.email} logueado correctamente.`);
    } catch (error) {
      logger.error(error);
      return res.sendServerError({ message: "An error occurred during login." });
    }
  };

  static register = async (req, res) => {
    try {
      const createCart = await CartService.create();
      const findCart = await CartService.getById(createCart._id);
      const cartBody = findCart && findCart.id ? [{ _id: createCart._id, id: findCart.id }] : [{ _id: createCart._id, id: 0 }];
      const user = await UsersService.create(req.body);
      const id = user[0]._id;
      await UsersService.updateUserCart(id, cartBody);      
      const userResult = await UsersService.getById(id);
      res.sendSuccess({ message: true, data: userResult });
    } catch (error) {
      return res.sendServerError({ message: "An error occurred during registration." });
    }
  };

  static logout = async (req, res) => {
    try {
      const currentCookie = req.cookies.token;
      const decodeToken = isValidToken(currentCookie);
      
      if (currentCookie) {
        await UsersService.updateLastConnection(decodeToken.id, new Date());
        res.clearCookie("token").sendSuccess({ message: "User has been logged out." });
      } else {
        res.sendSuccess({ message: "User is already logged out." });
      }
    } catch (err) {
      return res.sendServerError({ message: "An error occurred during logout." });
    }
  };

  static forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UsersService.getOne({ email });
      const token = tokenGeneratorPass(user);
      const sendEmail = await MailingController.sendEmailResetPass(email, token);
      console.log("🚀 ~ file: SessionsController.js:71 ~ SessionsController ~ forgotPassword= ~ sendEmail:", sendEmail)

      if (!sendEmail) {
        return res.sendServerError({ message: "Error sending reset password email." });
      }

      logger.info(`Reset password link send successfully.`);
      return res.sendSuccess({ message: "Reset password email send successfully." });
    } catch (error) {
      return res.sendServerError({ message: "An error occurred during forgot password process." });
    }
  };

  static resetPassword = async (req, res) => {
    try {
      if (isEmpty(req.body)) {
        return res.sendServerError({ message: "Email or password is missing." });
      }
      
      const { email, password, token } = req.body;
      const user = await UsersService.getOne({ email});
      const tokens = user.passwordResetTokens.map((tokenObj) => tokenObj.token);
      const tokenExists = tokens.includes(token);
      
      if (tokenExists) {
        return res.sendServerError({ message: "The token has already been used to change the password." });
      }
      
      user.passwordResetTokens.push({
        token: token,
        used: false,
        createdAt: new Date(),
      });
      
      const hashedPassword = createHash(password);
      user.password = hashedPassword;
      await user.save();

      logger.info(`Password changed successfully.`);
      return res.sendSuccess({ message: "Password changed successfully." });
    } catch (error) {
      return res.sendServerError({ message: "An error occurred during password reset." });
    }
  };

  static current = async (req, res) => {
    try {
      const token = req.cookies.token;
      
      if (!token) {
        return res.sendUserError({ message: "Error getting token." });
      }
      
      const { id } = req.user;
      const user = await UsersService.current(id);
      
      if (isEmpty(user)) {
        return res.sendUserError({ message: "Error getting user." });
      }
      
      logger.info(`me: ${JSON.stringify(user)}.`);
      return res.sendSuccess(user);
    } catch (error) {
      return res.sendServerError({ message: "An error occurred while fetching current user." });
    }
  };
}

export default SessionsController;
