/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import OutputWindow from "../OutputWindow/OutputWindow";
import InputWindow from "../InputWindow/InputWindow";
import "./RightPart.css";
const RightPart = () => {
        return (
                <div className="right">
                        <InputWindow />
                        <OutputWindow />
                </div>
        );
};

export default RightPart;
