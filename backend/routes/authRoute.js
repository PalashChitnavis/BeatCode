// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login, googleLogin } = require("../controller/authController");

// User registration
router.post("/signup", signup);

// User login
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    login(email, password, res);
});

// Google OAuth login
router.post("/google", (req, res) => {
    const { email, username } = req.body;
    googleLogin(email, username, res);
});

module.exports = router;