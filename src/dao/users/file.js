export default class User {
  constructor() {
    this.users = [
      {
        "_id": "646c38d7cf247992a035feeb",
        "first_name": "Jorge",
        "last_name": "Perez",
        "email": "egiraldom1@outlook.com",
        "age": 20,
        "role": "user",
      }
    ]
  }
  get() {
    return this.users
  }
  getById(id) {
    return this.users.find(user => String(user._id) === '646c38d7cf247992a035feeb')
  }
}