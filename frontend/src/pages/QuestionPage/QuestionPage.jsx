/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchQuestionById } from "../../services/practiceProblemsApi";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Question from "../../components/Question/Question.jsx";
import "./QuestionPage.css";
import ProblemList from "../../components/ProblemList/ProblemList.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
import CodeEditor from "../../components/CodeEditor/CodeEditor.jsx";
import ProblemSolutions from "../../components/ProblemSolutions/ProblemSolutions.jsx";

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
                setNavigation("question");
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
                                                <div className="h-[7.5vh] w-full flex justify-around border-b-[rgb(76,76,76)] border-b border-solid">
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
                                                                        return (
                                                                                question && (
                                                                                        <ProblemSolutions
                                                                                                question={question}
                                                                                        />
                                                                                )
                                                                        );
                                                                case "submissions":
                                                                        return `<h1>submissions</h1>`;
                                                                case "problemlist":
                                                                        return <ProblemList />;
                                                        }
                                                })()}
                                        </div>
                                        <div className="w-[48vw] bg-[#202020] h-[85vh] border rounded-[10px] border-solid border-[white]">
                                                <div className="w-[48vw] bg-[#202020] h-[85vh] border rounded-[10px] border-solid border-[white]">
                                                        <div className="w-[95%] h-[8%]">
                                                                <NavBar />
                                                        </div>
                                                        <div className="h-[85%]">
                                                                {question && <CodeEditor question={question} />}
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        )}
                        <Footer />
                </div>
        );
};

export default QuestionPage;
