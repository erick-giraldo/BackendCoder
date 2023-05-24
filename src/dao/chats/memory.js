export default class User {

    constructor() {
      this.users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'jd@mail.com',
          phone: '1234567890'
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jed@gmail.com',
          phone: '0987654321'
        }
      ]
    }
  
    create(data) {
      const test =  {
        name: 'Jane Doe',
        email: 'jed@gmail.com',
        phone: '0987654321'
      }
      const user = { ...data, id: this.users.length + 1 }
      this.users.push(test)
      return user
    }
  
    get() {
      return this.users
    }
  
    getById(id) {
      return this.users.find(user => String(user.id) === id)
    }
    
    findOne (id) {
        return this.users.find(user => String(user.id) === id)
      }
  
    updateById(id, data) {
      const index = this.users.findIndex(user => String(user.id) === id)
      this.users[index] = { ...data, id }
      return this.users[index]
    }
  
    deleteById(id) {
      const index = this.users.findIndex(user => String(user.id) === id)
      const result = this.users.splice(index, 1)
      return result
    }
  
  }