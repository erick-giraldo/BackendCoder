import { createHash } from "../utils/hash.js";

export default class UserDTO {
  constructor(user) {
    this.first_name = "Jorge";
    this.last_name = "Perez";
    this.email = user.email;
    this.age = 20;
    this.occupation = "Ingeniero";
    this.role = user.role;
    this.cart = [];
    this.password = createHash(user.password);
  }
  current() {
    const user = {
      name: `${this.first_name} ${this.last_name}`,
      email: this.email,
      age: this.age,
      occupation: this.occupation,
    };
    return user;
  }
}
