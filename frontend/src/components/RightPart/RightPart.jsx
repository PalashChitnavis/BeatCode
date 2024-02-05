/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import OutputWindow from "../OutputWindow/OutputWindow";
import InputWindow from "../InputWindow/InputWindow";

const RightPart = () => {
        return (
                <div className="flex flex-col w-[30vw] h-[80vh] gap-[2vh] justify-around ml-[2vw] mt-[5.5vh]">
                        <div className="w-[28vw] h-[30vh]">
                                <InputWindow />
                        </div>
                        <div className="w-[28vw] h-[30vh]">
                                <OutputWindow />
                        </div>
                </div>
        );
};

export default RightPart;
