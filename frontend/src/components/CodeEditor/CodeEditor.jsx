/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import { useBody } from "../../context/BodyContext";

// Languages
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-ruby";

// Themes

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";

import "ace-builds/src-noconflict/ext-language_tools";
import "./CodeEditor.css";
function CodeEditor() {
        const { body, updateBody } = useBody();
        const handleChange = (value) => {
                updateBody({ ...body, code: value });
        };
        useEffect(() => {
                const editor = ace.edit("ace-editor");
                editor.getSession().setTabSize(body.tabSize);
        });
        return (
                <div className="w-[66.5vw] h-[77.5vh] ml-[1.5vw] mt-[2.5vh]">
                        <AceEditor
                                mode={body.language === "c" || body.language === "cpp" ? "c_cpp" : body.language}
                                theme={body.editorTheme}
                                fontSize={body.font}
                                name="ace-editor"
                                width="65vw"
                                height="75vh"
                                value={body.code}
                                onChange={handleChange}
                                showPrintMargin={false}
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                }}
                                className="code-editor"
                        />
                </div>
        );
}

export default CodeEditor;
