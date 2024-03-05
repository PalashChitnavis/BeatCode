/* eslint-disable react-hooks/exhaustive-deps */
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
import { useLocation } from "react-router-dom";
import { getBoilerplateCode } from "../../services/getBoilerPlateCode";
function CodeEditor({ question, socket, roomID, users }) {
        const { body, updateBody } = useBody();
        let location = useLocation();
        const initialCode = getBoilerplateCode(location, body, question);
        const handleChange = (value) => {
                updateBody({ ...body, code: value });
                socket && socket.emit("codeUpdate", { code: value, roomID: roomID });
        };

        useEffect(() => {
                const username = localStorage.getItem("username");
                if (users && users.length == 2 && users[0].username === username) {
                        socket && socket.emit("codeUpdate", { code: body.code, roomID: roomID });
                }
        }, [users]);

        const starterCodes = {
                c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
                cpp: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
                java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
                python: `print("Hello, World!")`,
        };

        useEffect(() => {
                const editor = ace.edit("ace-editor");
                editor.getSession().setTabSize(body.tabSize);
                const boilerplateCode = getBoilerplateCode(location, body, question);
                updateBody({ ...body, ouput: "" });
                editor.setValue(boilerplateCode);
        }, [body.tabSize, body.language, location.pathname, body.output]);

        return (
                <div className="flex justify-center items-center w-[100%] h-[100%] mt-[1%]">
                        <AceEditor
                                mode={body.language === "c" || body.language === "cpp" ? "c_cpp" : body.language}
                                theme={body.editorTheme}
                                fontSize={body.font}
                                name="ace-editor"
                                width="96%"
                                height="96%"
                                value={body.code}
                                onChange={handleChange}
                                showPrintMargin={false}
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                }}
                                wrapEnabled={true}
                                className="code-editor"
                        />
                </div>
        );
}

export default CodeEditor;
