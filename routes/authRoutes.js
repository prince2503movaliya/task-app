const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isGuest } = require("../middleware/authMiddleware");

router.get("/login", isGuest, authController.getLogin);
router.get("/register", isGuest, authController.getRegister);

router.get("/register", authController.getRegister);
router.post("/register", authController.register);

router.get("/login", authController.getLogin);
router.post("/login", authController.login);

router.get("/logout", authController.logout);

module.exports = router;