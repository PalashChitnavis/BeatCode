const mongoose = require("mongoose");

// Define user statistics schema
const UserStatsSchema = new mongoose.Schema(
    {
        // User identification
        userName: { type: String },
        emailID: { type: String, required: true },

        // Track attempted question IDs
        attemptedQuestions: [{ type: String }],

        // Count attempts by difficulty level
        attempts: {
            easy: { type: Number, default: 0 },
            medium: { type: Number, default: 0 },
            hard: { type: Number, default: 0 },
        },
    },
    { timestamps: true } // Auto-add createdAt and updatedAt
);

// Create and export UserStats model
const UserStats = mongoose.model("UserStats", UserStatsSchema);
module.exports = UserStats;