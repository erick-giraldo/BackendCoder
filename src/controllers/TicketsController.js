import TicketsService from '../services/tickets.service.js'

export default class TicketsController {
    static  getTicketById = async ( id )=>{
        return await TicketsService.getOne( id )
    }
    static  createTicket = async ( payload ) => {
        const ticket = await TicketsService.create( payload )
        return ticket
    }
    static  updateTicket = async (req, res)=>{}
    static  deleteTicket = async (req, res)=>{}

}