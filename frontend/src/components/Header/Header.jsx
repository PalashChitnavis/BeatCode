/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import Register from "../Login/Register";
import { isLoggedIn } from "../Login/isLoggedIn";
import Profile from "../Login/Profile";
import { Link } from "react-router-dom";
import { Button, colors } from "@mui/material";
const Header = () => {
        const [screen, setScreen] = useState(window.screen.width);
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        window.addEventListener("resize", handleResize);
        function handleResize() {
                setScreen(window.screen.width);
        }
        const toggleMenu = () => {
                setIsMenuOpen(!isMenuOpen);
        };
        return (
                <div className=" w-full h-full flex justify-between items-center bg-[#2f3136] text-white  z-10 shadow-md ">
                        <div className="w-full h-full flex flex-row justify-between items-center bg-[#2f3136]">
                                {screen > 1024 ? (
                                        <div className="bg-[#2f3136] w-[100%] flex justify-between items-center text-nowrap px-5">
                                                <div className="icon w-[15%] flex justify-center items-center rounded-[10px] bg-[#fb690a] p-1">
                                                        <Link to="/">
                                                                <img
                                                                        className=" w-[100%]"
                                                                        src="/logo.svg"
                                                                        alt="beatcode-logo"
                                                                />
                                                        </Link>
                                                </div>

                                                <div className="bg-[#2f3136] w-[50%] gap-2 flex justify-around items-center text-nowrap">
                                                        <Link to="/practiceproblems">
                                                                <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        sx={{
                                                                                backgroundColor: "#16a34a",
                                                                                borderRadius: 2,
                                                                        }}
                                                                >
                                                                        Practice Problems
                                                                </Button>
                                                        </Link>
                                                        <Link to="/onlinecompiler">
                                                                <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        sx={{
                                                                                backgroundColor: "#16a34a",
                                                                                borderRadius: 2,
                                                                        }}
                                                                >
                                                                        Online Compiler
                                                                </Button>
                                                        </Link>
                                                        <Link to="/room">
                                                                <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        sx={{
                                                                                backgroundColor: "#16a34a",
                                                                                borderRadius: 2,
                                                                        }}
                                                                >
                                                                        Code Room
                                                                </Button>
                                                        </Link>
                                                        <Link to="/leaderboard">
                                                                <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        sx={{
                                                                                backgroundColor: "#16a34a",
                                                                                borderRadius: 2,
                                                                        }}
                                                                >
                                                                        Leaderboard
                                                                </Button>
                                                        </Link>
                                                </div>
                                                <div className={`w-[${isLoggedIn() ? "10%" : "15%"}] flex justify-end`}>
                                                        <div>{isLoggedIn() ? <Profile /> : <Register />}</div>
                                                </div>
                                        </div>
                                ) : (
                                        <>
                                                {isMenuOpen ? (
                                                        <>
                                                                <div
                                                                        className="fixed left-0 w-full h-full z-[1999] bg-[rgba(0,0,0,0.5)]  top-0"
                                                                        onClick={toggleMenu}
                                                                ></div>
                                                                <div className="fixed z-[2000] left-[10%] top-[20%] w-[10%] pl-8">
                                                                        <i
                                                                                className="fa-solid fa-xmark ml-auto text-3xl"
                                                                                onClick={toggleMenu}
                                                                        ></i>
                                                                </div>

                                                                <div className="fixed w-[70%] h-[50%] left-[15%] top-[25%] flex justify-center  flex-col p-4 gap-2  items-center bg-[#272822]  z-[2000] shadow-sm">
                                                                        <div className="text-xl py-1 flex flex-col justify-around h-full items-center border border-solid w-full">
                                                                                <div className="w-full flex justify-center items-center h-[20%]">
                                                                                        <div className="rounded-xl border p-2 bg-green-600">
                                                                                                <Link to="/">Home</Link>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="w-full flex justify-center items-center h-[20%]">
                                                                                        <div className="rounded-xl border p-2 bg-green-600">
                                                                                                <Link to="/practiceproblems">
                                                                                                        Practice Problems
                                                                                                </Link>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="w-full flex justify-center items-center h-[20%]">
                                                                                        <div className="rounded-xl border p-2 bg-green-600">
                                                                                                <Link to="/onlinecompiler">
                                                                                                        Online Compiler
                                                                                                </Link>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="w-full flex justify-center items-center h-[20%]">
                                                                                        <div className="rounded-xl border p-2 bg-green-600">
                                                                                                <Link to="/room">
                                                                                                        Code Room
                                                                                                </Link>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="w-full flex justify-center items-center h-[20%]">
                                                                                        <div className="rounded-xl border p-2 bg-green-600">
                                                                                                <Link to="leaderboard">
                                                                                                        Leaderboard
                                                                                                </Link>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                                <div className="flex w-full h-full justify-between items-center px-4">
                                                                        <div className="w-[10%]">
                                                                                <i
                                                                                        className="fa-solid fa-bars ml-auto text-3xl"
                                                                                        onClick={toggleMenu}
                                                                                ></i>
                                                                        </div>

                                                                        <div className="w-[50%]  flex justify-center items-center">
                                                                                <div className="bg-[#fb690a] w-full p-2 rounded-xl flex justify-center items-center">
                                                                                        <Link to="/">
                                                                                                <img
                                                                                                        className="w-[100%] flex justify-center items-center"
                                                                                                        src="/logo.svg"
                                                                                                        alt="beatcode-logo"
                                                                                                />
                                                                                        </Link>
                                                                                </div>
                                                                        </div>
                                                                        <div className="w-[20%]">
                                                                                <div>
                                                                                        {isLoggedIn() ? (
                                                                                                <Profile />
                                                                                        ) : (
                                                                                                <Register />
                                                                                        )}
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </>
                                                ) : (
                                                        <div className="flex w-full h-full justify-between items-center px-4">
                                                                <div className="w-[10%]">
                                                                        <i
                                                                                className="fa-solid fa-bars ml-auto text-3xl"
                                                                                onClick={toggleMenu}
                                                                        ></i>
                                                                </div>

                                                                <div className="w-[50%]  flex justify-center items-center">
                                                                        <div className="bg-[#fb690a] w-full p-2 rounded-xl flex justify-center items-center">
                                                                                <Link to="/">
                                                                                        <img
                                                                                                className="w-[100%] flex justify-center items-center"
                                                                                                src="/logo.svg"
                                                                                                alt="beatcode-logo"
                                                                                        />
                                                                                </Link>
                                                                        </div>
                                                                </div>
                                                                <div className="w-[20%]">
                                                                        <div>
                                                                                {isLoggedIn() ? <Profile /> : <Register />}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                )}
                                        </>
                                )}
                        </div>
                </div>
        );
};

export default Header;
