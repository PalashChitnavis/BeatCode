/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/LanguageSelector.js

import React, { useEffect } from "react";
import "./LanguageSelector.css";
import { useSelector, useDispatch } from "react-redux";
import { updateLanguage } from "../../redux/slices/languageSlice";
import { updateOutput } from "../../redux/slices/outputSlice";
import { updateUserInput } from "../../redux/slices/userInputSlice";
const LanguageSelector = ({ socket, roomID }) => {
        const language = useSelector((state) => state.language?.value);
        const dispatch = useDispatch();
        const languageOptions = [
                { name: "C", value: "c" },
                { name: "C++", value: "cpp" },
                { name: "Java", value: "java" },
                { name: "Python", value: "python" },
        ];

        return (
                <div className="custom-select-container">
                        <select
                                className="select-language"
                                id="language"
                                value={language}
                                onChange={(e) => {
                                        dispatch(updateLanguage(e.target.value));
                                        dispatch(updateOutput(""));
                                        dispatch(updateUserInput(""));
                                        socket &&
                                                socket.emit("languageChange", { language: e.target.value, roomID: roomID });
                                }}
                        >
                                {languageOptions.map((language) => (
                                        <option key={language.value} value={language.value}>
                                                {language.name}
                                        </option>
                                ))}
                        </select>
                </div>
        );
};

export default LanguageSelector;
