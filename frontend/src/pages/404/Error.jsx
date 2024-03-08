/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";

function ErrorPage() {
        return (
                <>
                        <div className="h-[8vh] w-[100vw] flex justify-center items-center">
                                <Header />
                        </div>
                        <div className="h-full w-full">
                                <div className="w-full h-[83.5vh] lg:h-[87vh] lg:flex-row flex flex-col-reverse justify-around items-center px-12 text-wrap">
                                        <div className="w-[100%] h-[50%] flex flex-col lg:flex lg:justify-center">
                                                <div className="text-white font-sans text-4xl p-5 lg:text-6xl">
                                                        Oops, this page doesn't exist
                                                </div>
                                                <div className="text-white font-sans text-2xl p-5 lg:text-4xl">
                                                        Go back to{" "}
                                                        <Link className="text-yellow-500" to={"/"}>
                                                                home page
                                                        </Link>
                                                </div>
                                        </div>
                                        <div className="w-[100%] h-[50%] flex justify-center items-center">
                                                <img src="../../public/Error.png" alt="Error404" />
                                        </div>
                                </div>
                        </div>
                        <div className="h-[5vh] w-[100vw] flex justify-center items-center">
                                <Footer />
                        </div>
                </>
        );
}

export default ErrorPage;
