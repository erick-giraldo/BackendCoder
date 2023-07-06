import MailingController from "../../controllers/MailingController.js"
import CustomerRouter from "../Router.js";

export default class AuthRouter extends CustomerRouter {
  init() {
    // this.get("/email", ["USER"], MailingController.email);
    this.get("/sms", ["USER"], MailingController.sms);
    this.get("/thanks", ["USER"], MailingController.thanks);
  }
}
