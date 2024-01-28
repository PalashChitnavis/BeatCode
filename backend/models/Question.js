const mongoose = require("mongoose");

// Define the schema for the question
const questionSchema = new mongoose.Schema({
        id: {
                type: Number,
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
                enum: ["easy", "medium", "hard"], // Assuming difficulty levels
                required: true,
        },
        category: {
                type: String,
                required: true,
        },
        example_cases: {
                type: {
                        example1: {
                                input: [Number],
                                output: Number,
                                explanation: String,
                        },
                        example2: {
                                input: [Number],
                                output: Number,
                                explanation: String,
                        },
                        example3: {
                                input: [Number],
                                output: Number,
                                explanation: String,
                        },
                },
                required: true,
        },
        solution: {
                type: {
                        C: String,
                        "C++": String,
                        Java: String,
                        JavaScript: String,
                        Python: String,
                },
                required: true,
        },
        boilerplate: {
                type: {
                        C: String,
                        "C++": String,
                        Java: String,
                        JavaScript: String,
                        Python: String,
                },
                required: true,
        },
});

// Create the model from the schema
const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
