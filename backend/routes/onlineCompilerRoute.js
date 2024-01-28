const express = require("express");
const router = express.Router();
const onlineCompiler = require("../controller/onlineCompiler");

router.post("/run", (req, res) => {
        const { code, userInput, language } = req.body;
        console.log(req.body);
        onlineCompiler(code, language, userInput);

        res.status(200).json({ message: "Compilation started." });
});

module.exports = router;
