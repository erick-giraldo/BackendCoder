import CustomerRouter from '../Router.js'
import {
    authenticateAndAuthorize
  } from "../../middleware/index.js";
import UserController from '../../controllers/UserController.js';

export default class usersRouter extends CustomerRouter {

    init() {

        this.put('/premium/:id', ['ADMIN'], authenticateAndAuthorize,  UserController.updateRoleById)

    }
  }