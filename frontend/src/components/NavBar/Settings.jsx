/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useBody } from "../../context/BodyContext";
import "@fortawesome/fontawesome-svg-core";

const Settings = () => {
        const { body, updateBody } = useBody();
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
                updateBody((prev) => ({ ...prev, [name]: value }));
        };

        return (
                <div>
                        <button
                                className="h-[30px] text-[white] cursor-pointer bg-neutral-800 border-[none]"
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
                                        <div className=" fixed -translate-x-2/4 -translate-y-2/4 z-[1001] w-[50vw] h-[60vh] bg-[#2f3136] border shadow-[0_0_10px_rgba(0,0,0,0.2)] p-5 rounded-[10px] border-solid border-[#ccc] left-2/4 top-2/4">
                                                <label className="bg-[#2f3136] flex w-full justify-between mt-[2vh] mb-[6vh]">
                                                        <div>
                                                                <p className="bg-[#2f3136] text-xl">Code Font:</p>
                                                                <p className="bg-[#2f3136] text-lg mt-2.5">
                                                                        Choose the font size of the editor.
                                                                </p>
                                                        </div>
                                                        <select
                                                                className="h-[50px] bg-[rgb(95,139,173)] text-[white] text-lg w-[170px] cursor-pointer pl-2.5 rounded-[10px]"
                                                                name="font"
                                                                value={body.font}
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

                                                <label className="bg-[#2f3136] flex w-full justify-between mt-[2vh] mb-[6vh]">
                                                        <div>
                                                                <p className="bg-[#2f3136] text-xl">Editor Theme:</p>
                                                                <p className="bg-[#2f3136] text-lg mt-2.5">
                                                                        Choose a theme for the editor.
                                                                </p>
                                                        </div>
                                                        <select
                                                                className="h-[50px] bg-[rgb(95,139,173)] text-[white] text-lg w-[170px] cursor-pointer pl-2.5 rounded-[10px]"
                                                                name="editorTheme"
                                                                value={body.editorTheme}
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

                                                <label className="bg-[#2f3136] flex w-full justify-between mt-[2vh] mb-[6vh]">
                                                        <div>
                                                                <p className="bg-[#2f3136] text-xl">Tab Size:</p>
                                                                <p className="bg-[#2f3136] text-lg mt-2.5">
                                                                        Update the default tab size of the editor.
                                                                </p>
                                                        </div>
                                                        <select
                                                                className="h-[50px] bg-[rgb(95,139,173)] text-[white] text-lg w-[170px] cursor-pointer pl-2.5 rounded-[10px]"
                                                                name="tabSize"
                                                                value={body.tabSize}
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
                                                <button
                                                        onClick={toggle}
                                                        className="w-[5vw] h-10  font-[bold] cursor-pointer font-bold transition-all duration-[0.3s] ease-[ease] text-[#d90429] ml-[45%] rounded-[5px] border-4 border-solid border-[#d90429]
                                                        bg-white hover:bg-[#d90429] hover:text-[#fff] font-sans"
                                                >
                                                        Close
                                                </button>
                                        </div>{" "}
                                </div>
                        )}
                </div>
        );
};

export default Settings;
