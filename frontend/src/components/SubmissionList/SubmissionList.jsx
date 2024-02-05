/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { onlineCompilerSubmissions, practiceProblemsSubmissions } from "../../services/submissionsApi";
import "./SubmissionList.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
const SubmissionList = () => {
        const [toggleSubmission, setToggleSubmission] = useState("practiceproblems");
        const email = localStorage.getItem("email");
        const [compilersubmissions, setCompilerSubmissions] = useState(null);
        const [practicesubmissions, setPracticeSubmissions] = useState(null);
        function handleToggle(name) {
                setToggleSubmission(name);
                if (name === "practiceproblems") {
                        practiceProblemsSubmissions(email).then((res) => {
                                setPracticeSubmissions([...res].reverse());
                        });
                }
                if (name === "onlinecompiler") {
                        onlineCompilerSubmissions(email).then((res) => {
                                setCompilerSubmissions([...res].reverse());
                        });
                }
        }
        const formatDateTime = (dateTime) => {
                const date = new Date(dateTime);
                const options = { month: "long", day: "numeric", year: "numeric" };
                const dateString = date.toLocaleDateString(undefined, options);
                const timeString = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
                return `${dateString} at ${timeString}`;
        };
        return (
                <div>
                        <div className=" fixed -translate-x-2/4 -translate-y-2/4 z-[1001] w-[90vw] h-[80vh]   p-5 rounded-[10px]  left-2/4 top-2/4">
                                <div className="flex w-full items-center justify-center">
                                        <button
                                                className={`border w-[30vw] mr-[5vw] h-10 bg-[#179b77] border-solid border-[white] hover:bg-[#179b77]   
                                                                        ${
                                                                                toggleSubmission === "practiceproblems"
                                                                                        ? "bg-[#179b77]"
                                                                                        : "bg-[#435359]"
                                                                        }`}
                                                onClick={() => handleToggle("practiceproblems")}
                                        >
                                                Practice Problems Submissions
                                        </button>
                                        <button
                                                className={`border w-[30vw] h-10 bg-[#179b77]  border-solid border-[white] hover:bg-[#179b77]  
                                                                        ${
                                                                                toggleSubmission === "onlinecompiler"
                                                                                        ? `bg-[#179b77]`
                                                                                        : `bg-[#435359]`
                                                                        }`}
                                                onClick={() => handleToggle("onlinecompiler")}
                                        >
                                                Online Compiler Submissions
                                        </button>
                                </div>
                                {toggleSubmission === "practiceproblems" ? (
                                        <div className="onlinecompilersub">
                                                {practicesubmissions &&
                                                        practicesubmissions.map((submission, index) => (
                                                                <div key={submission._id} className="xyzabcd">
                                                                        <div className="abcd">
                                                                                {index + 1}]{" "}
                                                                                <span className="ml-[1vw]">
                                                                                        {" "}
                                                                                        Created :{" "}
                                                                                        {formatDateTime(
                                                                                                submission.createdAt
                                                                                        )}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex justify-between ml-[3vw] mb-[2vh] mt-[2vh] mr-[2vw]">
                                                                                <div>
                                                                                        <SyntaxHighlighter
                                                                                                className="xyz"
                                                                                                language={
                                                                                                        submission.language
                                                                                                }
                                                                                        >
                                                                                                {submission.code}
                                                                                        </SyntaxHighlighter>
                                                                                </div>
                                                                                <div className="flex flex-col bcd">
                                                                                        <div>
                                                                                                <span className="text-[#4ec9b0]">
                                                                                                        Status :
                                                                                                </span>{" "}
                                                                                                <span className="text-[#ce9178]">
                                                                                                        Empty For Now
                                                                                                </span>
                                                                                        </div>
                                                                                        <div>
                                                                                                <span className="text-[#4ec9b0]">
                                                                                                        Output :
                                                                                                </span>{" "}
                                                                                                <span className="text-[#ce9178]">
                                                                                                        {submission.output}
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                        </div>
                                ) : (
                                        <div className="onlinecompilersub">
                                                {compilersubmissions &&
                                                        compilersubmissions.map((submission, index) => (
                                                                <div key={submission._id} className="xyzabcd">
                                                                        <div className="abcd">
                                                                                {index + 1}]{" "}
                                                                                <span className="ml-[1vw]">
                                                                                        {" "}
                                                                                        Created :{" "}
                                                                                        {formatDateTime(
                                                                                                submission.createdAt
                                                                                        )}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex justify-between ml-[3vw] mb-[2vh] mt-[2vh] mr-[2vw]">
                                                                                <div>
                                                                                        <SyntaxHighlighter
                                                                                                className="xyz"
                                                                                                language={
                                                                                                        submission.language
                                                                                                }
                                                                                        >
                                                                                                {submission.code}
                                                                                        </SyntaxHighlighter>
                                                                                </div>
                                                                                <div className="flex flex-col bcd">
                                                                                        <div>
                                                                                                <span className="text-[#4ec9b0]">
                                                                                                        Input :
                                                                                                </span>{" "}
                                                                                                <span className="text-[#ce9178]">
                                                                                                        {submission.input}
                                                                                                </span>
                                                                                        </div>
                                                                                        <div>
                                                                                                <span className="text-[#4ec9b0]">
                                                                                                        Output :
                                                                                                </span>{" "}
                                                                                                <span className="text-[#ce9178]">
                                                                                                        {submission.output}
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                        </div>
                                )}
                        </div>
                </div>
        );
};

export default SubmissionList;
