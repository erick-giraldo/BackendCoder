import { Router } from 'express'
import passport from 'passport'
import SessionController from '../../controllers/SessionsController.js'

const sessionRouter = Router()

    .post('/login', passport.authenticate('login', { failureRedirect: '/login' }), SessionController.login)
    .post('/register', passport.authenticate('register', { failureRedirect: '/register' }),SessionController.register)
    .post('/reset-password', SessionController.resetPassword)
    .get('/logout', SessionController.logout)

export default sessionRouter