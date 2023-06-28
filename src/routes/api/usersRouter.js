import CustomerRouter from '../Router.js'
import {
    authenticateAndAuthorize,
    authenticatedUser
  } from "../../middleware/index.js";
import UserController from '../../controllers/UserController.js';

export default class usersRouter extends CustomerRouter {

    init() {

      this.get('/', ['ADMIN', 'PREMIUM'], authenticatedUser, UserController.getAllUsers)
      this.put('/premium/:id', ['ADMIN'], authenticateAndAuthorize,  UserController.updateRoleById)

    }
  }