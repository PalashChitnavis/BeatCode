/* eslint-disable react/prop-types */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import { getUserStatus } from "../../services/getUserStats";
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
                <div className="font-bold p-4  bg-black rounded-lg">
                        <div className="text-white p-4 pt-0 flex justify-center text-xl">Stats</div>
                        <div className="text-green-600 flex justify-between">
                                Easy
                                <div>
                                        {problemsSolved.easy}/{TotalProblems.easy}
                                </div>
                        </div>
                        <ProgressBar progress={problemsSolved.easy / TotalProblems.easy} color="green" />
                        <div className="text-yellow-500 flex justify-between">
                                Medium
                                <div>
                                        {problemsSolved.medium}/{TotalProblems.medium}
                                </div>
                        </div>
                        <ProgressBar progress={problemsSolved.medium / TotalProblems.medium} color="yellow" />

                        <div className="text-red-600 flex justify-between">
                                Hard
                                <div>
                                        {problemsSolved.hard}/{TotalProblems.hard}
                                </div>
                        </div>
                        <ProgressBar progress={problemsSolved.hard / TotalProblems.hard} color="red" />
                </div>
        );
}
