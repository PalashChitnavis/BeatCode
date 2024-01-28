/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import NavBar from "../NavBar/NavBar";
import CodeEditor from "../CodeEditor/CodeEditor";
import "./LeftPart.css";
const LeftPart = () => {
        return (
                <div className="flex flex-col w-[68vw]">
                        <NavBar />
                        <CodeEditor />
                </div>
        );
};

export default LeftPart;
