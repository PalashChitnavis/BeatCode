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
                        <p className="right-input">
                                Input <span>(Enter input if required before pressing run)</span>
                        </p>
                        <textarea
                                className="input"
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
