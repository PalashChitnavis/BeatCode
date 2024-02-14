const mongoose = require("mongoose");

const practicesubmissionSchema = new mongoose.Schema(
        {
                user_name: {
                        type: String,
                },
                user_email: {
                        type: String,
                        required: true,
                },
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
                status: {
                        type: String,
                        required: true,
                },
                output: {
                        type: String,
                },
        },
        { timestamps: true }
);

const PracticeSubmission = mongoose.model("PracticeSubmission", practicesubmissionSchema);

module.exports = PracticeSubmission;
