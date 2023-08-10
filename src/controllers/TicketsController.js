import TicketsService from "../services/tickets.service.js";

export default class TicketsController {
  static getTicketById = async (id) => {
    console.log("🚀 ~ file: TicketsController.js:5 ~ TicketsController ~ getTicketById= ~ id:", id)
    return await TicketsService.getOne(id);
  };

  static createTicket = async (payload) => {
    const ticket = await TicketsService.create(payload);
    return ticket;
  };
}
