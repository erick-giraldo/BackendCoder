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
    console.log("🚀 ~ file: mongo.js:17 ~ User ~ updateOne ~ id:", id)
    console.log("🚀 ~ file: mongo.js:17 ~ User ~ updateOne ~ body:", body)
    return ProductsModel.updateOne( id, body )
  }

  deleteOne(id) {
    return ProductsModel.deleteOne(id);
  }
}