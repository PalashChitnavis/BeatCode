/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getUserData } from "../../services/getUserData";
import { getLeaderBoard } from "../../services/getLeaderBoard";
import Loading from "../../components/Loading/Loading";
function LeaderBoard() {
        const [data, setData] = useState();
        const [toggle, setToggle] = useState(false);
        const [user, setUser] = useState();
        useEffect(() => {
                async function fetchData() {
                        const leaderboardData = await getLeaderBoard();
                        // Sort the data by the length of attemptedQuestions
                        leaderboardData.sort((a, b) => b.attemptedQuestions.length - a.attemptedQuestions.length);
                        setData(leaderboardData);
                }
                fetchData();
        }, []);

        useEffect(() => {
                async function getUser() {
                        if (toggle != false) {
                                const res = await getUserData(toggle);
                                setUser(res.data);
                        }
                }
                getUser();
        }, [toggle]);

        function handleClick(email) {
                setToggle(email);
        }

        function getDaysSince(dateString) {
                const currentDate = new Date();
                const createDate = new Date(dateString);

                // Calculate the difference in milliseconds
                const differenceMs = currentDate - createDate;

                // Convert milliseconds to days
                const daysSince = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

                return daysSince;
        }

        return (
                <>
                        <div className="h-[8vh] w-[100vw] flex justify-center items-center">
                                <Header />
                        </div>
                        <div className="h-[75vh] lg:h-[87vh] w-full flex justify-center items-center ">
                                {data ? (
                                        <div className="h-full w-full flex justify-center items-center">
                                                <table className="w-[90%] lg:w-[40%] h-[80%] text-white border-4 rounded-md border-separate border-red-400 flex justify-center items-center flex-col bg-[#32085e] ">
                                                        <thead className="text-voilet-700 text-xl w-full ">
                                                                <tr className="w-full flex justify-around items-center py-5">
                                                                        <th className=" flex justify-center items-center w-[60%] pb-2 border-b-2 border-red-400 ">
                                                                                Username
                                                                        </th>
                                                                        <th className="flex justify-center items-center border-b-2  w-[20%] pb-2 border-red-400 ">
                                                                                Rank
                                                                        </th>
                                                                </tr>
                                                        </thead>
                                                        <tbody className="flex flex-col h-full w-full overflow-y-scroll">
                                                                {data.map((entry, index) => (
                                                                        <tr
                                                                                key={index}
                                                                                className="flex justify-between items-center w-full h-[20%] min-h-[20%]"
                                                                        >
                                                                                <td
                                                                                        className={`hover:text-purple-600 gap-2 text-nowrap h-full w-[70%] flex items-center justify-center hover:cursor-pointer`}
                                                                                >
                                                                                        <img
                                                                                                onClick={() => {
                                                                                                        handleClick(
                                                                                                                entry.email
                                                                                                        );
                                                                                                }}
                                                                                                className="h-10 rounded-[50%] cursor-pointer"
                                                                                                src={`https://ui-avatars.com/api/?name=${entry.email.charAt(
                                                                                                        0
                                                                                                )}&background=random`}
                                                                                                alt="userProfile"
                                                                                        />
                                                                                        <div
                                                                                                onClick={() => {
                                                                                                        handleClick(
                                                                                                                entry.email
                                                                                                        );
                                                                                                }}
                                                                                        >
                                                                                                {entry.username}
                                                                                        </div>
                                                                                        {index + 1 === 1 ? (
                                                                                                <i className="fa-solid fa-crown text-[#FFD700] flex items-center"></i>
                                                                                        ) : index + 1 === 2 ? (
                                                                                                <i className="fa-solid fa-crown text-[#EAECEC] flex items-center"></i>
                                                                                        ) : index + 1 === 3 ? (
                                                                                                <i className="fa-solid fa-crown text-[#CD7F32] flex items-center"></i>
                                                                                        ) : null}
                                                                                </td>
                                                                                <td className="text-center  h-full w-[30%] flex justify-center items-center ">
                                                                                        {index + 1}
                                                                                </td>
                                                                        </tr>
                                                                ))}
                                                        </tbody>
                                                </table>
                                                {toggle && (
                                                        <div
                                                                onClick={() => {
                                                                        handleClick(false);
                                                                }}
                                                                className="z-2999 fixed top-0 left-0 w-full h-full flex justify-center items-center  bg-[#000] bg-opacity-50 "
                                                        >
                                                                <div className="bg-[#2f3136] bg-opacity-90 w-[90%] h-[40%] lg:w-[35%] lg:h-[50%] flex-col flex justify-evenly items-center  rounded-2xl text-white">
                                                                        {user ? (
                                                                                <div className="w-full h-full flex justify-start flex-col gap-12 items-center">
                                                                                        <div className="py-3">
                                                                                                <img
                                                                                                        className="h-20 rounded-[50%] cursor-pointer"
                                                                                                        src={`https://ui-avatars.com/api/?name=${user.email.charAt(
                                                                                                                0
                                                                                                        )}&background=random`}
                                                                                                        alt="userProfile"
                                                                                                />
                                                                                        </div>
                                                                                        <div className="w-[95%] gap-2 border border-red-200 rounded-md text-[#fff] flex-col flex justify-center  text-xl p-3 leading-relaxed">
                                                                                                <table className="w-full h-full">
                                                                                                        <tr className="flex justify-start lg:justify-center gap-5 items-center w-full">
                                                                                                                <td className="text-left">
                                                                                                                        <div className="text-red-400 ">
                                                                                                                                Name
                                                                                                                                :
                                                                                                                        </div>
                                                                                                                </td>
                                                                                                                <td className="text-right">
                                                                                                                        <span className="text-red-100">
                                                                                                                                {
                                                                                                                                        user.username
                                                                                                                                }
                                                                                                                        </span>
                                                                                                                </td>
                                                                                                        </tr>
                                                                                                        <tr className="flex justify-start lg:justify-center gap-5 items-center w-full">
                                                                                                                <td className="text-left">
                                                                                                                        <div className="text-red-400">
                                                                                                                                Email
                                                                                                                                :
                                                                                                                        </div>
                                                                                                                </td>
                                                                                                                <td className="text-right">
                                                                                                                        <span className="text-red-100 text-sm lg:text-xl">
                                                                                                                                {
                                                                                                                                        user.email
                                                                                                                                }
                                                                                                                        </span>
                                                                                                                </td>
                                                                                                        </tr>
                                                                                                        <tr className="flex justify-start lg:justify-center gap-5 items-center w-full">
                                                                                                                <td className="text-left">
                                                                                                                        <div className="text-red-400">
                                                                                                                                BeatCoder
                                                                                                                                since
                                                                                                                                :
                                                                                                                        </div>
                                                                                                                </td>
                                                                                                                <td className="text-right">
                                                                                                                        <span className="text-red-100">
                                                                                                                                {getDaysSince(
                                                                                                                                        user.createdAt
                                                                                                                                )}{" "}
                                                                                                                                days
                                                                                                                        </span>
                                                                                                                </td>
                                                                                                        </tr>
                                                                                                </table>
                                                                                        </div>
                                                                                </div>
                                                                        ) : (
                                                                                <div className="h-[88vh]">
                                                                                        <Loading />
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        </div>
                                                )}
                                        </div>
                                ) : (
                                        <div className="text-white text-3xl max-[1024px]:text-xl">
                                                Leaderboard not available
                                        </div>
                                )}
                        </div>
                        <div className="h-[5vh] w-[100vw] flex justify-center items-center">
                                <Footer />
                        </div>
                </>
        );
}

export default LeaderBoard;
