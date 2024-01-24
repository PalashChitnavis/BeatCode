const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/run", (req, res) => {
        const { code, userInput, language } = req.body;
        console.log("Received Data:", { code, userInput, language });
});

app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
});
