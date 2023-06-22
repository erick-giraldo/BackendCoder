import messageService from "../services/message.service.js";
import twilioService from "../services/twilio.service.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import config from '../config/index.js'
const PORT = config.port

import getLogger from "../utils/logger.js";
import { plantillaForgotPass } from "./plantillaForgotPass.js";

const logger = getLogger();
export default class MailingController {
  static email = async (email, token) => {
    const resetLink = `http://localhost:${PORT}/forgotPassword?token=${token} `;
    const attachments = [
      {
        filename: "image.png",
        path: path.join(__dirname, "../public/images/image.png"),
        cid: "programadora",
      },
    ];
    const result = await messageService.sendEmail(
      `${email}`,
      "establecimiento de contraseña",
      plantillaForgotPass(resetLink)
      ,
      // attachments
    );
    logger.info(result);
    return true
  };

  static sms = async (req, res) => {
    const result = await twilioService.sendSMS(
      "+51945970045",
      "Hola. Cómo estás? Gracias por unirte a nuestro ecommerce."
    );
    logger.info(result);
    res.send(`
    <div>
      <h1>Hello sms!</h1>
      <a href="/">Go back</a>
    </div>
    `);
  };

  static thanks = async (req, res) => {
    const name = req.user.name;
    const product = req.user.role;
    const target = "+51945970045";
    const body = `Gracias, ${name}, tu solicitud del producto ${product} ha sido aprobada.`;
    const result = await twilioService.sendSMS(target, body);
    logger.log(result);
    res.send(`
    <div>
      <h1>Hello sms!</h1>
      <a href="/">Go back</a>
    </div>
    `);
  };
}
