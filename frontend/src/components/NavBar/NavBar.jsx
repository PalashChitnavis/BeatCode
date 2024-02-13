/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import ResetCode from "./ResetCode";
import Settings from "./Settings";
import { useBody } from "../../context/BodyContext";
import ShareCode from "../ShareCode/ShareCode";
import { useLocation } from "react-router-dom";
import "./NavBar.css";
const NavBar = ({ socket, roomID }) => {
        const location = useLocation();
        const { body } = useBody();
        return (
                <div className="flex w-[100%] h-[100%] justify-between items-center gap-[20%] bg-neutral-800 text-[white] border ml-[2%] mt-[1%] pl-[2%] pr-[2%] rounded-[10px] border-solid border-[whitesmoke]">
                        <div className="w-[15%] h-[95%] flex items-center justify-center">
                                <LanguageSelector socket={socket} roomID={roomID} />
                        </div>
                        <div className="w-[60%] flex ">
                                {location.pathname === "/onlinecompiler" ? (
                                        <div className="w-[30%]">
                                                <ShareCode />
                                        </div>
                                ) : (
                                        <div className="w-[0%] h-[0%]"></div>
                                )}
                                <div
                                        className={`flex items-center justify-end  w-[${
                                                location.pathname != "/onlinecompiler" ? "100%" : "70%"
                                        }]  bg-neutral-800`}
                                >
                                        <div className="w-[25%]">
                                                <ResetCode />
                                        </div>
                                        <div className="w-[25%]">
                                                <Settings />
                                        </div>
                                        <div className="h-[35px] w-[50%]">
                                                <RunButton />
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default NavBar;
