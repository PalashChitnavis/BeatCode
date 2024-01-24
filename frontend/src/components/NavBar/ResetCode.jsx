/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useBody } from "../../context/BodyContext";
import "@fortawesome/fontawesome-svg-core";
import "./Button.css";
const ResetCode = () => {
        const { body, updateBody } = useBody();
        const handleResetClick = () => {
                updateBody({ ...body, code: "" });
        };

        return (
                <button className="btn" onClick={handleResetClick}>
                        <i className="fas fa-undo fa-xl"></i>
                </button>
        );
};

export default ResetCode;
