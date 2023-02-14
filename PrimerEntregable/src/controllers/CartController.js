import CarttManager from "../class/CartManager.js";

const items = new CarttManager("cart.json");

export default class CartController {

  static async getCartsById (req, res){
    let id = JSON.parse(req.params.cid);
    let product = await items.getCartById(id);
    res.send({
      result: product,
    });
  }

  static async addProduct (req, res){
    const data = req.body;
    const exist = await items.getCartById(1)
    console.log("🚀 ~ file: CartController.js:31 ~ CartController ~ addProduct ~ exist", exist)

    return exist
    let result = await items.addProductCart(data);
    res.send({
      result: result,
    });
  }

  static async updateCart(req, res) {
    const idCart = JSON.parse(req.params.pid);
    const idProduct = JSON.parse(req.params.pid);
    let product = await items.updateProducts(idCart, idProduct);
    res.send({
      product: product,
    });
  }

}
