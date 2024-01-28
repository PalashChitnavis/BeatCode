const mongoose = require("mongoose");

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
                enum: ["easy", "medium", "hard"],
                required: true,
        },
        category: {
                type: String,
                required: true,
        },
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
        solution: {
                type: {
                        C: String,
                        CPP: String,
                        Java: String,
                        JavaScript: String,
                        Python: String,
                },
                required: true,
        },
        boilerplate: {
                type: {
                        C: String,
                        CPP: String,
                        Java: String,
                        JavaScript: String,
                        Python: String,
                },
                required: true,
        },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
