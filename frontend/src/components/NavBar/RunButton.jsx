/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useBody } from "../../context/BodyContext";
import "./RunButton.css";
const RunButton = () => {
        const { body } = useBody();
        const handleClick = () => {
                console.log(body);
        };
        return (
                <button className="css-button-arrow--green" onClick={handleClick}>
                        Run
                </button>
        );
};

export default RunButton;
