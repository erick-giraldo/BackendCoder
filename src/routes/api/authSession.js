import SessionsController from "../../controllers/SessionsController.js";
import {
  validLogin,
  validRegister,
  validForgotPassword,
  validResetPassword
} from "../../middleware/index.js";
import CustomerRouter from "../Router.js";
import passport from 'passport'

export default class AuthRouter extends CustomerRouter {
  init() {
    this.post("/login", ["PUBLIC"], validLogin, SessionsController.login);
    this.post("/register", ["PUBLIC"], validRegister, SessionsController.register);
    this.get("/logout", ["USER", "ADMIN", "PREMIUM"], SessionsController.logout);
    this.post("/forgot-password", ["PUBLIC"], validForgotPassword, SessionsController.forgotPassword);
    this.put("/reset-password", ["PUBLIC"], validResetPassword, SessionsController.resetPassword);
    this.get("/current", ["USER", "ADMIN", "PREMIUM"], SessionsController.current);
    this.get('/github', ["PUBLIC"],  passport.authenticate('github', { scope: [ 'user:email' ] }))
    this.get('/github/callback', ["PUBLIC"], passport.authenticate('github', {
      failureRedirect: '/login',
    }), (req, res) => {
      console.log("User from GitHub:", req.user);
      res.redirect('/products');
    });
  }
}
