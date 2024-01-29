/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

export default function ProgressBar({ progress, color }) {
        const progressStyle = {
                width: `${progress * 100}%`,
                background: `${color}`,
        };

        return (
                <div className="bg-white w-full h-2 mt-2 mb-6 rounded-full">
                        <div className="h-2 rounded-full" style={progressStyle}></div>
                </div>
        );
}
