const express = require("express");
const path = require("path");
require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { isAuthenticated } = require("./middleware/authMiddleware");

const app = express();

app.use(cookieParser());



app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info");
  res.locals.danger = req.flash("danger");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  res.locals.page = "";
  next();
});

// ✅ BODY PARSER MIDDLEWARE - MUST BE BEFORE ROUTES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Task = require("./models/Task");
app.use(expressLayouts);

app.set("layout", "layout");

const taskRoutes = require("./routes/taskRoutes");

const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", taskRoutes);

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", isAuthenticated, async (req, res) => {



  try {

    const userId = req.user.id;

    const totalTasks = await Task.countDocuments({ user: userId });

    const pendingTasks = await Task.countDocuments({
      user: userId,
      status: "Pending"
    });

    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "Completed"
    });

  

    res.render("dashboard/index", {
      pageTitle: "Dashboard",
      totalTasks,
      pendingTasks,
      completedTasks,
      page: "dashboard"
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading dashboard");
  }

});
module.exports = app;


app.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.redirect("/auth/login");
});