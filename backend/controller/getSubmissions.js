const PracticeSubmission = require("../models/PracticeSubmission");
const getSubmissions = async (req, res) => {
        try {
                const { questionID } = req.body;
                const oldSubmissions = await PracticeSubmission.find({ question_id: questionID, status: "Passed" }).sort({
                        createdAt: -1,
                });
                console.log(oldSubmissions);
                const existingUser = [];
                const submissions = [];
                oldSubmissions.forEach((submission) => {
                        if (!existingUser.includes(submission.user_email)) {
                                submissions.push(submission);
                                existingUser.push(submission.user_email);
                        }
                });
                console.log(submissions);
                res.status(200).json({ submissions });
        } catch (err) {
                console.log("Error fetching submissions:", err);
                res.status(500).json({ error: "Internal Server Error" });
        }
};
module.exports = getSubmissions;
