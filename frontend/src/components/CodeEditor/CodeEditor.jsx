/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import AceEditor from "react-ace";

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
import { useLocation } from "react-router-dom";
import { getBoilerplateCode } from "../../services/getBoilerPlateCode";
import { useDispatch, useSelector } from "react-redux";
import { updateCode } from "../../redux/slices/codeSlice";
function CodeEditor({ question, socket, roomID, users }) {
        const code = useSelector((state) => state.code?.value);
        const tabSize = useSelector((state) => state.tabSize?.value);
        const language = useSelector((state) => state.language?.value);
        const editorTheme = useSelector((state) => state.editorTheme?.value);
        const font = useSelector((state) => state.font?.value);
        const dispatch = useDispatch();
        let location = useLocation();

        useEffect(() => {
                const username = localStorage.getItem("username");
                if (users && users.length == 2 && users[0].username === username) {
                        socket && socket.emit("codeUpdate", { code: code, roomID: roomID });
                }
        }, [users]);

        useEffect(() => {
                const editor = ace.edit("ace-editor");
                editor.getSession().setTabSize(tabSize);
                const boilerplateCode = getBoilerplateCode(location, language, question);
                dispatch(updateCode(boilerplateCode));
                editor.setValue(boilerplateCode);
                console.log("boilerplateCode : " + boilerplateCode);
        }, [tabSize, language, location.pathname]);

        const handleChange = (value) => {
                dispatch(updateCode(value));
                socket && socket.emit("codeUpdate", { code: value, roomID: roomID });
                console.log("new code value : " + value);
        };

        return (
                <div className="flex justify-center items-center w-[100%] h-[100%] mt-[1%]">
                        <AceEditor
                                mode={language === "c" || language === "cpp" ? "c_cpp" : language}
                                theme={editorTheme}
                                fontSize={font}
                                name="ace-editor"
                                width="96%"
                                height="96%"
                                value={code}
                                onChange={handleChange}
                                showPrintMargin={false}
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                }}
                                wrapEnabled={true}
                                className="code-editor z-0"
                        />
                </div>
        );
}

export default CodeEditor;
