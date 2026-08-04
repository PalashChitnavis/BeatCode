const express = require("express");
const router = express.Router();
const getSubmissions = require("../controller/getSubmissions");
// Lists recent successful submissions for a practice question.
router.post("/", getSubmissions);

module.exports = router;
