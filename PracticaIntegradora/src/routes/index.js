import viewRouter from "./views/view.router.js";
import routerProducts from "./api/productRouter.js"
import cartProducts from "./api/cartRouter.js"
import chatRouter from './views/chat.js'

class RouterController {
  static routes(app) {
    app.use("", viewRouter);
    app.use("/api", routerProducts);
    app.use("/api/carts", cartProducts);
    app.use('/chat', chatRouter)
  }
}
export default RouterController;
