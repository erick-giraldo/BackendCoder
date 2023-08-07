import config from '../config/index.js'

export let UserDao
export let ProductDao
export let TicketDao
export let CartDao

switch (config.presistanceType) {
  case 'mongodb':
    UserDao = (await import('./users/mongo.js')).default
    ProductDao = (await import('./products/mongo.js')).default
    TicketDao = (await import('./tickets/mongo.js')).default
    CartDao = (await import('./carts/mongo.js')).default
    break;
  case 'file':
    UserDao = (await import('./users/file.js')).default
    ProductDao = (await import('./products/file.js')).default
    TicketDao = (await import('./tickets/file.js')).default
    CartDao = (await import('./carts/file.js')).default
    break;
  default:
    UserDao = (await import('./users/memory.js')).default
    ProductDao = (await import('./products/file.js')).default
    TicketDao = (await import('./tickets/file.js')).default
    CartDao = (await import('./carts/file.js')).default
}