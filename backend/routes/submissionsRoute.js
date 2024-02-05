const express = require("express");
const router = express.Router();
const { practiceproblemsSubmissions, onlinecompilerSubmissions } = require("../controller/subMissions");

router.post("/practiceproblems", practiceproblemsSubmissions);
router.post("/onlinecompiler", onlinecompilerSubmissions);

module.exports = router;
