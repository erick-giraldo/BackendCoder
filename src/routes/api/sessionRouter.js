import { Router } from "express";
import passport from "passport";
import SessionController from "../../controllers/SessionsController.js";
import {
  validLogin,
  validRegister,
  validResetPassword,
  loginMiddleware,
  registerMiddleware,
  resetPasswordMiddleware,
  errorMiddleware,
} from "../../middleware/sessionMiddleware.js";
import { authJWTMiddleware } from "../../utils/hash.js";

const sessionRouter = Router()

    .post('/login', validLogin, loginMiddleware, errorMiddleware)
    .post('/register', validRegister, registerMiddleware, errorMiddleware)
    .post('/reset-password', validResetPassword, resetPasswordMiddleware, errorMiddleware)
    .get('/logout', authJWTMiddleware(['admin', 'user', 'logout']), SessionController.logout)
    .get('/current', authJWTMiddleware(['admin', 'user']), SessionController.current)

    .get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }))
    .get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
        req.session.user = req.user
        res.redirect('/products')
         })
      
export default sessionRouter