import express from "express";
import RouterController from "./src/routes/index.js";
/* Creamos constantes para Productos y Carts */

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RouterController.routes(app);

const port = 8080;
const server = app.listen(port, () => {
  console.log(`Servidor ejecutandose en http://localhost:${port}`);
});
server.on("error", (error) => console.log("Error en el servidor: ", error));
