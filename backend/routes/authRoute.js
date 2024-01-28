// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controller/authController");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
