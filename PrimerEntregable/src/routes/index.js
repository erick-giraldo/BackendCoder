import routerProducts from "./productRouter.js";
import cartProducts from './cartRouter.js'
class RouterController {
  static routes(app) {
    app.use("/api/products", routerProducts);
    app.use("/api/carts", cartProducts);
  }
}
 export default RouterController;