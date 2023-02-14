const express = require("express");
const fs = require("fs");

const app = express();

let nextCartId = 0;
let carts = [];

app.use(express.json());

app.post("/api/carts/", (req, res) => {
  const newCart = {
    id: nextCartId++,
    products: []
  };
  carts.push(newCart);
  fs.writeFileSync("carts.json", JSON.stringify(carts));
  res.status(201).json({
    message: "Cart created",
    cart: newCart
  });
});

app.get("/api/carts/:cid", (req, res) => {
  const cid = req.params.cid;
  const cart = carts.find(cart => cart.id === cid);
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found"
    });
  }
  res.json(cart.products);
});

app.post("/api/carts/:cid/product/:pid", (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = carts.find(cart => cart.id === cid);
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found"
    });
  }
  let productIndex = cart.products.findIndex(
    product => product.product === pid
  );
  if (productIndex === -1) {
    cart.products.push({
      product: pid,
      quantity: 1
    });
  } else {
    cart.products[productIndex].quantity++;
  }
  fs.writeFileSync("carts.json", JSON.stringify(carts));
  res.status(201).json({
    message: "Product added to cart",
    cart: cart
  });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
