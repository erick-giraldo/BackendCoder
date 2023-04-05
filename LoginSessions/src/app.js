import express from "express";
import { init } from './db/mongodb.js'
import RouterController from "./routes/index.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import cookieParser from 'cookie-parser';
import expressSession  from 'express-session';
import MongoStore from 'connect-mongo';


const app = express();
init();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(expressSession({
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 100,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  }));

RouterController.routes(app);

export default app
