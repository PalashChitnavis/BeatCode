import axios from "axios";

const getUserStatus = async (email) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.post(`${backendUrl}/getstats/`, { email: email });
                return response.data;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

export { getUserStatus };
