import OnlineCompiler from "./pages/OnlineCompiler/OnlineCompiler";
import PracticeProblems from "./pages/PracticeProblems/PracticeProblems";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./main.css";
import HomePage from "./pages/HomePage/HomePage";
import QuestionPage from "./components/QuestionPage/QuestionPage";

function App() {
        return (
                <>
                        <Router>
                                <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/onlinecompiler" element={<OnlineCompiler />} />
                                        <Route path="/practiceproblems" element={<PracticeProblems />} />
                                        <Route path="/practiceproblems/questions/:id" element={<QuestionPage />} />
                                </Routes>
                        </Router>
                </>
        );
}

export default App;
