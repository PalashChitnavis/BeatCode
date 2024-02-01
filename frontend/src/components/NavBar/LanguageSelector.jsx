/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/LanguageSelector.js

import React, { useEffect } from "react";
import { useBody } from "../../context/BodyContext";
import "./LanguageSelector.css";
const LanguageSelector = () => {
        const languageOptions = [
                { name: "C", value: "c" },
                { name: "C++", value: "cpp" },
                { name: "Java", value: "java" },
                { name: "JavaScript", value: "javascript" },
                { name: "Python", value: "python" },
        ];
        const { body, updateBody } = useBody();

        return (
                <div className="custom-select-container">
                        <select
                                className="select-language"
                                id="language"
                                value={body.language}
                                onChange={(e) =>
                                        updateBody({ ...body, userInput: "", output: "", language: e.target.value })
                                }
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
