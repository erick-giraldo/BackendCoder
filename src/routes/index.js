import productsRouter from "./api/productRouter.js";
import cartProducts from "./api/cartRouter.js";
import AuthRouter from "./authSession.js";
import viewRouter from "./view/view.router.js";
import mailRouter from "./api/mailRouter.js"
import SessionsRouter from './api/sessionRouter.js'
import usersRouter from "./api/usersRouter.js";
class RouterController {
  static routes(app) {
    const auth = new AuthRouter();
    const views = new viewRouter();
    const products = new productsRouter();
    const carts = new cartProducts();
    const mail = new mailRouter();
    const session = new SessionsRouter();
    const users = new usersRouter();
    app
      .use("/api/products", products.getRouter())
      .use("/api/sessions", session.getRouter())
      .use("/api/carts", carts.getRouter())
      .use("/api/auth", auth.getRouter())
      .use("/api/message", mail.getRouter())
      .use("/", views.getRouter())
      .use("/api/users", users.getRouter());
  }
}

export default RouterController;
