import axios from "axios";

const API_URL = "http://localhost:3000";

const runCompilerCode = async (reqBody) => {
        try {
                const response = await axios.post(`${API_URL}/run/onlinecompiler`, reqBody);
                return response.data;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

const runPracticeCode = async (reqBody) => {
        try {
                const response = await axios.post(`${API_URL}/run/practiceproblems`, reqBody);
                return response.data;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

export { runCompilerCode, runPracticeCode };
