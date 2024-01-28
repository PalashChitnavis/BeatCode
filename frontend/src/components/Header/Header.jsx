/* eslint-disable no-unused-vars */
import React from "react";

import Register from "../Login/register";
import { isLoggedIn } from "../Login/isLoggedIn";
import Profile from "../Login/Profile";
const Header = () => {
        return (
                <div className="h-[8vh] w-full flex justify-between items-center bg-[#2f3136] text-white px-5">
                        <div className="w-2/5 flex flex-row justify-between bg-[#2f3136]">
                                <div className="icon">Icon</div>
                                <div className="bg-[#2f3136] w-6/12 flex justify-between">
                                        <div>practice problems</div>
                                        <div>online compiler</div>
                                </div>
                        </div>
                        <div className="bg-[#2f3136] h-[8vh] w-[10%] flex flex-row items-center justify-end m-0">
                                <div>{isLoggedIn() ? <Profile /> : <Register />}</div>
                        </div>
                </div>
        );
};

export default Header;
