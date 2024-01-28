/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import ResetCode from "./ResetCode";
import Settings from "./Settings";
import { useBody } from "../../context/BodyContext";
import "./NavBar.css";
const NavBar = () => {
        const { body } = useBody();
        return (
                <div className="flex w-[65vw] h-[6.5vh] justify-between items-center gap-[2vw] bg-neutral-800 text-[white] border ml-[1.5vw] mt-[1.5vh] pl-[2vw] pr-[1vw] rounded-[10px] border-solid border-[whitesmoke]">
                        <LanguageSelector />
                        <div className="flex items-center w-1/5 justify-around bg-neutral-800">
                                <ResetCode />
                                <Settings />
                                <RunButton />
                        </div>
                </div>
        );
};

export default NavBar;
