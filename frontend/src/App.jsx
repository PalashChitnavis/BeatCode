/* eslint-disable react-hooks/exhaustive-deps */
import OnlineCompiler from "./pages/OnlineCompiler/OnlineCompiler";
import PracticeProblems from "./pages/PracticeProblems/PracticeProblems";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./main.css";
import HomePage from "./pages/HomePage/HomePage";
import QuestionPage from "./pages/QuestionPage/QuestionPage";
import SubmissionPage from "./pages/SubmissionPage/SubmissionPage";
import Settings from "./pages/Settings/Settings";
import { useEffect } from "react";
import { useBody } from "./context/BodyContext";

function App() {
        const { updateBody } = useBody();
        useEffect(() => {
                resetBodyContext();
        }, [window.location.pathname]);
        const resetBodyContext = () => {
                updateBody({
                        userInput: "",
                        language: "java",
                        font: "18px",
                        tabSize: "2",
                        editorTheme: "monokai",
                        output: "",
                        toggleOutput: false,
                        practiceStatus: false,
                });
        };
        return (
                <>
                        <Router>
                                <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/onlinecompiler" element={<OnlineCompiler />} />
                                        <Route path="/practiceproblems" element={<PracticeProblems />} />
                                        <Route path="/practiceproblems/questions/:id" element={<QuestionPage />} />
                                        <Route path="/submissions" element={<SubmissionPage />} />
                                        <Route path="/settings" element={<Settings />} />
                                </Routes>
                        </Router>
                </>
        );
}

export default App;
