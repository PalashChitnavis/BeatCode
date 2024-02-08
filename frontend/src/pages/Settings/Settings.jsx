/* eslint-disable no-inner-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import { getUserData } from "../../services/getUserData";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
const Settings = () => {
        const [user, setUser] = useState(null);
        useEffect(() => {
                if (isLoggedIn()) {
                        const email = localStorage.getItem("email");
                        async function handle() {
                                const res = await getUserData(email);
                                setUser(res.data);
                                console.log(user);
                        }
                        handle();
                }
        }, []);
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
                <div>
                        <Header />
                        {user && (
                                <div className="w-[100%] flex justify-center flex-col gap-5 items-center mt-5">
                                        <div>
                                                <img
                                                        className="h-20 rounded-[50%] cursor-pointer"
                                                        src={`https://ui-avatars.com/api/?name=${user.email.charAt(
                                                                0
                                                        )}&background=random`}
                                                        alt="userProfile"
                                                />
                                        </div>
                                        <div className="w-[30%] gap-5 border rounded-md text-[#fff] flex-col flex justify-center items-center text-3xl">
                                                <div>Name : {user.username}</div>
                                                <div>Email : {user.email}</div>
                                                <div>BeatCoder since : {getDaysSince(user.createdAt)} days</div>
                                        </div>
                                </div>
                        )}
                        <Footer />
                </div>
        );
};

export default Settings;
