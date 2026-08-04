// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Import route handlers
const runCodeRoute = require("./routes/runCodeRoute");
const practiceProblemsRoute = require("./routes/practiceProblemsRoute");
const authRoute = require("./routes/authRoute");
const submissionsRoute = require("./routes/submissionsRoute");
const getSubmissionsRoute = require("./routes/getSubmissionsRoute");
const getStatsRoute = require("./routes/getStatsRoute");
const getUserDataRoute = require("./routes/getUserDataRoute");
const googleAuthRoute = require("./routes/googleAuthRoute");
const leaderboard = require("./routes/leaderBoardRoute");

// Import socket controller
const socketController = require("./controller/socketController");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req, res) => {
    res.send("The server is running , this is just a test route");
});

// API routes
app.use("/run", runCodeRoute);
app.use("/practiceproblems", practiceProblemsRoute);
app.use("/register", authRoute);
app.use("/submissions", submissionsRoute);
app.use("/getsubmissions", getSubmissionsRoute);
app.use("/getstats", getStatsRoute);
app.use("/getuser", getUserDataRoute);
app.use("/leaderboard", leaderboard);

// Connect to MongoDB and start server
mongoose.connect(process.env.DB_URL, {})
    .then(() => {
        console.log("MongoDB connected");
        const server = app.listen(port, "0.0.0.0", () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
        // Attach socket.io to the server
        socketController(server);
    })
    .catch((err) => console.error("MongoDB connection error:", err));