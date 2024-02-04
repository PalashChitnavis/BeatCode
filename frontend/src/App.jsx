import OnlineCompiler from "./pages/OnlineCompiler/OnlineCompiler";
import PracticeProblems from "./pages/PracticeProblems/PracticeProblems";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./main.css";
import HomePage from "./pages/HomePage/HomePage";
import QuestionPage from "./pages/QuestionPage/QuestionPage";
import SubmissionPage from "./pages/SubmissionPage/SubmissionPage";
function App() {
        return (
                <>
                        <Router>
                                <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/onlinecompiler" element={<OnlineCompiler />} />
                                        <Route path="/practiceproblems" element={<PracticeProblems />} />
                                        <Route path="/practiceproblems/questions/:id" element={<QuestionPage />} />
                                        <Route path="/submissions" element={<SubmissionPage />} />
                                </Routes>
                        </Router>
                </>
        );
}

export default App;
