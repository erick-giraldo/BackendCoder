import mongoose from 'mongoose'

const mensaje = new mongoose.Schema({
  nombre: { type: String, require: true },
  mensaje: { type: String, require: true }
}, { timestamps: true })

export default mongoose.model('Mensaje', mensaje)