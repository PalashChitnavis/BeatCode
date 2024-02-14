/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import socketIOClient from "socket.io-client";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import Register from "../../components/Login/register";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Room = () => {
        const navigate = useNavigate();
        function hostClick() {
                const roomID = Math.random().toString(36).substring(7);
                console.log(roomID);
                navigate(`/room/${roomID}`);
        }
        function joinClick() {
                const roomID = document.getElementById("roomid").value;
                navigate(`/room/${roomID}`);
        }
        return (
                <div>
                        <Header />
                        {!isLoggedIn() && (
                                <div className="z-1999 fixed w-full h-full flex justify-center pt-[30vh] bg-[#000] bg-opacity-50 ">
                                        <div className="bg-[#2f3136] w-[40vw] h-[25vh] flex-col flex justify-evenly items-center  rounded-2xl text-white">
                                                <div className="text-2xl">
                                                        To use this feature please register yourself, thank you
                                                </div>
                                                <Register />
                                        </div>
                                </div>
                        )}
                        <div className="flex w-[100vw] h-[87.5vh] justify-evenly">
                                <div className="w-[50vw] border-r-2 h-[100%] flex flex-col items-center">
                                        <div className="text-3xl text-white border-b-2 mt-[3vh]">Host a Room</div>
                                        <div
                                                onClick={hostClick}
                                                className={`text-white mt-[30vh] cursor-pointer text-4xl bg-[#16a34a] w-[20vw] h-[10vh] flex justify-center items-center rounded-2xl hover:bg-[#0b5627] 
                                                        
                                                `}
                                        >
                                                Host a Room
                                        </div>
                                </div>
                                <div className="w-[50vw] border-l-2 h-[100%] flex flex-col items-center">
                                        <div className="text-3xl text-white border-b-2 mt-[3vh]">Join a Room</div>
                                        <div className="flex gap-5 mt-[31vh]">
                                                <input
                                                        className="text-3xl indent-3 text-black placeholder-gray-600"
                                                        type="text"
                                                        name="roomid"
                                                        id="roomid"
                                                />
                                                <button
                                                        onClick={joinClick}
                                                        className={`text-white text-3xl w-[100px] h-[60px] rounded-3xl bg-[#16a34a] hover:bg-[#0b5627] 
                                                                
                                                        `}
                                                >
                                                        Join
                                                </button>
                                        </div>
                                </div>
                        </div>
                        <Footer />
                </div>
        );
};

export default Room;
