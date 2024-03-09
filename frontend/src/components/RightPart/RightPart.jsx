/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import OutputWindow from "../OutputWindow/OutputWindow";
import InputWindow from "../InputWindow/InputWindow";

const RightPart = () => {
        return (
                <div className="flex  w-full h-[100%] lg:items-center gap-3 lg:gap-0   justify-around lg:flex-col lg:w-[45%] ">
                        <div className="w-[95%] h-[50%] lg:h-[40%]">
                                <InputWindow />
                        </div>
                        <div className="w-[95%] h-[50%] lg:h-[40%]">
                                <OutputWindow />
                        </div>
                </div>
        );
};

export default RightPart;
