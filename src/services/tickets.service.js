import { ticketRepository } from "../repository/index.js";
export default class TicketsService {
  static create(body) {
     return ticketRepository.create(body);
  }

  static getOne(id) {
    return ticketRepository.getOne(id);
  }

}
