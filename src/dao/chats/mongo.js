import UserModel from '../models/users.js'

export default class User {

  create(data) {
    return UserModel.create(data)
  }

  get() {
    return UserModel.find()
  }

  getById(id) {
    return UserModel.findById(id)
  }

  findOne(id) {
    return UserModel.findOne(id)
  }

 getOne(id) {
    return UserModel.findOne(id)
  }

  updateOne(id, body) {
    return UserModel.updateOne( {_id : id }, { $set: { cart: body } });
  }

  updateById(id, data) {
    return UserModel.updateOne({ _id: id }, { $set: data })
  }

  static deleteOne(id) {
    return UserModel.deleteOne({ _id: id });
  }

}