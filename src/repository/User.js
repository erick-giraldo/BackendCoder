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

  updateTicket(id, body){
    return this.dao.updateTicket( id, body )
  }

  updateDoc(id, body){
    return this.dao.updateDoc( id, body )
  }

  updateCart(id, body){
    return this.dao.updateUser( id, body )
  }

  updateLastConnection(id, body){
    return this.dao.updateLastConnection( id, body )
  }
  
  deleteById(id) {
    return this.dao.deleteById(id)
  }

  findOne(email){
    return this.dao.findOne(email)
  }

}