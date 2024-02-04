import axios from "axios";

const API_URL = "http://localhost:3000";

const onlineCompilerSubmissions = async (email) => {
        try {
                const response = await axios.post(`${API_URL}/submissions/onlinecompiler`, { email: email });
                console.log(response.data.submissions);
                return response.data.submissions;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

const practiceProblemsSubmissions = async (email) => {
        try {
                console.log("working on this ", email);
        } catch (error) {
                console.error("API call error : ", error.message);
                throw error;
        }
};

export { onlineCompilerSubmissions, practiceProblemsSubmissions };
