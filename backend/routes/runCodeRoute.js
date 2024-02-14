const express = require("express");
const router = express.Router();
const onlineCompiler = require("../controller/onlineCompiler");
const practiceProblemController = require("../controller/practiceProblemController");
router.post("/onlinecompiler", (req, res) => {
        const { code, userInput, language, userEmail, userName } = req.body;
        onlineCompiler(code, language, userInput, userEmail, userName, res);
});
router.post("/practiceproblems", (req, res) => {
        const { code, language, questionID, userEmail, userName } = req.body;
        practiceProblemController(code, language, questionID, userEmail, userName, res);
});

module.exports = router;
