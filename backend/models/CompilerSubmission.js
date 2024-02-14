const mongoose = require("mongoose");

const compilersubmissionSchema = new mongoose.Schema(
        {
                user_name: {
                        type: String,
                },
                user_email: {
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
                input: {
                        type: String,
                },
                output: {
                        type: String,
                        required: true,
                },
        },
        { timestamps: true }
);

const CompilerSubmission = mongoose.model("CompilerSubmission", compilersubmissionSchema);

module.exports = CompilerSubmission;
