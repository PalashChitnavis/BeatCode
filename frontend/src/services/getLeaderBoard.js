export const getLeaderBoard = async () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await fetch(`${backendUrl}/leaderboard`);
                const data = await response.json();
                return data;
        } catch (error) {
                console.error("Error fetching leaderboard:", error.message);
        }
};
