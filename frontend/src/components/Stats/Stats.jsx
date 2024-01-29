/* eslint-disable no-unused-vars */
import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";

export default function Stats() {
        const TotalProblems = 12;
        const solved = 3;
        return (
                <div className="font-bold p-4  bg-black rounded-lg">
                        <div className="text-white p-4 pt-0 flex justify-center text-xl">Stats</div>
                        <div className="text-green-600 flex justify-between">
                                Easy
                                <div>
                                        {solved}/{TotalProblems}
                                </div>
                        </div>
                        <ProgressBar progress={solved / TotalProblems} color="green" />
                        <div className="text-yellow-500 flex justify-between">
                                Medium
                                <div>
                                        {solved}/{TotalProblems}
                                </div>
                        </div>
                        <ProgressBar progress={solved / TotalProblems} color="yellow" />

                        <div className="text-red-600 flex justify-between">
                                Hard
                                <div>
                                        {solved}/{TotalProblems}
                                </div>
                        </div>
                        <ProgressBar progress={solved / TotalProblems} color="red" />
                </div>
        );
}
