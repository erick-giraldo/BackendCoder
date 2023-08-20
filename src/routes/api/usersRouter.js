import CustomerRouter from "../Router.js";
import {
  authenticateChangeRole,
  authenticatedUser,
  validateDeleteUser
} from "../../middleware/index.js";
import UserController from "../../controllers/UserController.js";

export default class usersRouter extends CustomerRouter {
  init() {
    this.get("/", ["ADMIN"], authenticatedUser, UserController.getAllUsers);
    this.put("/premium/:id", ["ADMIN","USER", "PREMIUM"], authenticateChangeRole, UserController.updateRoleById);
    this.post("/:id/documents", ["ADMIN","USER"], UserController.uploadDocuments);
    this.delete("/delete", ["ADMIN"], UserController.deleteInactiveUsers);
    this.delete("/delete/:id", ["ADMIN"], validateDeleteUser, UserController.deleteUserByID);
  }
}
