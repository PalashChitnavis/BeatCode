/* eslint-disable react/prop-types */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import { isLoggedIn } from "../Login/isLoggedIn";
export default function Stats({ response }) {
        const problemsSolved = {
                easy: response?.data?.attempts?.easy || 0,
                medium: response?.data?.attempts?.medium || 0,
                hard: response?.data?.attempts?.hard || 0,
        };
        const TotalProblems = {
                easy: 2,
                medium: 2,
                hard: 1,
        };

        return (
                <div className="font-bold p-4 w-full h-full  bg-black rounded-lg ">
                        {isLoggedIn() ? (
                                <div></div>
                        ) : (
                                <div className="text-red-400 w-full flex justify-center items-center">
                                        Please Login to View/Update Stats
                                </div>
                        )}
                        <div className="text-white  flex justify-center text-xl lg:text-2xl">Stats</div>
                        <div className="h-[80%] w-full flex flex-col py-2">
                                <div className="flex lg:flex-col justify-between h-[33%]">
                                        <div className="flex w-[40%] justify-between lg:w-full">
                                                <div className="text-green-600 flex  ">Easy</div>
                                                <div className="text-green-600 flex  justify-end">
                                                        {problemsSolved.easy}/{TotalProblems.easy}
                                                </div>
                                        </div>
                                        <ProgressBar progress={problemsSolved.easy / TotalProblems.easy} color="green" />
                                </div>
                                <div className="flex lg:flex-col justify-between h-[33%]">
                                        <div className="flex w-[40%] justify-between lg:w-full">
                                                {" "}
                                                <div className="text-yellow-500 flex ">Medium</div>
                                                <div className="text-yellow-500 flex  justify-end">
                                                        {problemsSolved.medium}/{TotalProblems.medium}
                                                </div>
                                        </div>
                                        <ProgressBar
                                                progress={problemsSolved.medium / TotalProblems.medium}
                                                color="yellow"
                                        />
                                </div>
                                <div className="flex lg:flex-col justify-between h-[33%]">
                                        <div className="flex w-[40%] justify-between lg:w-full">
                                                <div className="text-red-500 flex ">Hard</div>
                                                <div className="text-red-500 flex  justify-end">
                                                        {problemsSolved.hard}/{TotalProblems.hard}
                                                </div>
                                        </div>
                                        <ProgressBar progress={problemsSolved.hard / TotalProblems.hard} color="red" />
                                </div>
                        </div>
                </div>
        );
}
