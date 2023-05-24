import express from "express";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import config from './index.js'
import { init } from "../db/mongodb.js";
import RouterController from "../routes/index.js";
import  dirname  from "./utils.js";
import initPassport from "./passport.config.js";
import isEmpty from "is-empty";

const app = express();

// Configuración de variables de entorno
dotenv.config();

// Inicialización de base de datos
if (config.presistanceType === 'mongodb') {
  await init()
}

// Configuración de vistas con Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", dirname + "/../views");
app.set("view engine", "handlebars");

// Configuración de archivos estáticos
app.use(express.static(dirname + "/../public"));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para cookies
app.use(cookieParser());

// Configuración de Passport
initPassport();
app.use(passport.initialize());

// Configuración de rutas
RouterController.routes(app);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const success = false;
  const message = err.message;

  if (!isEmpty(err.url)) {
    res.render(err.url, { success, message, statusCode });
  } else {
    res.status(statusCode).json({ success, message });
  }
});

export default app;
