import { useState } from "react";
import { signup, login } from "../../services/registerApi";

const Register = () => {
        const [userData, setUserData] = useState({
                username: "",
                email: "",
                password: "",
        });

        const handleRegister = async (type) => {
                if (type === "signup") {
                        if (!userData.username) {
                                alert("Username is required");
                                return;
                        }
                }
                if (!userData.email) {
                        alert("Email is required");
                        return;
                } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
                        alert("Invalid email format");
                        return;
                }
                if (!userData.password) {
                        alert("Password is required");
                        return;
                } else if (userData.password.length < 6) {
                        alert("Password must be at least 6 characters long");
                        return;
                }
                if (type === "signup") {
                        await signup(userData);
                }
                if (type === "login") {
                        await login(userData);
                }
        };
        const [toggleRegister, setToggleRegister] = useState(false);
        const toggle = () => {
                setToggleRegister(!toggleRegister);
        };
        const [activeButton, setActiveButton] = useState("signup");
        const handleButtonClick = (buttonName) => {
                setActiveButton(buttonName);
        };
        return (
                <div>
                        <button
                                className="w-[8vw] bg-[rgb(51,51,254)] h-[35px] font-semibold rounded-[10px]"
                                onClick={toggle}
                        >
                                Register
                        </button>
                        {toggleRegister && (
                                <div>
                                        <div
                                                className="fixed w-full h-full bg-[rgba(0,0,0,0.5)] z-[1000] left-0 top-0"
                                                onClick={toggle}
                                        ></div>
                                        <div className="bg-[#2f3136] fixed -translate-x-2/4 -translate-y-2/4 z-[1001] w-[30vw] h-[70vh]  border p-5 rounded-[10px] border-solid border-[#ccc] left-2/4 top-2/4">
                                                <div className="flex w-full items-center justify-center">
                                                        <button
                                                                className={`border w-[10vw] h-10 bg-[#179b77]  border-solid border-[white] hover:bg-[#179b77]  
                                                                        ${
                                                                                activeButton === "signup"
                                                                                        ? `bg-[#179b77]`
                                                                                        : `bg-[#435359]`
                                                                        }`}
                                                                onClick={() => handleButtonClick("signup")}
                                                        >
                                                                Sign Up
                                                        </button>
                                                        <button
                                                                className={`border w-[10vw] h-10 bg-[#179b77] border-solid border-[white] hover:bg-[#179b77]   
                                                                        ${
                                                                                activeButton === "login"
                                                                                        ? "bg-[#179b77]"
                                                                                        : "bg-[#435359]"
                                                                        }`}
                                                                onClick={() => handleButtonClick("login")}
                                                        >
                                                                Log In
                                                        </button>
                                                </div>
                                                {activeButton === "signup" ? (
                                                        <form className="w-full flex flex-col h-[50vh] mt-[5vh]">
                                                                <p className="text-center text-[28px] mb-[2vh]">
                                                                        Sign Up for Free
                                                                </p>
                                                                <input
                                                                        className="h-14 text-[black] mt-[2vh] pl-2.5"
                                                                        placeholder="User Name *"
                                                                        type="text"
                                                                        value={userData.username}
                                                                        required
                                                                        onChange={(e) =>
                                                                                setUserData({
                                                                                        ...userData,
                                                                                        username: e.target.value,
                                                                                })
                                                                        }
                                                                />
                                                                <br />
                                                                <input
                                                                        className="h-14 text-[black] mt-[2vh] pl-2.5"
                                                                        placeholder="Email Address *"
                                                                        type="email"
                                                                        required
                                                                        value={userData.email}
                                                                        onChange={(e) =>
                                                                                setUserData({
                                                                                        ...userData,
                                                                                        email: e.target.value,
                                                                                })
                                                                        }
                                                                />
                                                                <br />
                                                                <input
                                                                        className="h-14 text-[black] mt-[2vh] pl-2.5"
                                                                        placeholder="Set a Password *"
                                                                        required
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
                                                                <button
                                                                        className="bg-[#179b77] w-full h-[70px] mt-[0.5vh] text-3xl"
                                                                        type="button"
                                                                        onClick={() => {
                                                                                handleRegister("signup");
                                                                        }}
                                                                >
                                                                        Get Started
                                                                </button>
                                                        </form>
                                                ) : (
                                                        <form className="w-full flex flex-col h-[50vh] mt-[5vh]">
                                                                <p className="text-center text-[28px] mt-[2vh]">
                                                                        Welcome Back!
                                                                </p>
                                                                <input
                                                                        className="h-10 text-[black] mt-[6vh] pl-2.5"
                                                                        placeholder="Email Address *"
                                                                        type="email"
                                                                        required
                                                                        value={userData.email}
                                                                        onChange={(e) =>
                                                                                setUserData({
                                                                                        ...userData,
                                                                                        email: e.target.value,
                                                                                })
                                                                        }
                                                                />
                                                                <br />
                                                                <input
                                                                        className="h-10 text-[black] mt-[3vh] pl-2.5"
                                                                        placeholder="Password *"
                                                                        required
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
                                                                <button
                                                                        className="bg-[#179b77] w-full h-[60px] mt-[5vh] text-3xl"
                                                                        type="button"
                                                                        onClick={() => {
                                                                                handleRegister("login");
                                                                        }}
                                                                >
                                                                        Log In
                                                                </button>
                                                        </form>
                                                )}
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default Register;
