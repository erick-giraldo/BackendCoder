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

  findOne(email) {
    return UserModel.findOne({ email });
  }

 getOne(id) {
    return UserModel.findOne(id)
  }

  updateUser(id, body) {
    return UserModel.updateOne( {_id : id }, { $set: { cart: body } });
  }

  updateOne(id, body) {
    return UserModel.updateOne( {_id : id }, { $set: { cart: body } });
  }

  updateTicket(id, body) {
    return UserModel.updateOne( {_id : id }, { $set: { ticket: body } });
  }

  updateDoc(id, body) {
    return UserModel.updateOne( {_id : id }, { $set: { documents: body } });
  }

  updateById(id, data) {
    return UserModel.updateOne({ _id: id }, { $set: data })
  }

   deleteOne(id) {
    return UserModel.deleteOne({ _id: id });
  }

}