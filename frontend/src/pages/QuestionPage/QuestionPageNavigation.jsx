/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const QuestionPageNavigation = () => {
        const [navigation, setNavigation] = useState();
        return (
                <div>
                        <button value="question" onClick={() => setNavigation("question")}>
                                Question
                        </button>
                        <button value="solution" onClick={() => setNavigation("solution")}>
                                Solution
                        </button>
                        <button value="submissions" onClick={() => setNavigation("submissions")}>
                                Submissions
                        </button>
                        <button value="problemlist" onClick={() => setNavigation("problemlist")}>
                                Problem List
                        </button>
                </div>
        );
};

export default QuestionPageNavigation;
