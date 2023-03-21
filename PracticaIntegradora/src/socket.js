import { Server } from 'socket.io'
import ProductManager from './class/ProductManager.js';
import empty from "is-empty";

const items = new ProductManager("products.json");
import MensajeModel from './models/mensaje.js'

let products= [];

export const init = (httpServer) => {
  const socketServer = new Server(httpServer);
  socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado", socket.id);

    if (empty(products)) {
      products= await items.getProducts();
    }
  
    socketServer.emit("products", products);
    
    socket.on("addProduct", async (data) => {
      const { token, product: prod } = data;
      const productByCode = await items.findProductCode(prod.data);
      if (!empty(productByCode)) {
          return socketServer.emit('notification', {
              type: 'error',
              token,
              message: `El código ${productByCode} ya se encuentra regitrado`
          })
      }
      await items.addProduct(prod);
      const getProducs = await items.getProducts();
      socketServer.emit('productList', getProducs)
      socketServer.emit('notification', {
          type: 'success',
          token,
          message: 'Producto agregado exitosamente'
      })
    });
  
    socket.on("deleteProduct", async (data) => {
      const { token, title, id } = data;
      await items.deleteProductById(title, id);
      products = await items.getProducts();
      socketServer.emit("products", products);
      socketServer.emit("notification", {
        type: "success",
        token,
        message: "Producto eliminado exitosamente",
      });
    });

    socket.on('disconection', () => {
      console.log('Se desconecto el cliente con el id', socket.id)
    })
  });
  

}



export const emit = (mensaje) => {
  io.emit('notification', mensaje)
}