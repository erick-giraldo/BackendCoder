import { productRepository } from "../repository/index.js";
export default class ProductsService {
  static paginate(query, opts) {
    return productRepository.paginate(query, opts);
  }

  static getOne(value) {
    return productRepository.getOne(value);
  }

  static create(data) {
    return productRepository.create(data);
  }

  static updateOne(id, body){
    return productRepository.updateOne( id, body )
  }

  static deleteById(id) {
    return productRepository.deleteOne(id);
  }
}
