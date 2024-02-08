const express = require("express");
const router = express.Router();
const User = require("../models/User");
router.post("/", async (req, res) => {
        const { email } = req.body;
        const data = await User.findOne({ email: email });
        res.status(200).json({ data });
});

module.exports = router;
