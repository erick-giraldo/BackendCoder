import fs from "fs";
import empty from "is-empty";
class CartManager {
  constructor(path) {
    this.cart = [];
    this.path = path;
  }
  idCount = 0;

  async getCart() {
    const exist = fs.existsSync(this.path);
    if (exist) {
      return await JSON.parse(fs.readFileSync(this.path, "utf-8"));
    }
    return [];
  }

  async getCartById(id) {
    const getCart = await this.getCart();
    const product = getCart.find((p) => p.id === id);
    if (!product) {
      return false;
    }
    return product;
  }

  async addProductCart(data) {
    const getCart = await this.getCart();
    if (!empty(getCart)) this.cart = getCart;
    data.id = this.idCount++;
    this.cart.push(data);
    fs.writeFileSync(this.path, JSON.stringify(this.cart));
    return `El producto fue agregado exitosamente`;
  }

  async addProductCartById(cid, pid) {
    const getCart = await this.getCart();
    if (!empty(getCart)) this.cart = getCart;
    this.cart = this.cart.map((c) => {
      if (c.id !== cid) return c;
      let products = c.products;
      const productById = products.find((p) => p.product === pid);
      if (!empty(productById)) {
        products = products.map((item) => {
          if (item.product !== pid) return item;
          return {
            ...item,
            quantity: ++item.quantity,
          };
        });
      } else {
        products.push({
          product: pid,
          quantity: 1,
        });
      }
      return {
        ...c,
        products,
      };
    });

    let result = await fs.writeFileSync(this.path, JSON.stringify(this.cart));
    return result;
  }
}
export default CartManager;
