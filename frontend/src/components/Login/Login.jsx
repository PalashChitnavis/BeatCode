import React from "react";

const Login = ({ userData, onClick }) => {
        return (
                <div>
                        Login
                        <form>
                                <label>Email:</label>
                                <input
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                />
                                <br />
                                <label>Password:</label>
                                <input
                                        type="password"
                                        value={userData.password}
                                        onChange={(e) =>
                                                setUserData({
                                                        ...userData,
                                                        password: e.target.value,
                                                })
                                        }
                                />
                                <br />
                                <button type="button" onClick={handleRegister}>
                                        Register
                                </button>
                        </form>
                </div>
        );
};

export default Login;
