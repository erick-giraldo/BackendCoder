import { cartRepository } from "../repository/index.js";

export default class CartService {
  static create(data) {
    return cartRepository.create(data);
  }

  static getById(id) {
    return cartRepository.getById({ _id: id });
  }

  static findAll(body) {
    return cartRepository.getAll(body);
  }

  static deleteById(id) {
    return cartRepository.deleteOne( id );
  }

  static findOne(id) {
    return cartRepository.findOne( id );
  }

  static getByIdView(id) {
    return cartRepository.findOnePulopate(id);
  }

  static async updateOne(id, body) {
    return cartRepository.updateOne(id, body);
  }

  // static async updateOneQuantity(cid, pid, quantity) {
  //   return cartRepository.updateOne(
  //     { id: cid, "products._id": pid },
  //     { $set: { "products.$.quantity": quantity } }
  //   );
  // }

  // static deleteByIdView(id) {
  //   return cartRepository.deleteOne({ id: id });
  // }

  // static getCartById(id) {
  //   return cartRepository.findById( id );
  // }

  // static getOne(id) {
  //   return cartRepository.findOne({ _id: id }).populate(
  //     "products._id"
  //   );
  // }
}
