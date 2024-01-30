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
                                                        <div className="text-lg font-bold">Example {index + 1} : </div>
                                                        <div>
                                                                {example.input.map((input, index) => {
                                                                        return <div key={index}>[{input}]</div>;
                                                                })}
                                                        </div>
                                                        <div>Output : {example.output}</div>
                                                        <div>Explanation : {example.explanation}</div>
                                                </div>
                                        );
                                })}
                        </div>
                </div>
        );
};

export default Question;
