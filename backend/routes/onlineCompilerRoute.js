const express = require("express");
const router = express.Router();
const onlineCompiler = require("../controller/onlineCompiler");

router.post("/run", (req, res) => {
        const { code, userInput, language, userEmail } = req.body;
        onlineCompiler(code, language, userInput, userEmail, res);
});

module.exports = router;
