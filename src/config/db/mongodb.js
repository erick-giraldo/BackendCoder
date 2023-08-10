import mongoose from 'mongoose'
import getLogger from "../../utils/logger.js";
import config from '../index.js'

const logger = getLogger();

export const init = async () => {
  try {
    const URI = config.mongodbUri
    await mongoose.connect(URI)
    logger.debug('Database connected.')
  } catch (error) {
    logger.error('Error to connecto to database', error.message)
  }
}