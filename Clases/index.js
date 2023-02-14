import express from "express";
import ProductsControllers from "./productsController.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", ProductsControllers.getProducts);
app.get("/products/:pid", ProductsControllers.getProductsById);

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Servidor ejecutandose en http://localhost:${port}`);
});
server.on("error", (error) => console.log("Error en el servidor: ", error));
