export const isLoggedIn = () => {
        const token = localStorage.getItem("token");
        console.log(token);
        return !!token;
};
