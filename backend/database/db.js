const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/beetcode", {})
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;
