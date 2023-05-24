import SessionController from "../../controllers/SessionsController.js";
import CustomerRouter from '../Router.js'
import {
  validLogin,
  validRegister,
  validResetPassword
} from "../../middleware/sessionMiddleware.js";

export default class SessionsRouter extends CustomerRouter {

  init() {
    this.post('/reset-password',  ['USER','ADMIN'], validResetPassword, SessionController.resetPassword)
    this.post('/login' ,['USER'], validLogin, SessionController.login)
    this.post('/register' ,['USER'], validRegister, SessionController.register)
    this.get('/logout' ,['USER'] , SessionController.logout)
    this.get('/current' ,['USER'], SessionController.current)
  }
}