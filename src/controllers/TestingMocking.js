import { generateProduct } from "../utils/faker/index.js";

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

}