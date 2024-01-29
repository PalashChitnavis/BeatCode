/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./Question.css";
import capitalizeString from "../../services/capitaliseWord";
const Question = ({ question }) => {
        const { title, diff, description, example_cases } = question;
        console.log(question);
        return (
                <div>
                        <div className="title">{title}</div>
                        <div className="diff">{capitalizeString(diff)}</div>
                        <div className="desc">{description}</div>
                        <div className="example">
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
