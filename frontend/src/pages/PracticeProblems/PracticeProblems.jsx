/* eslint-disable no-unused-vars */
import React from "react";
import ProblemList from "../../components/ProblemList/ProblemList";
import Header from "../../components/Header/Header";
import Stats from "../../components/Stats/Stats";
import Footer from "../../components/Footer/Footer";
const PracticeProblems = () => {
        return (
                <div>
                        <Header />
                        <div className="flex mt-16 justify-evenly w-full">
                                <div className="w-[20%]">
                                        <Stats />
                                </div>

                                <div className="w-[60%]">
                                        <ProblemList />
                                </div>
                        </div>
                        <Footer />
                </div>
        );
};

export default PracticeProblems;
