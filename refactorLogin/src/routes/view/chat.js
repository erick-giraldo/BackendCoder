import { Router } from "express";

import MensajeModel from "../../dao/models/mensaje.js";

class chatController {
  static async chatRouter(req, res) {
    try {
      const mensajes = await MensajeModel.find().lean();
      return res.render("chat", {mensajes,});
    } catch (err) {
      return res.status(400).json({
        message: "Error al listar mensajes",
        error: JSON.parse(err.message),
      });
    }
  }
}
export default chatController;