// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login, googleLogin } = require("../controller/authController");

router.post("/signup", signup);
router.post("/login", (req, res) => {
        const { email, password } = req.body;
        login(email, password, res);
});
router.post("/google", (req, res) => {
        const { email, username } = req.body;
        googleLogin(email, username, res);
});

module.exports = router;
