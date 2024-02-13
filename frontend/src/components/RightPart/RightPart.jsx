/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import OutputWindow from "../OutputWindow/OutputWindow";
import InputWindow from "../InputWindow/InputWindow";

const RightPart = () => {
        return (
                <div className="flex flex-col w-[30vw] h-[80vh] gap-3 justify-around ml-[2vw] mt-[5.5vh]">
                        <div className="w-[95%] h-[40%]">
                                <InputWindow />
                        </div>
                        <div className="w-[95%] h-[40%]">
                                <OutputWindow />
                        </div>
                </div>
        );
};

export default RightPart;
