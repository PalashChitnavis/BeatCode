const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const runCodeRoute = require("./routes/runCodeRoute");
const practiceProblemsRoute = require("./routes/practiceProblemsRoute");
const authRoute = require("./routes/authRoute");
const submissionsRoute = require("./routes/submissionsRoute");
dotenv.config();
const mongoose = require("mongoose");
const getSubmissionsRoute = require("./routes/getSubmissionsRoute");
const getStatsRoute = require("./routes/getStatsRoute");
const getUserDataRoute = require("./routes/getUserDataRoute");
const googleAuthRoute = require("./routes/googleAuthRoute");

mongoose.connect(process.env.DB_URL, {})
        .then(() => {
                console.log("MongoDB connected");
                app.listen(port, () => {
                        console.log(`Server is running on http://localhost:${port}`);
                });
        })
        .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/run", runCodeRoute);
app.use("/practiceproblems", practiceProblemsRoute);
app.use("/register", authRoute);
app.use("/submissions", submissionsRoute);
app.use("/getsubmissions", getSubmissionsRoute);
app.use("/getstats", getStatsRoute);
app.use("/getuser", getUserDataRoute);
app.use("/google", googleAuthRoute);
