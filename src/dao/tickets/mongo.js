import TicketModel from '../models/tickets.js'

export default class User {

   create(body) {
    return TicketModel.create(body);
 }

  getOne(id) {
   return TicketModel.findById(id).populate(
     "products._id"
   );
 }
}