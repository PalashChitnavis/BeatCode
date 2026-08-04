// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define user schema
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Create and export User model
const User = mongoose.model("User", userSchema);
module.exports = User;