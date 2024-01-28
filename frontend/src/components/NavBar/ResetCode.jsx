/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useBody } from "../../context/BodyContext";
import "@fortawesome/fontawesome-svg-core";
const ResetCode = () => {
        const { body, updateBody } = useBody();
        const handleResetClick = () => {
                updateBody({ ...body, code: "" });
        };

        return (
                <button
                        className="h-[30px] text-[white] cursor-pointer bg-neutral-800 border-[none]"
                        onClick={handleResetClick}
                >
                        <i className="fas fa-undo fa-xl"></i>
                </button>
        );
};

export default ResetCode;
