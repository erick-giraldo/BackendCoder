import { Router } from 'express'

import MensajeModel from '../../dao/models/mensaje.js'

const router = Router()

router.get('/', async (req, res) => {
  const mensajes = await MensajeModel.find().lean()
  res.render('chat', { mensajes })
})

export default router