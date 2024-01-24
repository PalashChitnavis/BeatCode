/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "./OutputWindow.css";
function OutputWindow({ outputValue }) {
        return (
                <>
                        <p className="right-output">Output</p>
                        <textarea
                                placeholder="Output will be displayed here"
                                className="output"
                                readOnly
                                value={outputValue}
                        ></textarea>
                </>
        );
}

export default OutputWindow;
