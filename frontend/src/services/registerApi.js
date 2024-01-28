import axios from "axios";

export const signup = async (userData) => {
        await axios
                .post(`http://localhost:3000/register/signup`, userData)
                .then((res) => {
                        if (res) {
                                alert("signup successful " + res.data.message);
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
                        console.log(res);
                        if (res) {
                                alert("login successful " + res.data.username);
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
