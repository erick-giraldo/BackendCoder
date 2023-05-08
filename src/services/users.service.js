import UserModel from "../dao/models/users.js";

export default class UsersService {
  static create(body) {
    return UserModel.create(body);
  }

  static get(query) {
    return UserModel.find(query);
  }

  static getById(id) {
    return UserModel.findById(id);
  }

  static getOne(email) {
    return UserModel.findOne({ email });
  }

  static async update(email, user) {
    return UserModel.updateOne({ email }, user);
  }

  static delete(id) {
    return UserModel.deleteOne({ _id: id });
  }
}
