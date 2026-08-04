const mongoose = require("mongoose");

// Define practice submission schema
const practicesubmissionSchema = new mongoose.Schema(
    {
        // User information
        user_name: {
            type: String,
        },
        user_email: {
            type: String,
            required: true,
        },

        // Problem and solution details
        question_id: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },

        // Execution result
        status: {
            type: String,
            required: true,
        },
        output: {
            type: String,
        },
    },
    { timestamps: true } // Auto-add createdAt and updatedAt
);

// Create and export PracticeSubmission model
const PracticeSubmission = mongoose.model("PracticeSubmission", practicesubmissionSchema);
module.exports = PracticeSubmission;