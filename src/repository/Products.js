export default class Products {
  constructor(dao) {
    this.dao = dao
  }

  async paginate(query, opts) {
    return await this.dao.paginate(query, opts)
  }

  async getOne(value) {
    return await this.dao.getOne(value)
  }

  async create(data) {
    return await this.dao.create(data)
  }

  async deleteOne(id) {
    return await this.dao.deleteOne(id)
  }

  async updateOne(id, body){
    console.log("🚀 ~ file: Products.js:23 ~ Products ~ updateOne ~ id:", id)
    console.log("🚀 ~ file: Products.js:23 ~ Products ~ updateOne ~ body:", body)
    return await this.dao.updateOne( id, body )
  }

}