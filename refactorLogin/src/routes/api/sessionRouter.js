import { Router } from 'express'
import passport from 'passport'
import SessionController from '../../controllers/SessionsController.js'
import { validRegister } from '../../middleware/validFields.js'

const sessionRouter = Router()
    .post('/login', passport.authenticate('login', { failureRedirect: '/login' }), SessionController.login)
    .post('/register', validRegister, (req, res, next) => {
        passport.authenticate('register', { failureRedirect: '/register', passReqToCallback: true }, err => {
            if (err) return res.status(500).json({ message: err.message })
            return SessionController.register(req, res)
        })(req, res, next)
    })
    .post('/reset-password', SessionController.resetPassword)
    .get('/logout', SessionController.logout)

export default sessionRouter