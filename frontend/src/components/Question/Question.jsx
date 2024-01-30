/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import capitalizeString from "../../services/capitaliseWord";
const Question = ({ question }) => {
        const { title, diff, description, example_cases } = question;
        return (
                <div>
                        <div className="text-[white] text-2xl font-bold pl-5 pt-2.5">{title}</div>
                        <div className="text-[#42fea6] text-xl pl-5 pt-2.5">{capitalizeString(diff)}</div>
                        <div className="text-[white] text-xl pl-5 pt-2.5">{description}</div>
                        <div className="text-[white]">
                                {example_cases.map((example, index) => {
                                        return (
                                                <div className="pt-[20px] pl-[20px]" key={index}>
                                                        <div className="text-lg font-bold mb-3">Example {index + 1} : </div>
                                                        <div className="bg-[#222222] w-[70%] rounded-lg">
                                                                <div className="ml-3 ">
                                                                        <span className="text-[#4ec9b0]">Input</span> :{" "}
                                                                        <span className="text-[#ce9178]">
                                                                                {example.input}
                                                                        </span>
                                                                </div>
                                                                <div className="ml-3">
                                                                        <span className="text-[#4ec9b0]">Output</span> :{" "}
                                                                        <span className="text-[#ce9178]">
                                                                                {example.output}
                                                                        </span>
                                                                </div>
                                                                <div className="ml-3">
                                                                        Explanation : {example.explanation}
                                                                </div>
                                                        </div>
                                                </div>
                                        );
                                })}
                        </div>
                </div>
        );
};

export default Question;
