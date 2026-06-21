
const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {

  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // ✅ 1. If access token valid → continue
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      // expired → go to refresh
    }
  }

  // ✅ 2. Try refresh token
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // create new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
      });

      req.user = decoded;
      return next();

    } catch (err) {
      return res.redirect("/auth/login");
    }
  }

  // ❌ no token
  return res.redirect("/auth/login");
};
exports.isGuest = (req, res, next) => {
  if (req.cookies.accessToken || req.cookies.refreshToken) {
    return res.redirect("/dashboard");
  }
  next();
};