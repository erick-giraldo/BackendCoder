import mongoose from 'mongoose'
import getLogger from "../../utils/logger.js";

const logger = getLogger();

export const init = async () => {
  try {
    const URI = process.env.MONGODB_URI
    await mongoose.connect(URI)
    logger.debug('Database connected.')
  } catch (error) {
    logger.error('Error to connecto to database', error.message)
  }
}