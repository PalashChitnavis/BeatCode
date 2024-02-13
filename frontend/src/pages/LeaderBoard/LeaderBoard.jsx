/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { getLeaderBoard } from "../../services/getLeaderBoard";
function LeaderBoard() {
        const [data, setData] = useState();
        useEffect(() => {
                async function fetchData() {
                        const leaderboardData = await getLeaderBoard();
                        // Sort the data by the length of attemptedQuestions
                        leaderboardData.sort((a, b) => b.attemptedQuestions.length - a.attemptedQuestions.length);
                        setData(leaderboardData);
                }
                fetchData();
        }, []);

        return (
                <>
                        <Header />
                        <div>
                                {data ? (
                                        <table>
                                                <thead>
                                                        <tr>
                                                                <th>Username</th>
                                                                <th>Leaderboard Rank</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                        {data.map((entry, index) => (
                                                                <tr key={index}>
                                                                        <td>{entry.username}</td>
                                                                        <td>{index + 1}</td>
                                                                </tr>
                                                        ))}
                                                </tbody>
                                        </table>
                                ) : (
                                        <div>No LeaderBoard</div>
                                )}
                        </div>
                        <Footer />
                </>
        );
}

export default LeaderBoard;
