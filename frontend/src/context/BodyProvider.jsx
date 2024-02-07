/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const BodyContext = createContext();

export const BodyProvider = ({ children }) => {
        const [body, setBody] = useState({
                code: "",
                userInput: "",
                language: "java",
                font: "18px",
                tabSize: "2",
                editorTheme: "monokai",
                output: "",
                toggleOutput: false,
                practiceStatus: false,
        });

        const updateBody = (newBody) => {
                setBody(newBody);
        };

        return <BodyContext.Provider value={{ body, updateBody }}>{children}</BodyContext.Provider>;
};
