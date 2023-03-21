import viewRouter from "./view.router.js";
import routerProducts from "../api/productRouter.js"
class RouterController {
  static routes(app) {
    app.use("", viewRouter);
    app.use("/api", routerProducts);
  }
}
export default RouterController;
