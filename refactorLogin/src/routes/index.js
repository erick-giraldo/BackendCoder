import routerProducts from "./api/productRouter.js"
import cartProducts from "./api/cartRouter.js"
import viewRouter from "./view/view.router.js";
import sessionsApiRouter from "./api/sessionRouter.js";
import passport from 'passport';

class RouterController {
  static routes(app) {
    app
    .use("", viewRouter)
    .use("/api/products", routerProducts)
    .use("/api/carts", cartProducts)
    .use("/api/sessions", sessionsApiRouter)    
  }
}
export default RouterController;
