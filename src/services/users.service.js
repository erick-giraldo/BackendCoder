import { UserDao } from "../dao/factory.js";

const UserModel = new UserDao();

export default class UsersService {
  static create(body) {
    return UserModel.create(body);
  }

  static get(query) {
    return UserModel.get();
  }

  static getById(id) {
    return UserModel.getById(id);
  }

  static getOne(email) {
    return UserModel.findOne({ email });
  }

  static async update(email, user) {
    return UserModel.updateOne(email, user);
  }

  static async updateUserCart(id, body) {
    return UserModel.updateOne(id, body);
  }

  static delete(id) {
    return UserModel.deleteOne(id);
  }
}
