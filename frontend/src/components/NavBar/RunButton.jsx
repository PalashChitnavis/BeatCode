/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { useBody } from "../../context/BodyContext";
import { runCode } from "../../services/onlineCompilerApi";
import "./RunButton.css";
const RunButton = () => {
        const [isLoading, setIsLoading] = useState(false);
        const { body, updateBody } = useBody();
        const reqBody = {
                code: body.code,
                userInput: body.userInput.trim(),
                language: body.language,
        };
        const handleClick = async () => {
                setIsLoading(true);
                try {
                        const result = await runCode(reqBody);
                        console.log(result);
                        if (result.stdout) {
                                updateBody({ ...body, output: result.stdout });
                        } else {
                                updateBody({ ...body, output: `Error During Execution : \n ${result.stderr}` });
                        }
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
