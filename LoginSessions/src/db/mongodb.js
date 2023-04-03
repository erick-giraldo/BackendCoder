import mongoose from 'mongoose'

export const init = async () => {
  try {
    const URI = process.env.MONGODB_URI
    await mongoose.connect(URI)
    console.log('Database connected.')
  } catch (error) {
    console.error('Error to connecto to database', error.message)
  }
}