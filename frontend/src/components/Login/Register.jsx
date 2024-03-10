import { useState } from "react";
import { signup, login } from "../../services/registerApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getGoogleAuth } from "../../services/getGoogleAuth";
const Register = () => {
        const [userData, setUserData] = useState({
                username: "",
                email: "",
                password: "",
        });

        const handleRegister = async (type) => {
                if (type === "signup") {
                        if (!userData.username) {
                                toast.warn("Username is required");
                                return;
                        }
                }
                if (!userData.email) {
                        toast.warn("Email is required");
                        return;
                } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
                        toast.warn("Invalid email format");
                        return;
                }
                if (!userData.password) {
                        toast.warn("Password is required");
                        return;
                } else if (userData.password.length < 6) {
                        toast.warn("Password must be at least 6 characters long");
                        return;
                }
                if (type === "signup") {
                        await signup(userData);
                }
                if (type === "login") {
                        await login(userData, "normal");
                }
        };
        const [toggleRegister, setToggleRegister] = useState(false);
        const toggle = () => {
                setToggleRegister(!toggleRegister);
        };
        const [activeButton, setActiveButton] = useState("login");
        const handleButtonClick = (buttonName) => {
                setActiveButton(buttonName);
        };
        const handleKeyDown = (event, type) => {
                if (event.key === "Enter") {
                        handleRegister(type);
                }
        };

        return (
                <div className="h-full w-full">
                        <button className="bg-[rgb(51,51,254)] text-md p-1  font-semibold rounded-[10px]" onClick={toggle}>
                                Register
                        </button>
                        {toggleRegister && (
                                <div>
                                        <div
                                                className="fixed w-full h-full bg-[rgba(0,0,0,0.5)] z-[1000] left-0 top-0"
                                                onClick={toggle}
                                        ></div>
                                        <div className="bg-[#2f3136] fixed w-[80%] lg:w-[30%] lg:left-[35%] h-[75%] left-[10%] top-[15%] flex justify-center items-center flex-col  z-[1001]  border p-5 rounded-[10px] border-solid border-[#ccc] ">
                                                <div className="flex w-full items-center justify-center">
                                                        <button
                                                                className={`border w-[40%] lg:w-[30%] h-10 rounded-l-md   bg-[#179b77] border-solid border-[white] hover:bg-[#179b77]   
                                                                        ${
                                                                                activeButton === "login"
                                                                                        ? "bg-[#179b77]"
                                                                                        : "bg-[#435359]"
                                                                        }`}
                                                                onClick={() => handleButtonClick("login")}
                                                        >
                                                                Log In
                                                        </button>
                                                        <button
                                                                className={`border w-[40%] lg:w-[30%] rounded-r-md h-10 bg-[#179b77]  border-solid border-[white] hover:bg-[#179b77]  
                                                                        ${
                                                                                activeButton === "signup"
                                                                                        ? `bg-[#179b77]`
                                                                                        : `bg-[#435359]`
                                                                        }`}
                                                                onClick={() => handleButtonClick("signup")}
                                                        >
                                                                Sign Up
                                                        </button>
                                                </div>
                                                {activeButton === "signup" ? (
                                                        <div className="w-full flex flex-col h-[100%] lg:w-[80%] justify-center">
                                                                <form className="w-full  flex flex-col">
                                                                        <p className="text-center text-3xl py-3 pb-7">
                                                                                Sign up for free
                                                                        </p>
                                                                        <input
                                                                                className="py-3 text-[black] pl-2.5"
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
                                                                                autoComplete="off"
                                                                                onKeyDown={(e) => handleKeyDown(e, "signup")}
                                                                        />
                                                                        <br />
                                                                        <input
                                                                                className="py-3 text-[black] pl-2.5"
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
                                                                                autoComplete="off"
                                                                                onKeyDown={(e) => handleKeyDown(e, "signup")}
                                                                        />
                                                                        <br />
                                                                        <input
                                                                                className="py-3 text-[black] pl-2.5"
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
                                                                                onKeyDown={(e) => handleKeyDown(e, "signup")}
                                                                                autoComplete="off"
                                                                        />
                                                                        <br />
                                                                        <button
                                                                                className="bg-[#179b77] w-full py-2  text-xl"
                                                                                type="button"
                                                                                onClick={() => {
                                                                                        handleRegister("signup");
                                                                                }}
                                                                        >
                                                                                Get Started
                                                                        </button>
                                                                </form>
                                                                <button
                                                                        className="w-full py-2 mt-5 text-xl flex gap-5 justify-center items-center bg-[#4f86ec] text-white"
                                                                        onClick={() => {
                                                                                toast.warn("Still working on this ...");
                                                                        }}
                                                                >
                                                                        <i className="fa-brands fa-google" />
                                                                        <span> Sign up with Google</span>
                                                                </button>
                                                        </div>
                                                ) : (
                                                        <div className="w-full flex flex-col h-[100%] lg:w-[80%] justify-center">
                                                                <form className="w-full flex flex-col justify-center ">
                                                                        <p className="text-center text-[28px] py-8">
                                                                                Welcome Back!
                                                                        </p>
                                                                        <input
                                                                                className="py-3 text-[black] pl-2.5"
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
                                                                                autoComplete="off"
                                                                                onKeyDown={(e) => handleKeyDown(e, "login")}
                                                                        />
                                                                        <br />
                                                                        <input
                                                                                className="py-3 text-[black] pl-2.5"
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
                                                                                autoComplete="off"
                                                                                onKeyDown={(e) => handleKeyDown(e, "login")}
                                                                        />
                                                                        <br />
                                                                        <button
                                                                                className="bg-[#179b77] w-full py-2  text-xl"
                                                                                type="button"
                                                                                onClick={() => {
                                                                                        handleRegister("login");
                                                                                }}
                                                                        >
                                                                                Log In
                                                                        </button>
                                                                </form>
                                                                <button
                                                                        className="w-full py-2 mt-5 text-xl flex gap-5 justify-center items-center bg-[#4f86ec] text-white"
                                                                        onClick={() => {
                                                                                toast.warn("Still working on this ...");
                                                                        }}
                                                                >
                                                                        <i className="fa-brands fa-google" />
                                                                        <span> Sign in with Google</span>
                                                                </button>
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default Register;
