/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { useBody } from "../../context/BodyContext";
import { runCode } from "../../services/onlineCompilerApi";
import "./RunButton.css";
const RunButton = () => {
        const [isLoading, setIsLoading] = useState(false);
        const { body } = useBody();
        const reqBody = {
                code: body.code,
                userInput: body.userInput,
                language: body.language,
        };
        const handleClick = async () => {
                setIsLoading(true);
                try {
                        const result = await runCode(reqBody);
                        console.log(result);
                } catch (err) {
                        console.error("error : " + err);
                } finally {
                        setIsLoading(false);
                }
        };
        return (
                <button className="css-button-arrow--green" onClick={handleClick} disabled={isLoading}>
                        {isLoading ? "Running..." : "Run"}
                </button>
        );
};

export default RunButton;
