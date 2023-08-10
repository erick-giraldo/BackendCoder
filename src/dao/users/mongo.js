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

  findOne(value) {
    return UserModel.findOne( value );
  }

 getOne(id) {
    return UserModel.findOne(id)
  }

  updateUser(id, body) {
    return UserModel.updateOne( {_id : id }, { $set: { cart: body } });
  }

  updateLastConnection(id, body) {
    return UserModel.updateOne( {_id : id }, { $set: { last_connection: body } });
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

  deleteMany(data) {
    return UserModel.deleteMany(data);
  }
}