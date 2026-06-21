const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getRegister = (req, res) => {
  res.render("auth/register", {
    layout: "layouts/auth",
    title: "Register"
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/auth/register");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      req.flash("error", "Email already exists");
      return res.redirect("/auth/register");
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed
    });

    req.flash("success", "Registered successfully. Please login.");
    res.redirect("/auth/login");

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/auth/register");
  }
};


exports.getLogin = (req, res) => {
  res.render("auth/login", {
    layout: "layouts/auth",
    title: "Login"
  });
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/auth/login");
    }


    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );


    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "3d" }
    );


    res.cookie("accessToken", accessToken, {
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    req.flash("success", "Login successful");
    return res.redirect("/dashboard");

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    return res.redirect("/auth/login");
  }
};


exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  req.flash("danger", "Logged out successfully");
  res.redirect("/auth/login");
};