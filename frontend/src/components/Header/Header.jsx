/* eslint-disable no-unused-vars */
import React from "react";

import Register from "../Login/register";
import { isLoggedIn } from "../Login/isLoggedIn";
import Profile from "../Login/Profile";
import { Link } from "react-router-dom";
const Header = () => {
        return (
                <div className="h-[8vh] w-full flex justify-between items-center bg-[#2f3136] text-white px-5">
                        <div className="w-3/6 flex flex-row justify-between bg-[#2f3136]">
                                <Link to="/">
                                        <div className="icon w-[10vw]">Icon</div>
                                </Link>
                                <div className="bg-[#2f3136] w-[28vw] gap-[1vw] flex justify-between items-center">
                                        <div className="w-[12vw] bg-[#16a34a] flex justify-center items-center h-[35px] font-semibold rounded-[10px]">
                                                <Link to="/practiceproblems">Practice Problems</Link>
                                        </div>
                                        <div className="w-[12vw] bg-[#16a34a] flex justify-center items-center h-[35px] font-semibold rounded-[10px]">
                                                <Link to="/onlinecompiler">Online Compiler</Link>
                                        </div>
                                </div>
                        </div>
                        <div className="bg-[#2f3136] h-[8vh] w-[10%] flex flex-row items-center justify-end m-0">
                                <div>{isLoggedIn() ? <Profile /> : <Register />}</div>
                        </div>
                </div>
        );
};

export default Header;
