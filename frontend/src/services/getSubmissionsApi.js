import axios from "axios";

const API_URL = "http://localhost:3000";

const getSubmissions = async (id) => {
        try {
                const response = await axios.post(`${API_URL}/getsubmissions`, { questionID: id });
                return response.data.submissions;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

export { getSubmissions };
