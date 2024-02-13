import axios from "axios";

const fetchAllQuestions = async () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.get(`${backendUrl}/practiceproblems`);
                return response.data;
        } catch (error) {
                console.error("Error fetching questions:", error);
                throw error;
        }
};

const fetchQuestionById = async (questionId) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.get(`${backendUrl}/practiceproblems/questions/${questionId}`);
                return response.data;
        } catch (error) {
                console.error("Error fetching question by ID:", error);
                throw error;
        }
};

export { fetchAllQuestions, fetchQuestionById };
