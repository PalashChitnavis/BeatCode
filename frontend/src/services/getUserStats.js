import axios from "axios";

const API_URL = "http://localhost:3000";

const getUserStatus = async (email) => {
        try {
                const response = await axios.post(`${API_URL}/getstats/`, { email: email });
                return response.data;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

export { getUserStatus };
