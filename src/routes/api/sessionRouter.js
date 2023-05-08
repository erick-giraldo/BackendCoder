import { Router } from 'express'
import passport from 'passport'
import SessionController from '../../controllers/SessionsController.js'
import { validLogin, validRegister } from '../../middleware/validFields.js'
import { authJWTMiddleware } from '../../utils/hash.js';

const sessionRouter = Router()

    .post('/login', validLogin, (req, res, next) => {return SessionController.login(req, res)}, (err, req, res, next) => {
          res.status(500).json({ message: err.message });})
    .post('/register', validRegister, (req, res, next) => {return SessionController.register(req, res)}, (err, req, res, next) => {
          res.status(500).json({ message: err.message });})
    .post('/reset-password', SessionController.resetPassword)
    .get('/logout', authJWTMiddleware(['admin', 'user', 'logout']),SessionController.logout)
    .get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }))
    .get('/current', authJWTMiddleware(['admin', 'user']), SessionController.current)
    .get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
        req.session.user = req.user
        res.redirect('/products')
         })
      
export default sessionRouter