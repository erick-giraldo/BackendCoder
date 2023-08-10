import express from "express";
import dotenv from "dotenv";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import config from './index.js'
import { init } from "./db/mongodb.js";
import RouterController from "../routes/index.js";
import  dirname  from "./utils.js";
import initPassport from "./passport.config.js";
import errorMiddleware from '../utils/errors/MiddlewareError.js'
import swagger from "./swagger.js";
import cors from 'cors'

const app = express();

// Configuración de variables de entorno
dotenv.config();

// Inicialización de base de datos
if (config.presistanceType === 'mongodb') {
  await init()
}

// Configuración de vistas con Handlebars
// Configuración de Handlebars con opciones
const hbs = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

// Configuración de vistas con Handlebars
app.engine("handlebars", hbs.engine);
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

app.use(cors());

app.use(cors({
  origin: "http://localhost:8080"
}));

swagger(app);

// Configuración de rutas
RouterController.routes(app);
// Manejador de errores
app.use(errorMiddleware);

export default app;