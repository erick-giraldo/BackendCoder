import { UserDao, ProductDao, CartDao, TicketDao } from '../dao/factory.js'
import UserRepository from './User.js'
import ProductRepository from './Products.js'
import TicketRepository from './Tickets.js'
import CartRepository from './Cart.js'

export const userRepository = new UserRepository(new UserDao())
export const productRepository = new ProductRepository(new ProductDao())
export const ticketRepository = new TicketRepository(new TicketDao())
export const cartRepository = new CartRepository(new CartDao())