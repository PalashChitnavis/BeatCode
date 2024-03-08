/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchQuestionById } from "../../services/practiceProblemsApi";
import { getBoilerplateCode } from "../../services/getBoilerPlateCode";
import { useSelector, useDispatch } from "react-redux";
import { updateCode } from "../../redux/slices/codeSlice";
import { updateUserInput } from "../../redux/slices/userInputSlice";
import { updateOutput } from "../../redux/slices/outputSlice";
import { updateToggleOutput } from "../../redux/slices/toggleOutput";
import "@fortawesome/fontawesome-svg-core";
const ResetCode = () => {
        const language = useSelector((state) => state.language?.value);
        const dispatch = useDispatch();
        const location = useLocation();
        const { id } = useParams();
        const [question, setQuestion] = useState(null);
        const handleResetClick = async () => {
                const code = getBoilerplateCode(location, language, question);
                dispatch(updateCode(code));
                dispatch(updateOutput(""));
                dispatch(updateUserInput(""));
                dispatch(updateToggleOutput(false));
        };

        useEffect(() => {
                if (location.pathname.startsWith("/practiceproblems")) {
                        const fetchData = async () => {
                                try {
                                        const question = await fetchQuestionById(id);
                                        setQuestion(question);
                                } catch (error) {
                                        console.error("Error fetching questions:", error);
                                }
                        };
                        fetchData();
                }
        }, [location.pathname, id]);

        return (
                <button
                        className="h-[100%] w-[100%] text-[white] cursor-pointer bg-neutral-800 border-[none]"
                        onClick={handleResetClick}
                >
                        <i className="fas fa-undo fa-xl"></i>
                </button>
        );
};

export default ResetCode;
