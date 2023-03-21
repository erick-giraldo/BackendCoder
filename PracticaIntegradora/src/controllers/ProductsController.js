import ProductManager from "../class/ProductManager.js";
import { getEmptyProperties } from "../utils/index.js";
import ProductsModel from "../models/products.js"
import empty from "is-empty";

const items = new ProductManager("products.json");
export default class ProductsControllers {
  static async getProducts(req, res) {
    let limit = req.query.limit;
    // let products = await items.getProducts();
    let products = await ProductsModel.find();
    console.log("🚀 ~ file: ProductsController.js:12 ~ ProductsControllers ~ getProducts ~ products:", products)
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

  static async getProductById(req, res) {
    try {
      let error = {};
      let id = JSON.parse(req.params.pid);
      let result = await items.getProductById(id);
      if (!result) {
        error = {
          message: `No se encuentra Producto con el id ${id}`,
        };
        throw new Error(JSON.stringify({ error }));
      }
      return res.json({
        message: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Error al buscar Carrito",
        error: JSON.parse(error.message),
      });
    }
  }

  static async addProduct(req, res) {
    try {
      let error = {};
      const data = req.body;
      const emptyProperties = getEmptyProperties(data);
      if (emptyProperties.length > 0) {
        error = {
          message: `Error, las siguientes propiedades están vacías: ${emptyProperties.join(
            ", "
          )}, por favor verifique y vuelva a intentar`,
        };
      }
      if (!empty(error)) {
        throw new Error(JSON.stringify(error));
      }
      const getCode = await items.findProductCode(data.code);
      if (!empty(getCode)) {
        error = {
          message: `El código ${data.code} ya se enccuentra registrado, porfavor verifique y intente nuevamente`,
        };
        throw new Error(JSON.stringify({ error }));
      }
      let result = await items.addProduct(data);
      return res.json({
        message: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Error al agregar el producto",
        error: JSON.parse(error.message),
      });
    }
  }

  static async updateProduct(req, res) {
    try {
      let error = {};
      const id = JSON.parse(req.params.pid);
      const data = req.body;
      const getProducts = await items.getProducts();
      const existProduct = getProducts.find((p) => p.id === id);
      if (empty(existProduct)) {
        error = {
          message: `El producto no fue encontrado `,
        };
        throw new Error(JSON.stringify({ error }));
      }
      let result = await items.updateProducts(id, data);
      return res.json({
        message: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Error al agregar el producto",
        error: JSON.parse(error.message),
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      let error = {};
      const id = JSON.parse(req.params.pid);
      const getProducts = await items.getProducts();
      const existProduct = getProducts.find((p) => p.id === id);
      if (empty(existProduct)) {
        error = {
          message: `El producto no fue encontrado `,
        };
        throw new Error(JSON.stringify({ error }));
      }
      let product = await items.deleteProductById(id);
      res.send({
        product: product,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Error al agregar el producto",
        error: JSON.parse(error.message),
      });
    }
  }
}
