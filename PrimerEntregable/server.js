import express from "express";
import RouterController from "./src/routes/index.js";
/* Creamos constantes para Productos y Carts */

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RouterController.routes(app);

// //Carts
// routerCart.get("/get/:cid/", CartController.getCartsById);
// routerCart.post("/add", CartController.addProduct);
// routerCart.post("/:cid/product/:pid", ProductsController.addProduct);

// routerCart.put("/updateCart/:pid", ProductsController.updateProduct);
// routerCart.delete("/deleteCart/:pid", ProductsController.deleteProduct);

const port = 8080;
const server = app.listen(port, () => {
  console.log(`Servidor ejecutandose en http://localhost:${port}`);
});
server.on("error", (error) => console.log("Error en el servidor: ", error));
