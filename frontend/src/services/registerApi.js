import axios from "axios";

export const signup = async (userData) => {
        await axios
                .post(`http://localhost:3000/register/signup`, userData)
                .then((res) => {
                        if (res.data.success) {
                                alert("singup successful , logging in");
                                login(userData);
                        } else {
                                // Registration failed, display error alert with reason
                                alert("signup failed: " + res.data.message);
                        }
                })
                .catch((error) => {
                        alert("error" + error);
                        throw error.response.data.error;
                });
};
export const login = async (userData) => {
        await axios
                .post(`http://localhost:3000/register/login`, userData)
                .then((res) => {
                        const { token, username, email } = res.data;
                        localStorage.setItem("token", token);
                        localStorage.setItem("username", username);
                        localStorage.setItem("email", email);
                        console.log(res);
                        if (res) {
                                window.location.reload();
                        } else {
                                // Registration failed, display error alert with reason
                                alert("login failed: " + res.data.message);
                        }
                })
                .catch((error) => {
                        alert(error.response.data.error);
                        throw error.response.data.error;
                });
};
