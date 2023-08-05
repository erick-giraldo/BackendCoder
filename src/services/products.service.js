import ProductsModel from '../dao/models/products.js'
import ProductDTO from '../dto/ProductDTO.js';

export default class ProductsService {

  static get() {
    return ProductsModel.find().lean();
  }

  static getById(id) {
    return ProductsModel.findById(id);
  }

  static getOne(value) {
    return ProductsModel.findOne( value);
  }

  static getCode(code) {
    return ProductsModel.findOne({ code });
  }

  
  static async create(body) {
    return ProductsModel.create( body);
  }

  static async updateOne(id, body) {
    return ProductsModel.updateOne({ _id: id }, { $set: body });
  }

  static deleteById(value) {
    return ProductsModel.deleteOne(value);
  }

  static paginate(query, opts) {
    return ProductsModel.paginate(query, opts);
  }
}
