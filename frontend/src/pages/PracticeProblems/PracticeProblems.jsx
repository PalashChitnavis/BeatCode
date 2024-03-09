/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ProblemList from "../../components/ProblemList/ProblemList";
import Header from "../../components/Header/Header";
import Stats from "../../components/Stats/Stats";
import Footer from "../../components/Footer/Footer";
import { getUserStatus } from "../../services/getUserStats";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import Loading from "../../components/Loading/Loading";
const PracticeProblems = () => {
        const [response, setResponse] = useState();
        useEffect(() => {
                if (isLoggedIn()) {
                        const email = localStorage.getItem("email");
                        async function handleStats() {
                                const response = await getUserStatus(email);
                                setResponse(response);
                        }
                        handleStats();
                }
        }, []);
        return (
                <>
                        <div className="h-[8vh] w-[100vw] flex justify-center items-center">
                                <Header />
                        </div>
                        <div className="h-[75vh] lg:h-[87vh] lg:flex-row  lg:gap-10 flex flex-col gap-3 justify-center items-center">
                                <div className="w-[95%] h-[30%] lg:w-[25%] lg:h-[50%]">
                                        <Stats response={response} />
                                </div>
                                <div className="w-[95%] h-[60%] lg:w-[65%] lg:h-[60%]">
                                        <ProblemList response={response} />
                                </div>
                        </div>
                        <div className="h-[5vh] w-[100vw] flex justify-center items-center">
                                <Footer />
                        </div>
                </>
        );
};

export default PracticeProblems;
