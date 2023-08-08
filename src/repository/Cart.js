export default class Cart{
  constructor(dao) {
    this.dao = dao
  }

  async get() {
    return await this.dao.get()
  }

  create(data) {
    return this.dao.create(cart)
  }

  getById(id) {
    return this.dao.getById(id)
  }

  async current(id) {
    const data = await this.dao.getById(id)
    const cartDto = new CartDTO(data).current()
    return cartDto
  }

  updateById(id, data) {
    const cartDto = new CartDTO(data)
    return this.dao.updateById(id, cartDto)
  }

  updateProducts(id, body){
    return this.dao.updateProducts( id, body )
  }

  deleteById(id) {
    return this.dao.deleteOne(id)
  }

  deleteMany(data) {
    return this.dao.deleteMany(data)
  }
}