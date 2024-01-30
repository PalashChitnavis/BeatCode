import React from "react";
import capitalizeString from "../../services/capitaliseWord";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../Solution/Solution.css'

const CodeDisplay = ({ code, language }) => {
    return (
      <SyntaxHighlighter language={language} style={vs}>
        {code}
      </SyntaxHighlighter>
    );
  };

const Solution = ({solution,language}) => { 
    return (
            <div >
                 <CodeDisplay code={solution} language={language}/>
            </div>
    );
};

export default Solution;