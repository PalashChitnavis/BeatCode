/* eslint-disable no-unused-vars */
import axios from "axios";
import { toast } from "react-toastify";
export const getGoogleAuth = async () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.get(`${backendUrl}/google/auth`);
                window.location.href = response.data.finalURL;
        } catch (error) {
                console.error("Error initiating Google authentication:", error);
        }
};

export const handlegoogleRedirect = async () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                // Make a request to your backend to handle the Google redirect
                const response = await axios.get(`${backendUrl}/google/redirect`);
                const userData = response.data;

                // Now you can access the userData object and use it as needed
                console.log(userData);

                // For example, you can store the user data in local storage or state
                // localStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
                console.error("Error handling Google redirect:", error);
        }
};
