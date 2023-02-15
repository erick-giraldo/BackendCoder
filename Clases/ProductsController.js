import ProductManager from "./ProductManager.js";

const items = new ProductManager("products.json");

export default class ProductsControllers {
  static async getProducts(req, res) {
    let limit = req.query.limit;
    let products = await items.getProducts();
    if (limit) {
      res.send({
        products: products.slice(0, limit),
      });
    } else {
      res.send({
        products: products,
      });
    }
  }

  static async getProductsById (req, res){
    let id = JSON.parse(req.params.pid);
    let product = await items.getProductById(id);
    res.send({
      product: product,
    });
  }
}
