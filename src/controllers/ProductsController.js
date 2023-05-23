import isEmpty from "is-empty";
import ProductsService from "../services/products.service.js";
import CommonsUtil from '../utils/Commons.js'

export default class ProductController {
  static async getProducts(req, res) {
    try {
      const {
        query: { limit = 3, page = 1 },
      } = req;
      const opts = { limit, page }
      const products = await ProductsService.paginate( {}, opts);
      return res.json(CommonsUtil.buidResponse( products ));
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar productos",
        error: err.message,
      });
    }
  }

  static async getProductById(req, res) {
    try {
      let { pid } = req.params;
      pid = Number(pid);
      if (isNaN(pid)) {
        throw new Error(
          JSON.stringify({ id: "El id tiene que ser de tipo numérico" })
        );
      }
      const productById = await ProductsService.getOne({ id: pid });
      if (!productById)
        return res.status(404).json({ message: "Producto no encontrado" });
      return res.json({
        message: "Producto encontrado",
        data: productById,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al buscar el producto",
        error: JSON.parse(err.message),
      });
    }
  }

  static async addProduct(req, res) {
    try {
      const productData = req.body;
      await ProductsService.create(productData).catch(() => {
        throw new Error(
          JSON.stringify({
            detail: "El tipo de dato no es correcto o el código ya existe",
          })
        );
      });
      return res.json({ message: "El producto fue agregado exitosamente" });
    } catch (err) {
      return res.status(400).json({
        message: "Error al agregar el producto",
        error: JSON.parse(err.message),
      });
    }
  }

  static async updateProduct(req, res) {
    try {
      let { pid } = req.params;
      const productData = req.body;
      await ProductsService.updateOne( pid , productData ).catch(
        () => {
          throw new Error(
            JSON.stringify({ detail: "El tipo de dato no es correcto" })
          );
        }
      );
      return res.json({
        message: "El producto fue actualizado exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al actualizar el producto",
        error: JSON.parse(err.message),
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      await ProductsService.deleteById( pid );
      return res.json({
        message: "El producto fue eliminado exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al buscar el producto",
        error: JSON.parse(err.message),
      });
    }
  }

  static async discountStockProduct(pid , qty) {
   try {
    const product = await ProductsService.getById(pid)
    let stock = product.stock
    stock -= qty
    const result = await ProductsService.updateOne( product.id , { stock } )
    return true
   } catch (error) {
    return false
   }

  }

  static a
}
