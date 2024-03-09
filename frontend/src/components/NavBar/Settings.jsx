/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core";
import { useSelector, useDispatch } from "react-redux";
import { updateEditorTheme } from "../../redux/slices/editorThemeSlice";
import { updateFont } from "../../redux/slices/fontSlice";
import { updateTabSize } from "../../redux/slices/tabSizeSlice";
const Settings = () => {
        const font = useSelector((state) => state.font?.value);
        const editorTheme = useSelector((state) => state.editorTheme?.value);
        const tabSize = useSelector((state) => state.tabSize?.value);
        const dispatch = useDispatch();
        const fontSizes = ["12px", "14px", "16px", "18px", "20px", "22px", "24px"];
        const tabSizes = [2, 4];
        const themeOptions = [
                { value: "monokai", name: "Monokai" },
                { value: "github", name: "GitHub" },
                { value: "tomorrow", name: "Tomorrow" },
                { value: "kuroir", name: "Kuroir" },
                { value: "twilight", name: "Twilight" },
                { value: "xcode", name: "Xcode" },
                { value: "solarized_dark", name: "Solarized Dark" },
                { value: "solarized_light", name: "Solarized Light" },
                { value: "terminal", name: "Terminal" },
        ];
        const [toggleSetting, setToggleSetting] = useState(false);
        const toggle = () => {
                setToggleSetting(!toggleSetting);
        };
        const handleInputChange = (event) => {
                const { name, value } = event.target;
                switch (name) {
                        case "font":
                                dispatch(updateFont(value));
                                break;
                        case "editorTheme":
                                dispatch(updateEditorTheme(value));
                                break;
                        case "tabSize":
                                dispatch(updateTabSize(value));
                                break;
                }
        };

        return (
                <div>
                        <button
                                className="h-[100%] w-[100%] text-[white] cursor-pointer bg-neutral-800 border-[none]"
                                onClick={toggle}
                        >
                                <i className="fas fa-cog fa-xl"></i>
                        </button>
                        {toggleSetting && (
                                <div>
                                        <div
                                                className="fixed w-full h-full bg-[rgba(0,0,0,0.5)] z-[1000] left-0 top-0"
                                                onClick={toggle}
                                        ></div>
                                        <div className=" fixed left-[10%] lg:w-[50%] lg:left-[25%]  top-[20%] overflow-y-scroll z-[1001] w-[80%] h-[60%] bg-[#2f3136] border shadow-[0_0_10px_rgba(0,0,0,0.2)] px-5 py-1 rounded-[10px] border-solid border-[#ccc]">
                                                <label className="bg-[#2f3136] flex items-center w-full h-[28%]  justify-between py-1">
                                                        <div className="w-[55%] h-10">
                                                                <p className="bg-[#2f3136] text-md">Code Font:</p>
                                                                <p className="bg-[#2f3136] text-sm">
                                                                        Choose the font size of the editor.
                                                                </p>
                                                        </div>
                                                        <select
                                                                className="h-10 flex justify-center items-center bg-[rgb(95,139,173)] text-[white] text-md w-[45%] cursor-pointer px-2 rounded-[10px]"
                                                                name="font"
                                                                value={font}
                                                                onChange={handleInputChange}
                                                        >
                                                                {fontSizes.map((size) => (
                                                                        <option
                                                                                className="cursor-pointer"
                                                                                key={size}
                                                                                value={size}
                                                                        >
                                                                                {size}
                                                                        </option>
                                                                ))}
                                                        </select>
                                                </label>

                                                <label className="bg-[#2f3136] flex w-full items-center h-[28%]  justify-between py-1">
                                                        <div className="w-[55%] h-10">
                                                                <p className="bg-[#2f3136] text-md">Editor Theme:</p>
                                                                <p className="bg-[#2f3136] text-sm ">
                                                                        Choose a theme for the editor.
                                                                </p>
                                                        </div>
                                                        <select
                                                                className="h-10 flex justify-center items-center bg-[rgb(95,139,173)] text-[white] text-md w-[45%] cursor-pointer px-2 rounded-[10px]"
                                                                name="editorTheme"
                                                                value={editorTheme}
                                                                onChange={handleInputChange}
                                                        >
                                                                {themeOptions.map((theme) => (
                                                                        <option
                                                                                className="cursor-pointer"
                                                                                key={theme.value}
                                                                                value={theme.value}
                                                                        >
                                                                                {theme.name}
                                                                        </option>
                                                                ))}
                                                        </select>
                                                </label>

                                                <label className="bg-[#2f3136] flex items-center w-full h-[28%]  justify-between py-1">
                                                        <div className="w-[55%] h-10">
                                                                <p className="bg-[#2f3136] text-md">Tab Size:</p>
                                                                <p className="bg-[#2f3136] text-sm">
                                                                        Update the default tab size of the editor.
                                                                </p>
                                                        </div>
                                                        <select
                                                                className="h-10 flex justify-center items-center bg-[rgb(95,139,173)] text-[white] text-md w-[45%] cursor-pointer px-2 rounded-[10px]"
                                                                name="tabSize"
                                                                value={tabSize}
                                                                onChange={handleInputChange}
                                                        >
                                                                {tabSizes.map((size) => (
                                                                        <option
                                                                                className="cursor-pointer"
                                                                                key={size}
                                                                                value={size}
                                                                        >
                                                                                {size}
                                                                        </option>
                                                                ))}
                                                        </select>
                                                </label>
                                                <div className="w-full h-[15%] flex justify-center items-center py-2">
                                                        <button
                                                                onClick={toggle}
                                                                className="w-[40%] lg:w-[20%] h-10 cursor-pointer font-bold transition-all duration-[0.3s] ease-[ease] text-[#d90429]  rounded-[5px] border-4 border-solid border-[#d90429]
                                                        bg-white hover:bg-[#d90429] hover:text-[#fff] font-sans"
                                                        >
                                                                Close
                                                        </button>
                                                </div>
                                        </div>{" "}
                                </div>
                        )}
                </div>
        );
};

export default Settings;
