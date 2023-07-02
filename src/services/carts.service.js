import CartModel from '../dao/models/carts.js'


export default class CartService {
  static findAll(body) {
    return CartModel.find(body)
  }

  static create(body) {
    return CartModel.create(body);
  }

  static get(query) {
    return CartModel.find(query);
  }

  static getById(id) {
    return CartModel.findOne({ _id : id });
  }

  static getByIdView(id) {
    return CartModel.findOne({ id });
  }

  static getCartById(id) {
    return CartModel.findById( id );
  }
  
  static getOne(id) {
    return CartModel.findOne({ _id: id }).populate(
      "products._id"
    );
  }
  static getOneView(id) {
    return CartModel.findOne({ id }).populate(
      "products._id"
    );
  }

  static async updateOne(id, body) {
    return CartModel.updateOne({ id }, { $set: { products: body } });
  }

  static async updateOneQuantity(cid, pid, quantity) {
    return CartModel.updateOne({ id : cid , "products._id":pid}, { $set: {  "products.$.quantity": quantity,} });
  }

  static deleteById(id) {
    return CartModel.deleteOne({ _id: id });
  }
}
