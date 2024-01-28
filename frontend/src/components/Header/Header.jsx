/* eslint-disable no-unused-vars */
import React from "react";
import "./Header.css";
import Register from "../Login/register";
const Header = () => {
        return (
                <div className="header">
                        <div className="left">
                                <div className="icon">Icon</div>
                                <div className="options">
                                        <div>practice problems</div>
                                        <div>online compiler</div>
                                </div>
                        </div>
                        <div className="right">
                                <div>
                                        <Register />
                                </div>
                        </div>
                </div>
        );
};

export default Header;
