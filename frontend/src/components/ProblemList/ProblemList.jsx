/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { fetchAllQuestions } from "../../services/practiceProblemsApi";
import { Link } from "react-router-dom";
import capitalizeString from "../../services/capitaliseWord";

import Loading from "../Loading/Loading";
import { useSelector, useDispatch } from "react-redux";
import { updateOutput } from "../../redux/slices/outputSlice";
import { updateToggleOutput } from "../../redux/slices/toggleOutput";
import { updatePracticeStatus } from "../../redux/slices/practiceStatusSlice";
const ProblemList = ({ response }) => {
        const output = useSelector((state) => state.output?.value);
        const dispatch = useDispatch();
        const [questions, setQuestions] = useState([]);
        const attemptedQuestions = response?.data?.attemptedQuestions || [];
        useEffect(() => {
                const fetchData = async () => {
                        try {
                                const questionsData = await fetchAllQuestions();
                                setQuestions(questionsData);
                        } catch (error) {
                                console.error("Error fetching questions:", error);
                        }
                };

                fetchData();
        }, [output]);

        const resetConfetti = () => {
                dispatch(updateOutput(""));
                dispatch(updatePracticeStatus(false));
                dispatch(updateToggleOutput(false));
        };

        const DifficultyTextStyles = (question) => {
                return question.diff === "easy"
                        ? "text-green-600"
                        : question.diff === "medium"
                        ? "text-yellow-500"
                        : "text-red-600";
        };

        const QuestionsArray = questions.map((question) => (
                <tr key={question.id} className="text-white font-bold text-center border-b-2 border-gray-400">
                        <td className="w-[10%] p-4">
                                <div className="w-4 h-4 flex justify-center items-center rounded-sm border-green-800 border-2 bg-[#202225] mx-auto">
                                        {attemptedQuestions.includes(question.id) ? `✅` : ``}
                                </div>
                        </td>
                        <td className="w-[70%] p-4 text-left hover:text-[#485fc7]">
                                <Link onClick={resetConfetti} to={`/practiceproblems/questions/${question.id}`}>
                                        {question.title}
                                </Link>
                        </td>
                        <td className={`w-[20%] p-4 ${DifficultyTextStyles(question)}`}>
                                {capitalizeString(question.diff)}
                        </td>
                </tr>
        ));

        return (
                <div className="bg-[#2f3136] rounded-lg w-full h-full overflow-y-scroll">
                        {questions ? (
                                <table className="w-full border-collapse border-gray-400 text-center">
                                        <thead>
                                                <tr className="text-white border-b-2 text-xl font-bold">
                                                        <td className="w-[10%] p-4">Status</td>
                                                        <td className="w-[70%] p-4 text-left">Problem</td>
                                                        <td className="w-[20%] p-4">Difficulty</td>
                                                </tr>
                                        </thead>
                                        <tbody>{QuestionsArray}</tbody>
                                </table>
                        ) : (
                                <div>
                                        <Loading />
                                </div>
                        )}
                </div>
        );
};

export default ProblemList;
