import ProductManager from "../dao/class/ProductManager.js";
import ProductsModel from "../dao/models/products.js";
import CommonsUtil from '../utils/Commons.js'

// const items = new ProductManager("products.json");

class ViewController {
  static async home(req, res) {
    try {
      const response = await ProductsModel.find().lean();
      return res.render("home", {
        style: "style.css",
        products: response,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar productos",
        error: JSON.parse(err.message),
      });
    }
  }
  static realtimeproducts(req, res) {
    return res.render("realtimeproducts", {
      style: "style.css",
    });
  }

  static async products(req, res) {
    try {
        const { limit = 3, page = 1, sort } = req.query
        const opts = { limit, page }
        if (sort === 'asc' || sort === 'desc') {
          opts.sort = { price: sort }   
        }
      let response = await ProductsModel.paginate({}, opts);
      const newResponse = JSON.stringify(CommonsUtil.buidResponse( response ))
      response = JSON.parse(newResponse)
      console.log("🚀 ~ file: ViewController.js:36 ~ ViewController ~ products ~ response:", response)

      return res.render("products", {
        style: "style.css",
        products: response
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar productos",
        error: JSON.parse(err.message),
      }); 
    }
  }
}

export default ViewController;
