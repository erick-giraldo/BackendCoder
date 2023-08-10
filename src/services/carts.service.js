import { cartRepository } from "../repository/index.js";

export default class CartService {
  static create(data) {
    return cartRepository.create(data);
  }

  static getById(id) {
    return cartRepository.getById( id );
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
}
