import axios from "axios";

const API_URL = "http://localhost:3000";

const fetchAllQuestions = async () => {
        try {
                const response = await axios.get(`${API_URL}/practiceproblems`);
                console.log(response.data);
                return response.data;
        } catch (error) {
                console.error("Error fetching questions:", error);
                throw error;
        }
};

const fetchQuestionById = async (questionId) => {
        try {
                const response = await axios.get(`${API_URL}/practiceproblems/questions/${questionId}`);
                console.log(response);
                return response.data;
        } catch (error) {
                console.error("Error fetching question by ID:", error);
                throw error;
        }
};

export { fetchAllQuestions, fetchQuestionById };
