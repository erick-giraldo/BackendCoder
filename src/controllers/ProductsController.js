import isEmpty from "is-empty";
import ProductsService from "../services/products.service.js";
import CommonsUtil from "../utils/Commons.js";
import { isValidToken } from "../utils/hash.js";
export default class ProductController {
  static async getProducts(req, res) {
    try {
      const {
        query: { limit = 3, page = 1 },
      } = req;
      const opts = { limit, page };
      const products = await ProductsService.paginate({}, opts);
      return res.json(CommonsUtil.buidResponse(products));
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
      const productById = await ProductsService.getOne( pid );
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
      const token = await isValidToken(req.cookies.token);
      const newProductData = {
        ...productData,
        owner: token.role === "admin" ? "admin" : token.email,
      };
      await ProductsService.create(newProductData).catch(() => {
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
      let productById = await ProductsService.getOne(pid);
      const token = await isValidToken(req.cookies.token);
      if (token.role === "premium" && token.email !== productById.owner) {
        throw new Error(
          JSON.stringify({
            detail: `El producto fue registrado por otro usuario`,
          })
        );
      }

      await ProductsService.updateOne(pid, productData).catch(() => {
        throw new Error(
          JSON.stringify({ detail: "El tipo de dato no es correcto" })
        );
      });
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
      let { pid } = req.params;
      pid = Number(pid);
      const token = await isValidToken(req.cookies.token);
      let productById = await ProductsService.getOne(pid);
  
      if (token.role === "premium" && token.email !== productById.owner) {
        throw new Error(JSON.stringify( `El producto fue registrado por otro usuario`));
      }
      await ProductsService.deleteById(pid);
      return res.json({
        message: "El producto fue eliminado exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al eliminar el producto",
        error: err.message,
      });
    }
  }

  static async discountStockProduct(pid, qty) {
    try {
      const product = await ProductsService.getById(pid);
      let stock = product.stock;
      stock -= qty;
      const result = await ProductsService.updateOne(product.id, { stock });
      return true;
    } catch (error) {
      return false;
    }
  }
}
