// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
const dotenv = require("dotenv");
dotenv.config();
async function signup(req, res) {
        const { username, email, password } = req.body;
        console.log(req.body);
        try {
                // Check if the user already exists
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                        return res.status(200).json({ message: "Email already registered" });
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

async function login(email, password, res) {
        const frontendURL = process.env.FRONTEND_URL;
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
                console.log({ message: "Login successful", username: user.username, token, email: user.email });
                res.json({ message: "Login successful", username: user.username, token, email: user.email });
        } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
        }
}

async function googleLogin(email, username, res) {
        const frontendURL = process.env.FRONTEND_URL;
        try {
                // Check if user exists
                const user = await User.findOne({ email });
                let newUser = null;
                let token = null;
                if (!user) {
                        const password = generator.generate({ length: 10, numbers: true });
                        newUser = new User({
                                username: username,
                                email: email,
                                password: password,
                        });
                        await newUser.save();
                        token = jwt.sign({ userId: newUser._id, email: newUser.email }, "abcd1234", {
                                expiresIn: "1h",
                        });
                        res.json({ message: "Login successful", username: newUser.username, token, email: newUser.email });
                } else {
                        token = jwt.sign({ userId: user._id, email: user.email }, "abcd1234", {
                                expiresIn: "1h",
                        });
                        res.json({ message: "Login successful", username: user.username, token, email: user.email });
                }
        } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Server error" });
        }
}

module.exports = { signup, login, googleLogin };
