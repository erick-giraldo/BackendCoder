import TicketModel from '../dao/models/tickets.js'


export default class TicketsService {
  static create(body) {
    // return TicketModel.create({body},{ $set: { products } });
    return TicketModel.create(body);
  }

  static get(query) {
    return TicketModel.find(query);
  }

  static getById(id) {
    return TicketModel.findOne({id})
  }

  static getOne(id) {
    return TicketModel.findOne({ id });
  }


  static async updateOne(id, body) {
    return TicketModel.updateOne({ id }, { $set: { products: body } });
  }


  static delete(id) {
    return TicketModel.deleteOne({ _id: id });
  }
}
