/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import capitalizeString from "../../services/capitaliseWord";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { androidstudio , hybrid} from "react-syntax-highlighter/dist/esm/styles/hljs";
import "../Solution/Solution.css";

const CodeDisplay = ({ code, language }) => {
        return (
                <SyntaxHighlighter language={language} style={hybrid} wrapLongLines={true} showLineNumbers={true}>
                        {code}
                </SyntaxHighlighter>
        );
};

const Solution = ({ solution, language }) => {
        return (
                <div>
                        <CodeDisplay code={solution} language={language} />
                </div>
        );
};

export default Solution;
