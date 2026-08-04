const express = require("express");
const router = express.Router();
const onlineCompiler = require("../controller/onlineCompiler");
const practiceProblemController = require("../controller/practiceProblemController");
// Runs code entered in the standalone online compiler.
router.post("/onlinecompiler", (req, res) => {
        const { code, userInput, language, userEmail, userName } = req.body;
        onlineCompiler(code, language, userInput, userEmail, userName, res);
});
// Runs a submitted solution for a selected practice problem.
router.post("/practiceproblems", (req, res) => {
        const { code, language, questionID, userEmail, userName } = req.body;
        practiceProblemController(code, language, questionID, userEmail, userName, res);
});

module.exports = router;
