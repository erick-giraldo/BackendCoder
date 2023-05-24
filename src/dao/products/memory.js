export default class Products {

    constructor() {
      this.products = [
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
      const user = { ...data, id: this.products.length + 1 }
      this.products.push(data)
      return user
    }
  
    get() {
      return this.products
    }
  
    getById(id) {
      return this.products.find(user => String(user.id) === id)
    }
    
    findOne (id) {
        return this.products.find(user => String(user.id) === id)
      }
  
    updateById(id, data) {
      const index = this.products.findIndex(user => String(user.id) === id)
      this.products[index] = { ...data, id }
      return this.products[index]
    }
  
    deleteById(id) {
      const index = this.products.findIndex(user => String(user.id) === id)
      const result = this.products.splice(index, 1)
      return result
    }
  
  }