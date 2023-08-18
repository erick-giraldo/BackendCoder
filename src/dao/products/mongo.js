import ProductsModel from '../models/products.js'

export default class User {
  paginate(query, opts) {
    return ProductsModel.paginate(query, opts);
  }

  getOne(value) {
    return ProductsModel.findOne(value);
  }

  create(data) {
    return ProductsModel.create(data);
  }

  updateOne(id, body){
    return ProductsModel.updateOne( id, body )
  }

  deleteOne(id) {
    return ProductsModel.deleteOne(id);
  }
}