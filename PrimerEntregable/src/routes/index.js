import routerProducts from "./productRouter.js";

class RouterController {
  static routes(app) {
    app.use("/api/products", routerProducts);
    // app.use("/api/carts", routerCarts);
  }
}
 export default RouterController;