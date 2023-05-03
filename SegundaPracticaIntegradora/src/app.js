import express from "express";
import * as dotenv from "dotenv";
import { init } from "./db/mongodb.js";
import RouterController from "./routes/index.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import isEmpty from "is-empty";
import initPassport from "./config/passport.config.js";
import expressSession from "express-session";
import MongoStore from "connect-mongo";

const app = express();

dotenv.config();
init();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  expressSession({
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 100,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

initPassport();
app.use(passport.initialize());

RouterController.routes(app);

app.use((err, req, res, next) => {
    console.error(err)
    if(!isEmpty(err.url)){
      res.render( err.url , { 
        success: false, 
        message: err.message, 
        statusCode: err.statusCode || 500 });
    }else{
      res
    .status(err.statusCode || 500)
    .json({ success: false, message: err.message })
    }
  })
  
export default app;
