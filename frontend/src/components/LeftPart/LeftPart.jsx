/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import NavBar from "../NavBar/NavBar";
import CodeEditor from "../CodeEditor/CodeEditor";

const LeftPart = () => {
        return (
                <div className="flex flex-col w-[68vw]">
                        <div className="w-[65vw] h-[7.5vh]">
                                <NavBar />
                        </div>
                        <CodeEditor />
                </div>
        );
};

export default LeftPart;
