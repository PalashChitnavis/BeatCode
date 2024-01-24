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
                <div className="navbar">
                        <LanguageSelector />
                        <div className="set">
                                <ResetCode />
                                <Settings />
                                <RunButton />
                        </div>
                </div>
        );
};

export default NavBar;
