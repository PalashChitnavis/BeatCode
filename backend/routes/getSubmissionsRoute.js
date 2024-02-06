const express = require("express");
const router = express.Router();
const getSubmissions = require("../controller/getSubmissions");
router.post("/", getSubmissions);

module.exports = router;
