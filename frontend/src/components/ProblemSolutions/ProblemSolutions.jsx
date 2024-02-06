/* eslint-disable react/prop-types */
import { useState } from "react";
import Solution from "../Solution/Solution.jsx";
import "../Solution/Solution.css";

export default function ProblemSolutions({ question }) {
        const [navigation, setNavigation] = useState("c");

        return (
                <>
                        <div className="w-[100%]">
                                <div className="w-full flex justify-around border-b-[rgb(76,76,76)] border-b border-solid h-[7vh]">
                                        <button
                                                className={navigation === `c` ? `active` : ``}
                                                onClick={() => setNavigation("c")}
                                        >
                                                C
                                        </button>
                                        <button
                                                className={navigation === `cpp` ? `active` : ``}
                                                onClick={() => setNavigation("cpp")}
                                        >
                                                C++
                                        </button>
                                        <button
                                                className={navigation === `java` ? `active` : ``}
                                                onClick={() => setNavigation("java")}
                                        >
                                                Java
                                        </button>
                                        <button
                                                className={navigation === `python` ? `active` : ``}
                                                onClick={() => setNavigation("python")}
                                        >
                                                Python
                                        </button>
                                </div>
                                {(() => {
                                        switch (navigation) {
                                                case "c":
                                                        return <Solution solution={question.solution.c} language="c" />;

                                                case "cpp":
                                                        return <Solution solution={question.solution.cpp} language="cpp" />;

                                                case "java":
                                                        return (
                                                                <Solution
                                                                        solution={question.solution.java}
                                                                        language="java"
                                                                />
                                                        );

                                                case "javascript":
                                                        return (
                                                                <Solution
                                                                        solution={question.solution.javascript}
                                                                        language="javascript"
                                                                />
                                                        );

                                                case "python":
                                                        return (
                                                                <Solution
                                                                        solution={question.solution.python}
                                                                        language="python"
                                                                />
                                                        );

                                                default:
                                                        "No solution found for current problem :(";
                                        }
                                })()}
                        </div>
                </>
        );
}
