const express = require("express");
const router = express.Router();
const onlineCompiler = require("../controller/onlineCompiler");
const practiceProblemController = require("../controller/practiceProblemController");
router.post("/onlinecompiler", (req, res) => {
        const { code, userInput, language, userEmail } = req.body;
        onlineCompiler(code, language, userInput, userEmail, res);
});
router.post("/practiceproblems", (req, res) => {
        const { code, language, questionID, userEmail } = req.body;
        practiceProblemController(code, language, questionID, userEmail, res);
});

module.exports = router;
