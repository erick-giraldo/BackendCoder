import { Server } from "socket.io";
import ProductManager from "./dao/class/ProductManager.js";
import empty from "is-empty";
import ProductModel from "./dao/models/products.js";
import MensajeModel from "./dao/models/mensaje.js";

let products = [];

export const init = (httpServer) => {
  const socketServer = new Server(httpServer);
  socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado", socket.id);

    socket.on("new-message", async (data) => {
      const mensaje = await MensajeModel.create(data);
      socketServer.emit("notification", mensaje);
    });

    if (empty(products)) {
      products = await ProductModel.find();
    }
    socketServer.emit("products", products);

    socket.on("addProduct", async (data) => {
      const { token, product: prod } = data;
      const productByCode =  await ProductModel.findOne({ code: prod.code })
      if (!empty(productByCode)) {
        return socketServer.emit("notification", {
          type: "error",
          token,
          message: `El código ${productByCode} ya se encuentra regitrado`,
        });
      }
      await ProductModel.create(prod);
      const getProducs = await ProductModel.find();
      socketServer.emit("productList", getProducs);
      socketServer.emit("notification", {
        type: "success",
        token,
        message: "Producto agregado exitosamente",
      });
    });

    socket.on("deleteProduct", async (data) => {
      console.log("🚀 ~ file: socket.js:45 ~ socket.on ~ data:", data)
      const { token, id } = data;
      await ProductModel.deleteOne({ id })
      products =  await ProductModel.find();
      socketServer.emit("products", products);
      socketServer.emit("notification", {
        type: "success",
        token,
        message: "Producto eliminado exitosamente",
      });
    });

    socket.on("disconection", () => {
      console.log("Se desconecto el cliente con el id", socket.id);
    });
  });
};

export const emit = (mensaje) => {
  io.emit("notification", mensaje);
};
