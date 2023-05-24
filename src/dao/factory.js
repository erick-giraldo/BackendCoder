import config from '../config/index.js'

export let UserDao

switch (config.presistanceType) {
  case 'mongodb':
    UserDao = (await import('./users/mongo.js')).default
    break;
  case 'file':
    UserDao = (await import('./users/file.js')).default
    break;
  default:
    UserDao = (await import('./users/memory.js')).default
}