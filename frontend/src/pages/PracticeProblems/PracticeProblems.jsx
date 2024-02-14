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
                <div>
                        <Header />
                        <div className="flex mt-16 h-[78.5vh] justify-evenly w-full">
                                <div className="w-[20%]">
                                        <Stats response={response} />
                                </div>

                                <div className="w-[60%]">
                                        <ProblemList response={response} />
                                </div>
                        </div>
                        <Footer />
                </div>
        );
};

export default PracticeProblems;
