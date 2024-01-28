const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const onlineCompilerRoute = require("./routes/onlineCompilerRoute");
const authRoute = require("./routes/authRoute");
const db = require("./database/db");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/onlinecompiler", onlineCompilerRoute);
app.use("/register", authRoute);
app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
});
