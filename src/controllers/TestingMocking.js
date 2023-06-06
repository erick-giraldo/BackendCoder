import { generateProduct } from "../utils/faker/index.js";
import getLogger  from "../utils/logger.js";

export default class TestingMocking {
  static createProduct = (req, res, next) => {
    try {
      const { count = 50 } = req.query;
      let products = [];
      for (let i = 0; i < count; i++) {
        products.push(generateProduct(i));
      }
      res.status(200).json({ status: true, payload: products });
    } catch (error) {
      next(error);
    }
  };

  static loggerTest = (req, res, next) => {
  
    const logger = getLogger();
  
    logger.debug('Esto es un mensaje de debug');
    logger.http('Esto es un mensaje de http');
    logger.info('Esto es un mensaje informativo');
    logger.warning('Esto es una advertencia');
    logger.error('Esto es un error');
    logger.fatal('Esto es un error fatal');

    res.status(200).json({ status: true, payload: "Logs generados" });
  };
}
