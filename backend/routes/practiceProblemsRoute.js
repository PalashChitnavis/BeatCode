// Import necessary modules and models
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Define route handler for /practiceproblems
router.get("/", async (req, res) => {
        try {
                // Fetch all questions from the database
                const questions = await Question.find({}, "id title diff");

                // Send questions data as JSON response
                res.json(questions);
        } catch (error) {
                // Handle errors
                console.error("Error fetching questions:", error);
                res.status(500).json({ error: "Internal server error" });
        }
});
router.get("/questions/:id", async (req, res) => {
        const { id } = req.params;

        try {
                const question = await Question.findOne({ id: id });
                if (!question) {
                        return res.status(404).json({ error: "Question not found" });
                }
                res.json(question);
        } catch (error) {
                // Handle errors
                console.error("Error fetching question:", error);
                res.status(500).json({ error: "Internal server error" });
        }
});

// Export the router
module.exports = router;
