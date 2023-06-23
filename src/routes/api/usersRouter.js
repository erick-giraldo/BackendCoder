import CustomerRouter from '../Router.js'

import UserController from '../../controllers/UserController.js';

export default class usersRouter extends CustomerRouter {

    init() {

        this.put('/premium/:id', ['ADMIN'], UserController.updateRoleById)

    }
  }