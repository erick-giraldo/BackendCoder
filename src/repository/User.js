import UserDTO from '../dto/UserDTO.js'
export default class User {
  constructor(dao) {
    this.dao = dao
  }

  get() {
    return this.dao.get()
  }

  create(data) {
    const usertDto = new UserDTO(data)
    console.log("🚀 ~ file: User.js:13 ~ User ~ create ~ usertDto:", usertDto)
    return this.dao.create(usertDto)
  }

  getById(id) {
    return this.dao.getById(id)
  }

  async current(id) {
    const data = await this.dao.getById(id)
    const usertDto = new UserDTO(data).current()
    return usertDto
  }

  updateById(id, data) {
    const usertDto = new UserDTO(data)
    return this.dao.updateById(id, usertDto)
  }

  updateOne(id, body){
    return this.dao.updateOne( id, body )
  }
  
  deleteById(id) {
    return this.dao.deleteById(id)
  }

  findOne(email){
    return this.dao.findOne(email)
  }

}