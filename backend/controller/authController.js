// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
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

                res.status(201).json({ message: "User registered successfully" });
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
                        return res.status(400).json({ error: "email doesnt exist , please register" });
                }

                // Check password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                        return res.status(400).json({ error: "password is incorrect" });
                }
                res.json({ message: "Login successful", username: user.username });
        } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
        }
}

module.exports = { signup, login };
