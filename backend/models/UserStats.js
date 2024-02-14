const mongoose = require("mongoose");

const UserStatsSchema = new mongoose.Schema(
        {
                userName: { type: String },
                emailID: { type: String, required: true },
                attemptedQuestions: [{ type: String }],
                attempts: {
                        easy: { type: Number, default: 0 },
                        medium: { type: Number, default: 0 },
                        hard: { type: Number, default: 0 },
                },
        },
        { timestamps: true }
);

const UserStats = mongoose.model("UserStats", UserStatsSchema);
module.exports = UserStats;
