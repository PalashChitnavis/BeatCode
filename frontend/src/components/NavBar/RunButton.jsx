/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { useBody } from "../../context/BodyContext";
import { runCompilerCode, runPracticeCode } from "../../services/runCodeApi";
import { isLoggedIn } from "../Login/isLoggedIn";
import { useLocation, useParams } from "react-router-dom";
import "./RunButton.css";
const RunButton = () => {
        const [isLoading, setIsLoading] = useState(false);
        const { body, updateBody } = useBody();
        const [userEmail, setUserEmail] = useState("");
        const location = useLocation();
        const { id } = useParams();
        useEffect(() => {
                if (isLoggedIn()) {
                        const email = localStorage.getItem("email");
                        setUserEmail(email);
                }
        }, []);

        const handleClick = async () => {
                if (!isLoggedIn()) {
                        alert("To save your submissions please register");
                }
                setIsLoading(true);
                try {
                        if (location.pathname.startsWith("/onlinecompiler")) {
                                const reqBody = {
                                        code: body.code,
                                        userInput: body.userInput.trim(),
                                        language: body.language,
                                        userEmail: userEmail,
                                };
                                console.log(reqBody);
                                const result = await runCompilerCode(reqBody);
                                console.log(result);
                                if (result.stdout) {
                                        updateBody({ ...body, toggleOutput: true, output: result.stdout });
                                } else {
                                        updateBody({
                                                ...body,
                                                toggleOutput: true,
                                                output: `Error During Execution : \n ${result.stderr}`,
                                        });
                                }
                        }
                        if (location.pathname.startsWith("/practiceproblems")) {
                                const reqBody = {
                                        code: body.code,
                                        language: body.language,
                                        userEmail: userEmail,
                                        questionID: id,
                                };
                                console.log(reqBody);
                                const result = await runPracticeCode(reqBody);
                                console.log(result);
                                if (result.resp.stdout) {
                                        updateBody({
                                                ...body,
                                                toggleOutput: true,
                                                output: result.resp.stdout,
                                                practiceStatus: result.status,
                                        });
                                } else {
                                        updateBody({
                                                ...body,
                                                toggleOutput: true,
                                                output: `Error During Execution : \n ${result.stderr}`,
                                        });
                                }
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
