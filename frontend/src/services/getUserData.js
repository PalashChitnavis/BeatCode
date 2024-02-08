import axios from "axios";

const API_URL = "http://localhost:3000";

const getUserData = async (email) => {
        try {
                const response = await axios.post(`${API_URL}/getuser/`, { email: email });
                return response.data;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

export { getUserData };
