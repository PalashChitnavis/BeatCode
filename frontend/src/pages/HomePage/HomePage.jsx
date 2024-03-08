/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

function HomePage() {
        return (
                <div className="h-[100vh] w-[100vw]">
                        <div className="h-[8vh] w-[100vw] flex justify-center items-center">
                                <Header />
                        </div>

                        <div className="flex h-[75vh] lg:h-[87vh] items-center flex-col lg:flex-row lg:justify-around lg:px-24 lg:w-full lg:items-center  text-white font-sans text-left">
                                <div className=" w-full lg:w-[65%] font-bold lg:flex lg:flex-col lg:gap-4">
                                        <p className="text-5xl lg:text-7xl flex lg:justify-start justify-center pt-16 lg:pt-8">
                                                BeatCode
                                        </p>
                                        <p className="text-xl flex justify-center lg:justify-start py-3 lg:text-3xl">
                                                A better way to level up your coding.
                                        </p>
                                        <div className="flex flex-col  lg:flex-row lg:justify-start justify-center gap-8 items-center w-full text-nowrap py-6">
                                                <button className="text-green-600 lg:text-2xl w-[60%] lg:w-[22%] lg:text-wrap text-xl border-2 border-green-600 rounded-full px-6 py-4  hover:bg-green-600 hover:text-white">
                                                        <Link to="/practiceproblems">Practice Problems</Link>
                                                </button>
                                                <button className="text-green-600 w-[60%] lg:w-[22%] lg:text-wrap lg:text-2xl text-xl border-2 border-green-600 rounded-full px-6 py-4  hover:bg-green-600 hover:text-white">
                                                        <Link to="/onlinecompiler">Online Compiler</Link>
                                                </button>
                                                <button className="text-green-600 w-[60%] lg:w-[22%] lg:text-wrap lg:text-2xl text-xl border-2 border-green-600 rounded-full px-6 py-4  hover:bg-green-600 hover:text-white">
                                                        <Link to="/room">Code Room</Link>
                                                </button>
                                        </div>
                                </div>
                                <div className="hidden lg:flex lg:w-[35%]">
                                        <img src="Home-Page-Tree.svg" alt="Coding Tree Image" className="w-[100%]  mt-10 " />
                                </div>
                        </div>
                        <div className="h-[5vh] w-[100vw] flex justify-center items-center">
                                <Footer />
                        </div>
                </div>
        );
}

export default HomePage;
