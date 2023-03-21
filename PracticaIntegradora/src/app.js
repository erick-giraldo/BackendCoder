import express from "express";
import { init } from './db/mongodb.js'
import RouterController from "./routes/views/index.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";



const app = express();
init();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

RouterController.routes(app);

export default app
