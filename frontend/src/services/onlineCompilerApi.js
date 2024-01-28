import axios from "axios";

const API_URL = "http://localhost:3000/onlinecompiler";

const runCode = async (reqBody) => {
        try {
                await new Promise((resolve) => setTimeout(resolve, 5000));
                const response = await axios.post(`${API_URL}/run`, reqBody);
                return response.data;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

export { runCode };
