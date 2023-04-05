import { Router } from 'express'
import SessionController from '../../controllers/SessionsController.js'

const sessionRouter = Router()

    .post('/login', SessionController.login)
    .post('/register', SessionController.register)
    .get('/logout', SessionController.logout)

export default sessionRouter