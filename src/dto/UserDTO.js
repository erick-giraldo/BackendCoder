import { createHash } from "../utils/hash.js";

export default class UserDTO {
  constructor(user) {
    if (Array.isArray(user)) {
      this.users = this.getAll(user);
    } else if (typeof user === 'object') {
      this.users = [this._createUser(user)];
    } else {
      throw new Error("El constructor solo acepta un objeto o un array de objetos.");
    }
  }

  _createUser(user) {
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart,
      password: createHash(user.password),
      documents: [],
    };
  }

  current() {
    if (this.users.length === 1) {
      const currentUser = this.users[0];
      return {
        name: `${currentUser.first_name} ${currentUser.last_name}`,
        email: currentUser.email,
        age: currentUser.age,
        role: currentUser.role,
      };
    } else {
      throw new Error("El método current solo está disponible cuando se ha creado un solo usuario.");
    }
  }

  getAll(user) {
    const result = user.map(u => {
      return {
        name: `${u.first_name} ${u.last_name}`,
        email: u.email,
        age: u.age,
        role: u.role,
      };
    });
    return result;
  }
}
