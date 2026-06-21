const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard/index",
  );
});