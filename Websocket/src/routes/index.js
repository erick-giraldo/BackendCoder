import routerProducts from "./productRouter.js";
import cartProducts from "./cartRouter.js";
import viewRouter from "./view.router.js";
class RouterController {
  static routes(app) {
    app.use("/api/products", routerProducts);
    app.use("/api/carts", cartProducts);
    app.use("", viewRouter);
  }
}
export default RouterController;
