import SessionController from "../../controllers/SessionsController.js";
import CustomerRouter from '../Router.js'
import {
  validLogin,
  validRegister,
  validResetPassword
} from "../../middleware/sessionMiddleware.js";

export default class SessionsRouter extends CustomerRouter {

  init() {
    this.post('/reset-password',  ['PUBLIC'], validResetPassword, SessionController.resetPassword)
    this.post('/login' ,['PUBLIC'], validLogin, SessionController.login)
    this.post('/register' ,['PUBLIC'], validRegister, SessionController.register)
    this.get('/logout' ,['USER','ADMIN'] , SessionController.logout)
    this.get('/current' ,['USER','ADMIN'], SessionController.current)
  }
}
