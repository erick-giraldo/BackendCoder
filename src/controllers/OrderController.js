import TicketsService from '../services/tickets.service.js'

export default class OrderController {
    static  getTicket = async (req, res)=>{
        return await TicketsService.find()
    }
    static  createTicket = async (req, res) => {
        const ticket = await TicketsService.create(req.body)
        const products  = req.body.products
        const updateTIcket = await TicketsService.updateOne( ticket._id, products )
    }
    static  updateTicket = async (req, res)=>{}
    static  deleteTicket = async (req, res)=>{}

}