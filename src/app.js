import express from "express";
import  "dotenv/config";
import * as path from "path";
import { create } from "express-handlebars";
import { SOURCE_PATH } from "./consts.js";
import { home, homeDeleteTodo, homePostTodo, homeUpdateTodo } from "./controllers/home.js";
import HandlebarsHelpers from "./lib/HandlebarsHelpers.js";
import bodyParser from "body-parser";
import coockieParser from "cookie-parser";
import { createConnection } from "typeorm";
import entities from './models/index.js'
import { getUsers } from "./controllers/api/user.js";
import { login, logout, postLogin, postRegister, register } from "./controllers/authentication.js";

import validationAuthentication from './middleware/validation/authention.js';
import { jwtAuth } from "./middleware/jwtAuth.js";
import { deleteTodo, getTodos, postTodo, updateTodo } from "./controllers/todo.js";
const app = express();
app.use(express.static('public'))

/**
 * Import the body parser
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Import the cookie  parser
 */
 app.use(coockieParser());
 
/**
 * Handlebars Init
 */
const hbs = create({
  helpers: HandlebarsHelpers,
  extname: "hbs"
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(SOURCE_PATH, "views"))

/**
 * App Routing
 */

app.get('/', jwtAuth, home);
app.get('/login', login)
app.get('/register', register)

app.post('/register', ...validationAuthentication, postRegister, register);
app.post('/login', ...validationAuthentication, postLogin, login);
app.post('/logout', logout);

app.post('/postTodo', homePostTodo);
app.post('/deleteTodo', homeDeleteTodo);
app.post('/updateTodo', homeUpdateTodo);

app.get('/api/todo', getTodos);
app.post('/api/todo', postTodo);
app.delete('/api/todo/:id', deleteTodo);
app.put('/api/todo', updateTodo);

/**
 * API Routing
 */

app.get("/api/user", getUsers);

/**
 * Create datbase connection and start listening
 */

createConnection({
  type: process.env.DATABASE_TYPE,
  database: process.env.DATABASE_NAME,
  entities,
  // logging: true,
  synchronize: true
}).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Application is running on http://localhost:${process.env.PORT}/.`);
  });
})

