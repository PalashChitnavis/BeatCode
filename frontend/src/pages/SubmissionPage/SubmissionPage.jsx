/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import SubmissionList from "../../components/SubmissionList/SubmissionList";
import Loading from "../../components/Loading/Loading";
import Register from "../../components/Login/register";
const SubmissionPage = () => {
        return (
                <div className="flex flex-col">
                        <Header />
                        {isLoggedIn() ? (
                                <div className="h-[87.5vh]">
                                        <SubmissionList />
                                </div>
                        ) : (
                                <div className="h-[88vh]">
                                        <div className="z-1999 w-full h-full flex justify-center pt-[30vh] bg-[#000] bg-opacity-50 ">
                                                <div className="bg-[#2f3136] w-[40vw] h-[25vh] flex-col flex justify-evenly items-center  rounded-2xl text-white">
                                                        <div className="text-2xl">
                                                                To use this feature please register yourself, thank you
                                                        </div>
                                                        <Register />
                                                </div>
                                        </div>
                                </div>
                        )}
                        <Footer />
                </div>
        );
};

export default SubmissionPage;
