import express from "express";
import RouterController from "./routes/index.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import empty from "is-empty";

import ProductManager from './class/ProductManager.js';


const items = new ProductManager("products.json");

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RouterController.routes(app);

const port = 8080;
const server = app.listen(port, () => {
  console.log(`Servidor ejecutandose en http://localhost:${port}`);
});
server.on("error", (error) => console.log("Error en el servidor: ", error));

let products= [];

const socketServer = new Server(server);
socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  if (empty(products)) {
    products= await items.getProducts();
  }

  socketServer.emit("products", products);

  socket.on("addProduct", async (data) => {
    const { user, product: prod } = data;
    const findProductCode = await items.findProductCode(prod.code);
    if (!empty(findProductCode)) {
      return socketServer.emit("notification", {
        type: "error",
        user,
        message: `El código ${prod.code} ya se enccuentra registrado, porfavor verifique y intente nuevamente`,
      });
    }
    await items.addProduct(prod);
    products = await items.getProducts();
    socketServer.emit("products", products);
    socketServer.emit("notification", {
      type: "success",
      user,
      message: "Producto agregado exitosamente",
    });
  });

  socket.on("deleteProduct", async (data) => {
    const { user, id } = data;
    await items.deleteProductById(id);
    products = await items.getProducts();
    socketServer.emit("products", products);
    socketServer.emit("notification", {
      type: "success",
      user,
      message: "Producto eliminado exitosamente",
    });
  });
});
