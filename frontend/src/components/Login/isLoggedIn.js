export const isLoggedIn = () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const username = localStorage.getItem("username");
        if (token && email && username) {
                return true;
        } else {
                return false;
        }
};
