import { userRepository } from '../repository/index.js'

export default class UsersService {
  static create(body) {
    return userRepository.create(body);
  }

  static get(query) {
    return userRepository.get();
  }

  static getById(id) {
    return userRepository.getById(id);
  }

  static current(id) {
    return userRepository.current(id);
  }

  static getOne(email) {
    return userRepository.findOne( email );
  }

  static async update(email, user) {
    return userRepository.updateOne(email, user);
  }

  static async updateUserCart(id, body) {
    return userRepository.updateOne(id, body);
  }

  static delete(id) {
    return userRepository.deleteOne(id);
  }

}
