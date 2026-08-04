const express = require("express");
const router = express.Router();
const { practiceproblemsSubmissions, onlinecompilerSubmissions } = require("../controller/subMissions");

// Returns saved practice submissions for one user.
router.post("/practiceproblems", practiceproblemsSubmissions);
// Returns saved compiler runs for one user.
router.post("/onlinecompiler", onlinecompilerSubmissions);

module.exports = router;
