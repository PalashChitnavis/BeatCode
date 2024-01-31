/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const ShareCode = () => {
        const [share, setShare] = useState(false);
        function handleClick() {
                setShare(!share);
        }

        return (
                <div
                        onClick={handleClick}
                        className="w-[80%] h-[100%] flex justify-center items-center bg-[#bcbcbc] rounded-xl cursor-pointer"
                >
                        <div className="w-[80%] text-xl flex justify-center items-center text-[#000]">Share</div>
                        <div className="w-[20%] flex justify-center items-center pr-5">
                                <i className="fa-solid fa-user-plus " style={{ color: "#000" }} aria-hidden="true"></i>
                        </div>
                        {share && (
                                <div>
                                        <div
                                                className="fixed w-full h-full bg-[rgba(0,0,0,0.5)] z-[1000] left-0 top-0"
                                                onClick={handleClick}
                                        ></div>
                                        <div className=" fixed -translate-x-2/4 -translate-y-2/4 z-[1001] w-[50vw] bg-[#2f3136] border shadow-[0_0_10px_rgba(0,0,0,0.2)] p-5 rounded-[10px] border-solid border-[#ccc] left-2/4 top-2/4">
                                                <div className="flex w-[100%] justify-center">
                                                        <button>Create Room</button>
                                                        <button>Join Room</button>
                                                </div>
                                                <button
                                                        onClick={handleClick}
                                                        className="w-[5vw] h-10  font-[bold] cursor-pointer font-bold transition-all duration-[0.3s] ease-[ease] text-[#d90429] ml-[45%] rounded-[5px] border-4 border-solid border-[#d90429]
                                                        bg-white hover:bg-[#d90429] hover:text-[#fff] font-sans"
                                                >
                                                        Close
                                                </button>
                                        </div>{" "}
                                </div>
                        )}
                </div>
        );
};

export default ShareCode;
