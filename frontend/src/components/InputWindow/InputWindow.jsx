/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./InputWindow.css";

import { useBody } from "../../context/BodyContext";
const InputWindow = () => {
        const { body, updateBody } = useBody();
        const handleInputChange = (event) => {
                updateBody({ ...body, userInput: event.target.value });
        };

        return (
                <>
                        <p className="text-[white] text-xl">
                                Input <span className="text-sm pl-2.5">(Enter input if required before pressing run)</span>
                        </p>
                        <textarea
                                className="bg-[#272822] text-[aliceblue] w-[28.5vw] h-[48%] resize-none text-xl leading-[1.3] border p-2.5 rounded-[10px] border-solid border-[white]"
                                name="userInput"
                                id="userInput"
                                cols="50"
                                rows="4"
                                placeholder="Enter Input Value Here"
                                onChange={handleInputChange}
                        />
                </>
        );
};

export default InputWindow;
