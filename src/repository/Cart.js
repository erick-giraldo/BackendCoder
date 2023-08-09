export default class Cart {
  constructor(dao) {
    this.dao = dao
  }
  
  async create(data) {
    return await this.dao.create(data)
  }

  async getById(id) {
    return await this.dao.getById(id)
  }

  async getAll() {
    return await this.dao.getAll()
  }

  async findOnePulopate(id) {
    return  await this.dao.findOnePulopate( id );
  }

  async findOne(id) {
    return  await this.dao.findOne( id );
  }

  deleteOne(id) {
    return this.dao.deleteOne(id)
  }

  async updateOne(id, body) {
    return await this.dao.updateOne( id, body );
  }
 

//   async current(id) {
//     const data = await this.dao.getById(id)
//     const cartDto = new CartDTO(data).current()
//     return cartDto
//   }

//   updateById(id, data) {
//     const cartDto = new CartDTO(data)
//     return this.dao.updateById(id, cartDto)
//   }

//   updateProducts(id, body){
//     return this.dao.updateProducts( id, body )
//   }



//   deleteMany(data) {
//     return this.dao.deleteMany(data)
//   }
 }