export default class Tickets {
  constructor(dao) {
    this.dao = dao
  }

  create(body) {
    return this.dao.create(body);
  }

  getOne(id) {
    return this.dao.getOne(id);
  }

}