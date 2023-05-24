import { UserDao } from '../dao/factory.js'
import UserRepository from './User.js'

export const userRepository = new UserRepository(new UserDao())