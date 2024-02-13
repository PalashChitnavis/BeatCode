const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const qs = require("querystring");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generator = require("generate-password");
const { login } = require("../controller/authController");
dotenv.config();
router.get("/redirect", async (req, res) => {
        const backendUrl = process.env.BACKEND_URL;
        const code = req.query.code;
        const url = "https://oauth2.googleapis.com/token";
        const values = {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${backendUrl}/google/redirect`,
                grant_type: "authorization_code",
        };

        try {
                const response = await axios.post(url, qs.stringify(values), {
                        headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                        },
                });
                const { id_token } = response.data;
                const googleUser = jwt.decode(id_token);
                const { email, name } = googleUser;
                let user = await User.findOne({ email });
                let newUser = null;
                if (!user) {
                        const password = generator.generate({ length: 10, numbers: true });
                        newUser = new User({
                                username: name,
                                email: email,
                                password: password,
                        });
                        await newUser.save();
                        login(email, password, res, "google");
                } else {
                        const { email, password } = user;
                        login(email, password, res, "google");
                }
        } catch (error) {
                console.log("error at google oauth", error);
        }
});

router.get("/auth", (req, res) => {
        const backendUrl = process.env.BACKEND_URL;
        const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
        const options = {
                redirect_uri: `${backendUrl}/google/redirect`,
                client_id: "387562730417-12s95lvq3jtp2t8ol6i258m670f4n0j4.apps.googleusercontent.com",
                access_type: "offline",
                response_type: "code",
                prompt: "consent",
                scope: [
                        "https://www.googleapis.com/auth/userinfo.profile",
                        "https://www.googleapis.com/auth/userinfo.email",
                ].join(" "),
        };
        const qs = new URLSearchParams(options);
        const finalURL = `${rootURL}?${qs.toString()}`;
        res.json({ finalURL });
});

module.exports = router;
