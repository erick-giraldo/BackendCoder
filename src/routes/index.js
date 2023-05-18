import routerProducts from "./api/productRouter.js";
import cartProducts from "./api/cartRouter.js";
import sessionsApiRouter from "./api/sessionRouter.js";
import AuthRouter from "./authSession.js";
import viewRouter from "./view/view.router.js";
class RouterController {
  static routes(app) {
    const auth = new AuthRouter();
    const views = new viewRouter();

    app
      .use("/api/products", routerProducts)
      .use("/api/carts", cartProducts)
      .use("/api/sessions", sessionsApiRouter)
      .use("/api/auth", auth.getRouter())
      .use("/", views.getRouter());
  }
}

export default RouterController;
