/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchQuestionById } from "../../services/practiceProblemsApi";
const QuestionPage = () => {
        const { id } = useParams();
        const [question, setQuestion] = useState(null);

        useEffect(() => {
                const fetchData = async () => {
                        try {
                                const question = await fetchQuestionById(id);
                                console.log(question);
                                setQuestion(question);
                        } catch (error) {
                                console.error("Error fetching questions:", error);
                        }
                };

                fetchData();
        }, [id]);
        return <div></div>;
};

export default QuestionPage;
