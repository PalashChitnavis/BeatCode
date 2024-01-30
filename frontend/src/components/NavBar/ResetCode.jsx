/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useBody } from "../../context/BodyContext";
import { useLocation, useParams } from "react-router-dom";
import { fetchQuestionById } from "../../services/practiceProblemsApi";
import { getBoilerplateCode } from "../../services/getBoilerPlateCode";
import "@fortawesome/fontawesome-svg-core";
const ResetCode = () => {
        const { body, updateBody } = useBody();
        const location = useLocation();
        const { id } = useParams();
        const [question, setQuestion] = useState(null);
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

        const handleResetClick = async () => {
                const code = getBoilerplateCode(location, body, question);
                updateBody({ ...body, code: code });
        };

        return (
                <button
                        className="h-[100%] w-[20%] text-[white] cursor-pointer bg-neutral-800 border-[none]"
                        onClick={handleResetClick}
                >
                        <i className="fas fa-undo fa-xl"></i>
                </button>
        );
};

export default ResetCode;
