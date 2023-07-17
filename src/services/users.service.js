import { userRepository } from '../repository/index.js'

export default class UsersService {
  static create(body) {
    return userRepository.create(body);
  }

  static get() {
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

  static async updateUserDoc(id, body) {
    return userRepository.updateDoc(id, body);
  }

  static async updateTicket(id, body) {
    return userRepository.updateTicket(id, body);
  }

  static delete(id) {
    return userRepository.deleteOne(id);
  }
  
  static updateOne(id, payload, extradata = {}) {
    return UserModel.updateOne({ _id: id, ...extradata }, payload);
}

}
