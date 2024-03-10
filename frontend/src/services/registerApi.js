/* eslint-disable no-self-assign */
import axios from "axios";
import { toast } from "react-toastify";
export const signup = async (userData) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        await axios
                .post(`${backendUrl}/register/signup`, userData)
                .then((res) => {
                        if (res.data.success) {
                                toast.success(`Logging you in, ${userData.username} `, {
                                        autoClose: 1000,
                                        position: "bottom-right",
                                });
                                setTimeout(() => {
                                        login(userData);
                                }, 1000);
                        } else {
                                // Registration failed, display error alert with reason
                                toast.warn(`signup failed: ${res.data.message}`);
                        }
                })
                .catch((error) => {
                        toast.warn("error" + error);
                        throw error.response.data.error;
                });
};
export const login = async (userData, type) => {
        if (type === "normal") {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                await axios
                        .post(`${backendUrl}/register/login`, userData)
                        .then((res) => {
                                const { token, username, email } = res.data;
                                localStorage.setItem("token", token);
                                localStorage.setItem("username", username);
                                localStorage.setItem("email", email);

                                if (res) {
                                        toast.success(`Welcome back, ${username}`, {
                                                autoClose: 1500,
                                                position: "bottom-right",
                                        });
                                        setTimeout(() => {
                                                window.location.reload();
                                        }, 1500);
                                } else {
                                        // Registration failed, display error alert with reason
                                        toast.warn("login failed: " + res.data.message);
                                }
                        })
                        .catch((error) => {
                                toast.warn(error.response.data.error);
                                throw error.response.data.error;
                        });
        }
        if (type === "google") {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const frontendURL = import.meta.env.VITE_FRONTEND_URL;
                await axios
                        .post(`${backendUrl}/register/google`, userData)
                        .then((res) => {
                                const { token, username, email } = res.data;
                                localStorage.setItem("token", token);
                                localStorage.setItem("username", username);
                                localStorage.setItem("email", email);

                                if (res) {
                                        toast.success(`Welcome back, ${username}`, {
                                                autoClose: 1500,
                                                position: "bottom-right",
                                        });
                                        setTimeout(() => {
                                                window.location.href = frontendURL;
                                        }, 1500);
                                } else {
                                        // Registration failed, display error alert with reason
                                        toast.warn("login failed: " + res.data.message);
                                }
                        })
                        .catch((error) => {
                                toast.warn(error.response.data.error);
                                throw error.response.data.error;
                        });
        }
};
