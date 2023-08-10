import CartModel from '../models/carts.js'

export default class User {

  create(data) {
    return CartModel.create(data);
  }

  getById(id) {
    return CartModel.findById(id)
  }

  getAll() {
    return CartModel.find()
  }

  findOne(id) {
    return CartModel.findOne({ id });
  }

  findOnePulopate(id) {
    return CartModel.findOne({ id }).populate(
      "products._id"
    );
  }
  
  deleteOne(id) {
    return CartModel.deleteOne( id );
  }

  updateOne(id, body) {
     return CartModel.updateOne( id, body);
  }

 }