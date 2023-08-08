import { cartRepository } from '../repository/index.js'


export default class CartService {
  static findAll(body) {
    return cartRepository.find(body)
  }

  static create(body) {
    return cartRepository.create(body);
  }

  static get(query) {
    return cartRepository.find(query);
  }

  static getById(id) {
    return cartRepository.findOne({ _id : id });
  }

  static getByIdView(id) {
    return cartRepository.findOne({ id });
  }

  static getCartById(id) {
    return cartRepository.findById( id );
  }
  
  static getOne(id) {
    return cartRepository.findOne({ _id: id }).populate(
      "products._id"
    );
  }
  static getOneView(id) {
    return cartRepository.findOne({ id }).populate(
      "products._id"
    );
  }

  static async updateOne(id, body) {
    return cartRepository.updateOne({ id }, { $set: { products: body } });
  }

  static async updateOneQuantity(cid, pid, quantity) {
    return cartRepository.updateOne({ id : cid , "products._id":pid}, { $set: {  "products.$.quantity": quantity,} });
  }

  static deleteById(id) {
    return cartRepository.deleteOne({ _id: id });
  }

  static deleteByIdView(id) {
    return cartRepository.deleteOne({ id: id });
  }
}
