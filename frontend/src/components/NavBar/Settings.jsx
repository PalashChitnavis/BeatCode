/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useBody } from "../../context/BodyContext";
import "@fortawesome/fontawesome-svg-core";
import "./Button.css";
import "./Settings.css";
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
                        <button className="btn" onClick={toggle}>
                                <i className="fas fa-cog fa-xl"></i>
                        </button>
                        {toggleSetting && (
                                <div>
                                        <div className="overlay" onClick={toggle}></div>
                                        <div className="settings-container">
                                                <label className="setting-label">
                                                        <div>
                                                                <p className="setting-title">Code Font:</p>
                                                                <p className="setting-subtitle">
                                                                        Choose the font size of the editor.
                                                                </p>
                                                        </div>
                                                        <select name="font" value={body.font} onChange={handleInputChange}>
                                                                {fontSizes.map((size) => (
                                                                        <option key={size} value={size}>
                                                                                {size}
                                                                        </option>
                                                                ))}
                                                        </select>
                                                </label>

                                                <label className="setting-label">
                                                        <div>
                                                                <p className="setting-title">Editor Theme:</p>
                                                                <p className="setting-subtitle">
                                                                        Choose a theme for the editor.
                                                                </p>
                                                        </div>
                                                        <select
                                                                name="editorTheme"
                                                                value={body.editorTheme}
                                                                onChange={handleInputChange}
                                                        >
                                                                {themeOptions.map((theme) => (
                                                                        <option key={theme.value} value={theme.value}>
                                                                                {theme.name}
                                                                        </option>
                                                                ))}
                                                        </select>
                                                </label>

                                                <label className="setting-label">
                                                        <div>
                                                                <p className="setting-title">Tab Size:</p>
                                                                <p className="setting-subtitle">
                                                                        Update the default tab size of the editor.
                                                                </p>
                                                        </div>
                                                        <select
                                                                name="tabSize"
                                                                value={body.tabSize}
                                                                onChange={handleInputChange}
                                                        >
                                                                {tabSizes.map((size) => (
                                                                        <option key={size} value={size}>
                                                                                {size}
                                                                        </option>
                                                                ))}
                                                        </select>
                                                </label>
                                                <button onClick={toggle} className="css-button-rounded--red">
                                                        Close
                                                </button>
                                        </div>{" "}
                                </div>
                        )}
                </div>
        );
};

export default Settings;
