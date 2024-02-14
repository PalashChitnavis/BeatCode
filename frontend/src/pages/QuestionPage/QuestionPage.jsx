/* eslint-disable no-inner-declarations */
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
import QuestionSubmission from "../../components/SubmissionList/QuestionSubmission.jsx";
import { isLoggedIn } from "../../components/Login/isLoggedIn.js";
import { useBody } from "../../context/BodyContext.jsx";
import { getUserStatus } from "../../services/getUserStats.js";
import FullScreenConfetti from "../../components/Confetti/FullScreenConfetti.jsx";
import Loading from "../../components/Loading/Loading.jsx";
const QuestionPage = () => {
        const [loading, setLoading] = useState(false);
        const { id } = useParams();
        const [question, setQuestion] = useState(null);
        const [navigation, setNavigation] = useState("question");
        const { body, updateBody } = useBody();
        const { toggleOutput, output } = body;
        const [response, setResponse] = useState();
        useEffect(() => {
                const fetchData = async () => {
                        try {
                                setLoading(true);
                                const question = await fetchQuestionById(id);
                                setQuestion(question);
                                setLoading(false);
                        } catch (error) {
                                console.error("Error fetching questions:", error);
                        }
                };
                setNavigation("question");
                fetchData();
                if (isLoggedIn()) {
                        const email = localStorage.getItem("email");
                        async function handleStats() {
                                const response = await getUserStatus(email);
                                setResponse(response);
                        }
                        handleStats();
                }
        }, [id]);

        const handleToggleOutput = () => {
                updateBody({
                        ...body,
                        toggleOutput: body.toggleOutput === true ? false : true,
                });
        };

        return (
                <div>
                        <Header />
                        {loading ? (
                                <div className="h-[88vh]">
                                        <Loading />
                                </div>
                        ) : (
                                <div className="h-[87.5vh] w-screen flex items-center justify-evenly">
                                        {body?.practiceStatus && <FullScreenConfetti />}
                                        <div
                                                className={`w-[38%] bg-neutral-800 h-[85vh] border rounded-[10px] border-solid border-[white] overflow-y-scroll pb-4`}
                                        >
                                                <div className="h-[7.5vh] w-full flex flex-wrap text-nowrap justify-around border-b-[rgb(76,76,76)] border-b border-solid">
                                                        <button
                                                                className={`${
                                                                        navigation === `question` ? `active` : ``
                                                                } questionpagebtn`}
                                                                onClick={() => setNavigation("question")}
                                                        >
                                                                Question
                                                        </button>
                                                        <button
                                                                className={`${
                                                                        navigation === `solution` ? `active` : ``
                                                                } questionpagebtn`}
                                                                onClick={() => setNavigation("solution")}
                                                        >
                                                                Solution
                                                        </button>
                                                        <button
                                                                className={`${
                                                                        navigation === `submissions` ? `active` : ``
                                                                } questionpagebtn`}
                                                                onClick={() => {
                                                                        setNavigation("submissions");
                                                                }}
                                                        >
                                                                Submissions
                                                        </button>
                                                        <button
                                                                className={`${
                                                                        navigation === `problemlist` ? `active` : ``
                                                                } questionpagebtn`}
                                                                onClick={() => setNavigation("problemlist")}
                                                        >
                                                                Problem List
                                                        </button>
                                                </div>
                                                <div className="w-[100%] ">
                                                        {(() => {
                                                                switch (navigation) {
                                                                        case "question":
                                                                                return (
                                                                                        question && (
                                                                                                <Question
                                                                                                        question={question}
                                                                                                />
                                                                                        )
                                                                                );
                                                                        case "solution":
                                                                                return (
                                                                                        question && (
                                                                                                <ProblemSolutions
                                                                                                        question={question}
                                                                                                />
                                                                                        )
                                                                                );
                                                                        case "submissions":
                                                                                return question && <QuestionSubmission />;
                                                                        case "problemlist":
                                                                                return <ProblemList response={response} />;
                                                                }
                                                        })()}
                                                </div>
                                        </div>
                                        <div className="w-[58%] bg-[#202020] h-[85vh] border rounded-[10px] border-solid border-[white]">
                                                <div className="w-[100%] bg-[#202020] h-[100%] border rounded-[10px] border-solid border-[white] ">
                                                        <div className="w-[96%] h-[8%]">
                                                                <NavBar />
                                                        </div>
                                                        {toggleOutput ? (
                                                                <div className={`h-[40%]`}>
                                                                        {question && <CodeEditor question={question} />}
                                                                </div>
                                                        ) : (
                                                                <div className={`h-[80%]`}>
                                                                        {question && <CodeEditor question={question} />}
                                                                </div>
                                                        )}
                                                        <button
                                                                onClick={handleToggleOutput}
                                                                className={`palash flex items-center pl-[2%]  w-[96%] h-[8%] ml-[2%] text-[#fff]`}
                                                        >
                                                                Output Window{" "}
                                                                {toggleOutput ? (
                                                                        <i className="pl-[10px] fa-solid fa-angle-down"></i>
                                                                ) : (
                                                                        <i className="pl-[10px] fa-solid fa-angle-up"></i>
                                                                )}
                                                        </button>
                                                        {toggleOutput && (
                                                                <div className="h-[35%] w-[96%] bg-[#272822] ml-[2%] mt-[2%]">
                                                                        <textarea
                                                                                placeholder="Output will be displayed here"
                                                                                id="userOutput"
                                                                                className="bg-[#272822] text-[aliceblue] w-[100%] h-[100%] resize-none text-xl border p-4 rounded-[10px] border-solid border-[white] leading-8"
                                                                                readOnly
                                                                                value={output}
                                                                        ></textarea>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>
                                </div>
                        )}
                        <Footer />
                </div>
        );
};

export default QuestionPage;
