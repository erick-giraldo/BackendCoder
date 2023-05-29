import SessionsController from "../controllers/SessionsController.js";
import {
  validResetPassword,
  validLogin,
  validRegister,
} from "../middleware/index.js";
import CustomerRouter from "./Router.js";

export default class AuthRouter extends CustomerRouter {
  init() {
    this.post("/login", ["PUBLIC"], validLogin, SessionsController.login);
    this.post("/register", ["PUBLIC"], validRegister, SessionsController.register);
    this.get("/logout", ["USER", "ADMIN"], SessionsController.logout);
    this.post("/reset-password", ["PUBLIC"], validResetPassword, SessionsController.resetPassword);
    this.get("/current", ["USER", "ADMIN"], SessionsController.current);
  }
}
