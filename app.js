const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoDBConnect = require("connect-mongodb-session")(session);
const users = require("./routers/userRouting");
const Leaves = require("./routers/leaveRouting");
const holiday = require("./routers/holidayRouting");
const reimbursement = require("./routers/reimbursementRouter");
const forgetAttendance = require("./routers/forgetAttendanceRouting");
const dotenv = require("dotenv");
const path = require("path");
const errormiddleware = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });
const hbs = require("hbs");
const { isAuthenticated, isAdmin } = require("./middleware/isAuthenticated");

const store = new mongoDBConnect({
  uri: process.env.MONGO,
  collection: "mySession",
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    cookie: { maxAge: Number(process.env.SESSION_EXPIRES) },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

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

//routing files

//user routing
app.use("/api/v2", users);
//leaves routing
app.use("/api/v2", Leaves);
//holiday routing
app.use("/api/v2", holiday);
//reimbursement routing
app.use("/api/v2", reimbursement);
//forgetAttendance routing
app.use("/api/v2", forgetAttendance);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/new", isAuthenticated, isAdmin("admin"), (req, res) => {
  res.render("addNewUser");
});
app.get("/applyleave", isAuthenticated, (req, res) => {
  res.render("userLeaveRequestForm");
});
app.get("/reqleave", isAuthenticated, isAdmin("admin"), (req, res) => {
  res.render("getLeaveRequest");
});
app.get("/oldreqleave", isAuthenticated, isAdmin("admin"), (req, res) => {
  res.render("getOldLeaveRequest");
});
app.get("/userLeaves", isAuthenticated, (req, res) => {
  res.render("userAllLeaveDetails");
});
app.get("/allusers", isAuthenticated, isAdmin("admin"), (req, res) => {
  res.render("allUsers");
});
app.get("/userdetails", isAuthenticated, isAdmin("admin"), (req, res) => {
  res.render("employeeDetails");
});
app.get("/archive", isAuthenticated, isAdmin("admin"), (req, res) => {
  res.render("archive");
});
app.get("/holiday", isAuthenticated, isAdmin("admin"), (req, res) => {
  res.render("holiday");
});
app.get("/applyreimbursement", isAuthenticated, (req, res) => {
  res.render("applyReimbursement");
});
app.get("/reqreimbursement", isAuthenticated, isAdmin("admin"), (req, res) => {
  res.render("getReimbursementRequest");
});
app.get("/myreimbursement", isAuthenticated, (req, res) => {
  res.render("employeeReimbursementList");
});
app.get("/admin/dashboard", isAuthenticated, (req, res) => {
  res.render("AdminDashboard");
});
app.get("/attendance/forgot/request", isAuthenticated, (req, res) => {
  res.render("forgetAttendanceRequest");
});
app.get("/attendance/forgot/list", isAuthenticated, (req, res) => {
  res.render("userForgotAttendanceList");
});
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("employeeDashboard");
});

//error middleware
app.use(errormiddleware);

module.exports = app;
