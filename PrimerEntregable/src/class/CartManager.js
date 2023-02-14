import fs from "fs";

class CartManager {
  constructor(path) {
    this.cart = [];
    this.path = path;
  }
  idCount = 0;
  addProductCart(data) {
    let cart = this.getCart();
    if (fs.existsSync(this.path)) {
      let lastId = cart.reduce((maxId, obj) => Math.max(maxId, obj.id), 0);
      const id = lastId + 1;
      this.cart.push({ id: id, products: [ data ] });
      fs.writeFileSync(this.path, JSON.stringify(this.cart));
      return `El producto fue agregado exitosamente al Carrito`;
    }
    const id = this.idCount++;
    this.cart.push({ id: id, products: [ data ] });
    fs.writeFileSync(this.path, JSON.stringify(this.cart));
    return `El producto fue agregado exitosamente al Carrito`;
  }

  getCart() {
    const exist = fs.existsSync(this.path);
    if (exist) {
      return JSON.parse(fs.readFileSync(this.path, "utf-8"));
    }
    return [];
  }

  getCartById(id) {
    const getCart = this.getCart();
    const product = getCart.find((p) => p.id === id);
    if (!product) {
      return "Producto no encontrado";
    }
    return product;
  }
}
export default CartManager;
