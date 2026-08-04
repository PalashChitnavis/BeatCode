const mongoose = require("mongoose");

// Define compiler submission schema (for standalone code execution)
const compilersubmissionSchema = new mongoose.Schema(
    {
        // User details
        user_name: {
            type: String,
        },
        user_email: {
            type: String,
            required: true,
        },

        // Code and language
        code: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },

        // Input and output
        input: {
            type: String,
        },
        output: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } // Auto-add createdAt and updatedAt
);

// Create and export CompilerSubmission model
const CompilerSubmission = mongoose.model("CompilerSubmission", compilersubmissionSchema);
module.exports = CompilerSubmission;