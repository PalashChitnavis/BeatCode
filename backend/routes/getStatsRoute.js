const express = require("express");
const router = express.Router();
const UserStats = require("../models/UserStats");
router.post("/", async (req, res) => {
        const { email } = req.body;
        const data = await UserStats.findOne({ emailID: email });
        res.status(200).json({ data });
});

module.exports = router;
