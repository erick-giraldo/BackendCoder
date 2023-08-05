import { generateProduct } from "../utils/faker/index.js";
import getLogger from "../utils/logger.js";

const logger = getLogger();
export default class TestingMocking {
  static createProduct = (req, res, next) => {
    try {
      const { count = 50 } = req.query;
      let products = [];
      for (let i = 0; i < count; i++) {
        products.push(generateProduct(i));
      }
      res.sendSuccess( { message: "Productos creados" , data: products });
    } catch (error) {
      return res.sendServerError({ message: "An error occurred during registration." });
    }
  };

  static loggerTest = (req, res, next) => {
    try {
      logger.debug("Esto es un mensaje de debug");
      logger.http("Esto es un mensaje de http");
      logger.info("Esto es un mensaje informativo");
      logger.warning("Esto es una advertencia");
      logger.error("Esto es un error");
      logger.fatal("Esto es un error fatal");
      res.sendSuccess({message: "Log's generados"});
    } catch (error) {
      return res.sendServerError({ message: "Se produjo un error al generar los logs." });
    }
  };
}
