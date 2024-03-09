/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import "./OutputWindow.css";
import { useSelector } from "react-redux";
function OutputWindow({ outputValue }) {
        const output = useSelector((state) => state.output?.value);

        return (
                <div className="w-[100%] h-[100%]">
                        <p className="text-[white] text-2xl px-2 py-5 lg:justify-start  lg:py-0 flex justify-center">
                                Output
                        </p>
                        <textarea
                                placeholder="Output will be displayed here"
                                id="userOutput"
                                className="bg-[#272822] text-[aliceblue] w-[100%] h-[100%] resize-none text-xl leading-[1.1] border p-2.5 rounded-[10px] border-solid border-[white]"
                                readOnly
                                value={output || ""}
                        ></textarea>
                </div>
        );
}

export default OutputWindow;
