const PracticeSubmission = require("../models/PracticeSubmission");
const getSubmissions = async (req, res) => {
        try {
                const { questionID } = req.body;
                const submissions = await PracticeSubmission.find({ question_id: questionID });
                res.status(200).json({ submissions });
        } catch (err) {
                console.error("Error fetching submissions:", error);
                res.status(500).json({ error: "Internal Server Error" });
        }
};
module.exports = getSubmissions;
