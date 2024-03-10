import axios from "axios";

const onlineCompilerSubmissions = async (email) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.post(`${backendUrl}/submissions/onlinecompiler`, { email: email });

                return response.data.submissions;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

const practiceProblemsSubmissions = async (email) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.post(`${backendUrl}/submissions/practiceproblems`, { email: email });

                return response.data.submissions;
        } catch (error) {
                console.error("API call error : ", error.message);
                throw error;
        }
};

export { onlineCompilerSubmissions, practiceProblemsSubmissions };
