const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
        user_id: {
                type: String,
                required: true,
        },
        question_id: {
                type: Number,
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
        status: {
                type: String,
                required: true,
        },
        timestamp: {
                type: Date,
                default: Date.now,
                required: true,
        },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
