// Assuming you're using Express.js
const express = require("express");
const router = express.Router();
const UserStats = require("../models/UserStats");
const User = require("../models/User");

// Route for fetching leaderboard data
router.get("/", async (req, res) => {
        try {
                const leaderboardData = await UserStats.find()
                        .sort({ "attemptedQuestions.length": -1 })
                        .select("emailID attemptedQuestions");
                const emailIDArray = leaderboardData.map((data) => data.emailID);
                const users = await User.find({ email: { $in: emailIDArray } }).select("username email");
                const usernameMap = {};
                users.forEach((user) => {
                        usernameMap[user.email] = user.username;
                });
                const leaderboard = leaderboardData.map((data) => ({
                        email: data.emailID,
                        username: usernameMap[data.emailID] || "Unknown",
                        attemptedQuestions: data.attemptedQuestions,
                }));
                res.json(leaderboard);
        } catch (error) {
                console.error("Error fetching leaderboard:", error);
                res.status(500).json({ error: "Internal server error" });
        }
});

module.exports = router;
