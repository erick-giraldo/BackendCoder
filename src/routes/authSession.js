import SessionsController from "../controllers/SessionsController.js";
import {
  validLogin,
  validRegister,
  validForgotPassword,
  viewResetPassword
} from "../middleware/index.js";
import CustomerRouter from "./Router.js";

export default class AuthRouter extends CustomerRouter {
  init() {
    this.post("/login", ["PUBLIC"], validLogin, SessionsController.login);
    this.post("/register", ["PUBLIC"], validRegister, SessionsController.register);
    this.get("/logout", ["USER", "ADMIN"], SessionsController.logout);
    this.post("/forgot-password", ["PUBLIC"], validForgotPassword, SessionsController.forgotPassword);
    this.put("/reset-password", ["PUBLIC"], viewResetPassword, SessionsController.resetPassword);
    this.get("/current", ["USER", "ADMIN"], SessionsController.current);
  }
}
