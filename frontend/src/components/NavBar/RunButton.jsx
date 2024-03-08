/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { runCompilerCode, runPracticeCode } from "../../services/runCodeApi";
import { isLoggedIn } from "../Login/isLoggedIn";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./RunButton.css";
import { useDispatch, useSelector } from "react-redux";
import { updateOutput } from "../../redux/slices/outputSlice";
import { updateToggleOutput } from "../../redux/slices/toggleOutput";
import { updatePracticeStatus } from "../../redux/slices/practiceStatusSlice";
const RunButton = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [userEmail, setUserEmail] = useState("");
        const [userName, setUserName] = useState("");
        const location = useLocation();
        const { id } = useParams();
        const output = useSelector((state) => state.output?.value);
        const code = useSelector((state) => state.code?.value);
        const userInput = useSelector((state) => state.userInput?.value);
        const language = useSelector((state) => state.language?.value);
        const dispatch = useDispatch();
        useEffect(() => {
                if (isLoggedIn()) {
                        const email = localStorage.getItem("email");
                        const username = localStorage.getItem("username");
                        setUserEmail(email);
                        setUserName(username);
                }
        }, []);

        const handleClick = async () => {
                if (!isLoggedIn()) {
                        toast.warn("To save your submissions, please register", { position: "bottom-right" });
                }
                setIsLoading(true);
                try {
                        if (location.pathname.startsWith("/onlinecompiler") || location.pathname.startsWith("/room")) {
                                const reqBody = {
                                        code: code,
                                        userInput: userInput,
                                        language: language,
                                        userEmail: userEmail,
                                        userName: userName,
                                };
                                console.log(reqBody);
                                const result = await runCompilerCode(reqBody);
                                console.log(result);
                                if (result.stdout) {
                                        dispatch(updateOutput(result.stdout));
                                        dispatch(updateToggleOutput(true));
                                } else {
                                        dispatch(
                                                updateOutput(
                                                        `Error During Execution (Please check for semicolons and syntax errors) : \n ${result.stderr}`
                                                )
                                        );
                                        dispatch(updateToggleOutput(true));
                                }
                        }
                        if (location.pathname.startsWith("/practiceproblems")) {
                                const reqBody = {
                                        code: code,
                                        language: language,
                                        userEmail: userEmail,
                                        questionID: id,
                                        userName: userName,
                                };
                                console.log(reqBody);
                                const result = await runPracticeCode(reqBody);
                                console.log(result);
                                if (result?.resp?.stdout) {
                                        const index = result.resp.stdout?.indexOf("Test case 1");
                                        const trimmed_result = result.resp.stdout?.substring(index);
                                        dispatch(updateOutput(trimmed_result));
                                        dispatch(updateToggleOutput(true));
                                        dispatch(updatePracticeStatus(result.status));
                                } else {
                                        dispatch(
                                                updateOutput(
                                                        `Error During Execution (Please check for semicolons and syntax errors) : \n ${result.stderr}`
                                                )
                                        );
                                        dispatch(updateToggleOutput(true));
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
