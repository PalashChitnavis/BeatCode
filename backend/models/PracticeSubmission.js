const mongoose = require("mongoose");

const practicesubmissionSchema = new mongoose.Schema(
        {
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
        },
        { timestamps: true }
);

const PracticeSubmission = mongoose.model("PracticeSubmission", practicesubmissionSchema);

module.exports = PracticeSubmission;
