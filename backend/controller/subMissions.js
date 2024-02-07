const CompilerSubmission = require("../models/CompilerSubmission");
const PracticeSubmissions = require("../models/PracticeSubmission");
const practiceproblemsSubmissions = async (req, res) => {
        try {
                const { email } = req.body;
                const submissions = await PracticeSubmissions.find({ user_email: email });

                // Check if any submissions were found

                // Send the submissions data to the frontend
                res.status(200).json({ submissions });
        } catch (error) {
                console.error("Error fetching submissions:", error);
                res.status(500).json({ error: "Internal Server Error" });
        }
};

const onlinecompilerSubmissions = async (req, res) => {
        try {
                const { email } = req.body;
                console.log(req.body);
                console.log(email);
                const submissions = await CompilerSubmission.find({ user_email: email });

                // Check if any submissions were found

                // Send the submissions data to the frontend
                res.status(200).json({ submissions });
        } catch (error) {
                console.error("Error fetching submissions:", error);
                res.status(500).json({ error: "Internal Server Error" });
        }
};

module.exports = { practiceproblemsSubmissions, onlinecompilerSubmissions };
