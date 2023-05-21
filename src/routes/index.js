import routerProducts from "./api/productRouter.js";
import cartProducts from "./api/cartRouter.js";
import AuthRouter from "./authSession.js";
import viewRouter from "./view/view.router.js";
class RouterController {
  static routes(app) {
    const auth = new AuthRouter();
    const views = new viewRouter();
    const products = new routerProducts();
    const carts = new cartProducts();
    app
      .use("/api/products", products.getRouter())
      .use("/api/carts", carts.getRouter())
      .use("/api/auth", auth.getRouter())
      .use("/", views.getRouter());
  }
}

export default RouterController;
