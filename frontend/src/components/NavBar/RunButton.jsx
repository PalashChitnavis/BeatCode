/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useBody } from "../../context/BodyContext";
import axios from "axios";
import "./RunButton.css";
const RunButton = () => {
        const { body } = useBody();
        const reqBody = {
                code: body.code,
                userInput: body.userInput,
                language: body.language,
        };
        const handleClick = async () => {
                try {
                        const res = await axios.post("http://localhost:3000/api/run", reqBody);
                        console.log("Backend Response:", res.data);
                } catch (err) {
                        console.error("Error:", err.message);
                }
        };
        return (
                <button className="css-button-arrow--green" onClick={handleClick}>
                        Run
                </button>
        );
};

export default RunButton;
