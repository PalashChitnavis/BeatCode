/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchQuestionById } from "../../services/practiceProblemsApi";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Question from "./Question.jsx";
import "./QuestionPage.css";
const QuestionPage = () => {
        const [loading, setLoading] = useState(false);
        const { id } = useParams();
        const [question, setQuestion] = useState(null);
        const [navigation, setNavigation] = useState("question");
        useEffect(() => {
                const fetchData = async () => {
                        try {
                                setLoading(true);
                                const question = await fetchQuestionById(id);
                                console.log(question);
                                setQuestion(question);
                                setLoading(false);
                        } catch (error) {
                                console.error("Error fetching questions:", error);
                        }
                };

                fetchData();
        }, [id]);

        return (
                <div>
                        <Header />
                        {loading ? (
                                <h1>Loading</h1>
                        ) : (
                                <div className="h-[88vh] w-screen flex items-center justify-evenly">
                                        <div className="w-[48vw] bg-neutral-800 h-[85vh] border rounded-[10px] border-solid border-[white]">
                                                <div className="h-[5vh] w-full flex justify-around border-b-[rgb(76,76,76)] border-b border-solid">
                                                        <button
                                                                className={navigation === `question` ? `active` : ``}
                                                                onClick={() => setNavigation("question")}
                                                        >
                                                                Question
                                                        </button>
                                                        <button
                                                                className={navigation === `solution` ? `active` : ``}
                                                                onClick={() => setNavigation("solution")}
                                                        >
                                                                Solution
                                                        </button>
                                                        <button
                                                                className={navigation === `submissions` ? `active` : ``}
                                                                onClick={() => setNavigation("submissions")}
                                                        >
                                                                Submissions
                                                        </button>
                                                        <button
                                                                className={navigation === `problemlist` ? `active` : ``}
                                                                onClick={() => setNavigation("problemlist")}
                                                        >
                                                                Problem List
                                                        </button>
                                                </div>
                                                {(() => {
                                                        switch (navigation) {
                                                                case "question":
                                                                        return question && <Question question={question} />;
                                                                case "solution":
                                                                        return `<h1>solution</h1>`;
                                                                case "submissions":
                                                                        return `<h1>submissions</h1>`;
                                                                case "problemlist":
                                                                        return `<h1>problemlist</h1>`;
                                                        }
                                                })()}
                                        </div>
                                        <div className="w-[48vw] bg-[#202020] h-[85vh] border rounded-[10px] border-solid border-[white]"></div>
                                </div>
                        )}
                        <Footer />
                </div>
        );
};

export default QuestionPage;
