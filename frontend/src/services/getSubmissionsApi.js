import axios from "axios";

const getSubmissions = async (id) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.post(`${backendUrl}/getsubmissions`, { questionID: id });
                return response.data.submissions;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

export { getSubmissions };
