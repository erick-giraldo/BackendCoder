import express from "express";
import ProductManager from "./ProductManager.js";
const app = express();

app.get("/products", (req, res) => {
  let limit = req.query.limit;
  const items = new ProductManager("products.json");
  let products = items.getProducts();
  if (limit) {
    res.send({
      products: products.slice(0, limit),
    });
  } else {
    res.send({
      products: products,
    });
  }
});

app.get("/products/:pid", (req, res) => {
  let id = JSON.parse(req.params.pid);
  const items = new ProductManager("products.json");
  let product = items.getProductById(id);
  res.send({
    product: product,
  });
});

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Servidor ejecutandose en http://localhost:${port}`);
});
server.on('error', error => console.log('Error en el servidor: ', error))