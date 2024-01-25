const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const onlineCompilerRoute = require("./routes/onlineCompilerRoute");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/onlinecompiler", onlineCompilerRoute);
app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
});
