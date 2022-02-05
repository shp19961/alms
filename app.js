const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const users = require("./routers/userRouting");
const dotenv = require("dotenv");
const path = require("path");
const errormiddleware = require("./middleware/error");
dotenv.config({ path: "backend/config/config.env" });
const hbs = require("hbs");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
const { isAdmin, isAuthenticated } = require("./middleware/isAuthenticated");

// path here
const publicPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templetes/views");
const parcialsPath = path.join(__dirname, "./templetes/parcials");
app.use(express.static(publicPath));

// //set view engine
app.set("view engine", "hbs");
app.set("views", viewsPath);

// //set parcials file path
hbs.registerPartials(parcialsPath);

// //routing files

// //user routing
app.use("/api/v2", users);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/new", (req, res) => {
  res.render("addNewUser");
});
app.get("/leaves", (req, res) => {
  res.render("createLeave");
});

//error middleware
app.use(errormiddleware);

module.exports = app;
