import TicketsService from '../services/tickets.service.js'

export default class OrderController {
    static  getTicket = async (req, res)=>{
        return await TicketsService.find()
    }
    static  createTicket = async ( payload ) => {
        const ticket = await TicketsService.create( payload )
        return true
    }
    static  updateTicket = async (req, res)=>{}
    static  deleteTicket = async (req, res)=>{}

}