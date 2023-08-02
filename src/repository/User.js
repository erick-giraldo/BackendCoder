import UserDTO from '../dto/UserDTO.js'
export default class User {
  constructor(dao) {
    this.dao = dao
  }

  async getDTO() {
    const data = await this.dao.get()
    const usertDto = new UserDTO(data)
    return usertDto
  }

  async get() {
    return await this.dao.get()
  }

  create(data) {
    const usertDto = new UserDTO(data)
    const user = usertDto.users.map((u) =>  u = { ...u, cart: [], documents: [], ticket: [], last_connection: new Date()});
    return this.dao.create(user)
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
    return this.dao.deleteOne(id)
  }

  deleteMany(data) {
    return this.dao.deleteMany(data)
  }

  findOne(email){
    return this.dao.findOne(email)
  }

}