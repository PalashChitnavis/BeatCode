// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
const dotenv = require("dotenv");
dotenv.config();

// ---------- User Registration ----------
async function signup(req, res) {
    const { username, email, password } = req.body;
    console.log(req.body);

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ message: "Email already registered" });
        }

        // Create and save new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// ---------- Email/Password Login ----------
async function login(email, password, res) {
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Email doesnt exist , please register" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Password is incorrect" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, "abcd1234", {
            expiresIn: "1h",
        });

        console.log({ message: "Login successful", username: user.username, token, email: user.email });
        res.json({ message: "Login successful", username: user.username, token, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

// ---------- Google OAuth Login ----------
async function googleLogin(email, username, res) {
    try {
        let user = await User.findOne({ email });
        let token;

        if (!user) {
            // Create new user with generated password if not exists
            const password = generator.generate({ length: 10, numbers: true });
            user = new User({
                username: username,
                email: email,
                password: password,
            });
            await user.save();
        }

        // Generate token for both existing and new user
        token = jwt.sign({ userId: user._id, email: user.email }, "abcd1234", {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", username: user.username, token, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = { signup, login, googleLogin };