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
                <div className="flex w-[100%] h-[100%] justify-between items-center gap-[20%] bg-neutral-800 text-[white] border ml-[2%] mt-[1%] pl-[2%] pr-[2%] rounded-[10px] border-solid border-[whitesmoke]">
                        <div className="w-[27%] h-[100%] flex items-center justify-center">
                                <LanguageSelector />
                        </div>
                        <div className="flex items-center w-[30%] justify-around bg-neutral-800">
                                <ResetCode />
                                <Settings />
                                <RunButton />
                        </div>
                </div>
        );
};

export default NavBar;
