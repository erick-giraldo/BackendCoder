import express from "express";
import cors from "cors";
import ProductsControllers from "./productsController.js";
const app = express();
//enables cors
app.use(
  cors({
    allowedHeaders: [
      "sessionId",
      "Content-Type",
      "authorization",
      "authorization_user_id",
      "appsecret",
    ],
    exposedHeaders: ["sessionId"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({ limit: "50mb", parameterLimit: 100000, extended: true })
);

app.get("/products", ProductsControllers.getProducts);
app.get("/products/:pid", ProductsControllers.getProductsById);

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Servidor ejecutandose en http://localhost:${port}`);
});
server.on("error", (error) => console.log("Error en el servidor: ", error));
