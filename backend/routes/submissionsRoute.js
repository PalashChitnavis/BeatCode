const express = require("express");
const router = express.Router();
const { practiceproblemsSubmissions, onlinecompilerSubmissions } = require("../controller/subMissions");

router.get("/practiceproblems", practiceproblemsSubmissions);
router.post("/onlinecompiler", onlinecompilerSubmissions);

module.exports = router;
