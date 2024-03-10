/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import axios from "axios";
import qs from "qs";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { login } from "./registerApi";
export const getGoogleAuth = async () => {
        const frontendURl = import.meta.env.VITE_FRONTEND_URL;
        const clientID = import.meta.env.VITE_CLIENT_ID;
        const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
        const options = {
                redirect_uri: `${frontendURl}/google/redirect`,
                client_id: clientID,
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
        window.location.href = finalURL;
};

export const handlegoogleRedirect = async (code) => {
        const frontendURl = import.meta.env.VITE_FRONTEND_URL;
        const clientID = import.meta.env.VITE_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
        console.log(code);
        const url = "https://oauth2.googleapis.com/token";
        const values = {
                code,
                client_id: clientID,
                client_secret: clientSecret,
                redirect_uri: `${frontendURl}/google/redirect`,
                grant_type: "authorization_code",
        };
        try {
                const response = await axios.post(url, qs.stringify(values), {
                        headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                        },
                });
                const { id_token } = response.data;
                console.log(id_token);
                const decode = jwtDecode(id_token);
                const userData = {
                        username: decode?.name,
                        email: decode?.email,
                };
                console.log(userData);
                login(userData, "google");
        } catch (error) {
                console.log("error at google oauth", error);
        }
};
