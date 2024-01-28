/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { fetchAllQuestions } from "../../services/practiceProblemsApi";
import { Link } from "react-router-dom";
const ProblemList = () => {
        const [questions, setQuestions] = useState([]);

        useEffect(() => {
                const fetchData = async () => {
                        try {
                                const questionsData = await fetchAllQuestions();
                                setQuestions(questionsData);
                        } catch (error) {
                                console.error("Error fetching questions:", error);
                                // Handle error (e.g., show error message)
                        }
                };

                fetchData();
        }, []);
        return (
                <div>
                        {questions.map((question) => (
                                <div key={question.id}>
                                        <Link to={`/practiceproblems/questions/${question.id}`}>
                                                <div>{question.id}</div>
                                                <div>{question.title}</div>
                                                <div>Difficulty: {question.diff}</div>
                                        </Link>
                                </div>
                        ))}
                </div>
        );
};

export default ProblemList;
