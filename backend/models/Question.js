const mongoose = require("mongoose");

// Define question schema
const questionSchema = new mongoose.Schema({
    // Basic question info
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    diff: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },

    // Example test cases with mixed input/output types
    example_cases: {
        type: [
            {
                input: [mongoose.Schema.Types.Mixed],
                output: mongoose.Schema.Types.Mixed,
                explanation: String,
            },
        ],
        required: true,
    },

    // Official solution for each language
    solution: {
        type: {
            c: String,
            cpp: String,
            java: String,
            python: String,
        },
        required: true,
    },

    // Boilerplate code for each language
    boilerplate: {
        type: {
            c: String,
            cpp: String,
            java: String,
            python: String,
        },
        required: true,
    },

    // Template code for each language
    templatecode: {
        type: {
            c: String,
            cpp: String,
            java: String,
            python: String,
        },
        required: true,
    },
});

// Create and export Question model
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;