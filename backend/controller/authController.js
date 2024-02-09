// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function signup(req, res) {
        const { username, email, password } = req.body;
        console.log(req.body);
        try {
                // Check if the user already exists
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                        return res.status(400).json({ message: "Email already registered" });
                }

                // Create a new user
                const newUser = new User({ username, email, password });
                await newUser.save();

                res.status(201).json({ message: "User registered successfully", success: true });
        } catch (error) {
                console.error("Error registering user:", error);
                res.status(500).json({ message: "Internal server error" });
        }
}

async function login(req, res) {
        const { email, password } = req.body;
        console.log(req.body);
        try {
                // Check if user exists
                const user = await User.findOne({ email });
                if (!user) {
                        return res.status(400).json({ error: "Email doesnt exist , please register" });
                }

                // Check password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                        return res.status(400).json({ error: "Password is incorrect" });
                }

                const token = jwt.sign({ userId: user._id, email: user.email }, "abcd1234", {
                        expiresIn: "1h",
                });

                res.json({ message: "Login successful", username: user.username, token, email: user.email });
        } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
        }
}

module.exports = { signup, login };
