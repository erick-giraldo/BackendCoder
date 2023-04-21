import { Router } from 'express'
import passport from 'passport'
import SessionController from '../../controllers/SessionsController.js'
import { validLogin, validRegister } from '../../middleware/validFields.js'

const sessionRouter = Router()
    // .post('/login', passport.authenticate('login', { failureRedirect: '/login' }), SessionController.login)
    .post('/login', validLogin, (req, res, next) => {
        passport.authenticate('login', { failureRedirect: '/login', passReqToCallback: true }, ( err, user ) => {
            if (err) return res.status(500).json({ message: err.message })
             req.user = user   
             return SessionController.login(req, res)
        })(req, res, next)
    })
    .post('/register', validRegister, (req, res, next) => {
        passport.authenticate('register', { failureRedirect: '/register', passReqToCallback: true }, err => {
            if (err) return res.status(500).json({ message: err.message })
            return SessionController.register(req, res)
        })(req, res, next)
    })
    .post('/reset-password', SessionController.resetPassword)
    .get('/logout', SessionController.logout)
    .get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }))
    .get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
        req.session.user = req.user
        res.redirect('/products')
      });

export default sessionRouter