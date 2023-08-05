import isEmpty from "is-empty";
import ProductsService from "../services/products.service.js";
import CommonsUtil from "../utils/commons.js";
import { isValidToken } from "../utils/hash.js";
import UsersService from "../services/users.service.js";
import MessageController from "./MailingController.js";

export default class ProductController {
  static async getProducts(req, res) {
    try {
      const { limit = 3, page = 1 } = req.query;
      const paginationOptions = { limit, page };
      const products = await ProductsService.paginate({}, paginationOptions);
      return res.sendSuccess(CommonsUtil.buildResponse(products));
    } catch (error) {
      return res.sendUserError({
        message: "Error al listar productos",
        error: error.message,
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const { pid } = req.params;
      const productById = await ProductsService.getOne({ _id: pid });
      if (!productById) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      return res.sendSuccess({
        message: "Producto encontrado",
        data: productById,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al buscar el producto",
        error: error.message,
      });
    }
  }

  static async addProduct(req, res) {
    try {
      const productData = req.body;
      const token = await isValidToken(req.cookies.token);
      const owner = token.role === "premium" ? token.email : "admin";
      const existingProduct = await ProductsService.getOne({
        code: productData.code,
      });
      if (existingProduct) {
        throw new Error("El código del producto ya se encuentra registrado");
      }
      const newProductData = { ...productData, owner };
      const result = await ProductsService.create(newProductData);
      return res.sendSuccess({
        message: "El producto fue agregado exitosamente",
        data: result,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al agregar el producto",
        error: error.message,
      });
    }
  }

  static async updateProduct(req, res) {
    try {
      let { pid } = req.params;
      const productData = req.body;
      let productById = await ProductsService.getOne({ _id: pid });
      const token = await isValidToken(req.cookies.token);
      if (token.role === "premium" && token.email !== productById.owner) {
        throw new Error("El producto fue registrado por otro usuario");
      }
      await ProductsService.updateOne(pid, productData);
      const result = await ProductsService.getOne({ _id: pid });
      return res.sendSuccess({
        message: "El producto fue actualizado exitosamente",
        data: result,
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al actualizar el producto",
        error: error.message,
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      const token = await isValidToken(req.cookies.token);
      const productById = await ProductsService.getOne({ _id: pid });
      if (token.role === "premium" && token.email !== productById.owner) {
        throw new Error("El producto fue registrado por otro usuario");
      }

      const userDetails = await UsersService.getOne(productById.owner);
      const deleteProduct =  await ProductsService.deleteById({ _id: pid });
      if ( deleteProduct && !isEmpty(userDetails) && userDetails.role === "premium") {
        const fullName = `${userDetails.first_name} ${userDetails.last_name}`;
        const sendEmail = await MessageController.sendEmailDeleteProduct(
          userDetails.email,
          fullName,
          productById.name
        );
        if (!sendEmail) {
          throw new Error(
            JSON.stringify({ detail: "Ocurrió un error al enviar el correo" })
          );
        }
      }
      return res.sendSuccess({
        message: "El producto fue eliminado exitosamente",
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al eliminar el producto",
        error: error.message,
      });
    }
  }

  static async discountStockProduct(pid, qty) {
    try {
      const product = await ProductsService.getById(pid);
      let stock = product.stock;
      stock -= qty;
      await ProductsService.updateOne(product.id, { stock });
      return true;
    } catch (error) {
      return false;
    }
  }
}
