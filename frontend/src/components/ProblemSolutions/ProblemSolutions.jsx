import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchQuestionById } from "../../services/practiceProblemsApi";
import Solution from "../Solution/Solution.jsx";
import '../Solution/Solution.css'

export default function ProblemSolutions(){

    const [loading, setLoading] = useState(false);
    const [navigation,setNavigation] = useState("C")
    const { id } = useParams();
    const [solution,setSolution] = useState(null)
   
    useEffect(() => {
        const fetchData = async () => {
                try {
                        setLoading(true);
                        const question =  await fetchQuestionById(id); 
                        
                        const solution = question.solution
                        console.log(solution)
                        setSolution(solution);
                        setLoading(false);
                } catch (error) {
                        console.error("Error fetching Solutions:", error);
                }
        };
        console.log(solution)

        fetchData();
    }, [id]);

    return(
        <>
                {loading? (<h1>"Loading"</h1>):
                (
                <div>
                        <div className="w-full flex justify-around border-b-[rgb(76,76,76)] border-b border-solid h-[7vh]">
                                <button
                                        className={navigation === `C` ? `active` : ``}
                                        onClick={() => setNavigation("C")}
                                >
                                        C
                                </button>
                                <button
                                        className={navigation === `CPP` ? `active` : ``}
                                        onClick={() => setNavigation("CPP")}
                                >
                                        C++
                                </button>
                                <button
                                        className={navigation === `Java` ? `active` : ``}
                                        onClick={() => setNavigation("Java")}
                                >
                                        Java
                                </button>
                                <button
                                        className={navigation === `JavaScript` ? `active` : ``}
                                        onClick={() => setNavigation("JavaScript")}
                                >
                                        JavaScript
                                </button>
                                <button
                                        className={navigation === `Python` ? `active` : ``}
                                        onClick={() => setNavigation("Python")}
                                >
                                        Python
                                </button>
                        </div>
                        {(()=>{
                        switch (navigation) {
                                case 'C':
                                return solution && <Solution solution={solution.C} language='C'/>;
                                break;
                                case 'CPP':
                                return solution && <Solution solution={solution.CPP} language='CPP'/>;
                                break;
                                case 'Java':
                                return solution && <Solution solution={solution.Java} language='Java'/>;
                                break;
                                case 'JavaScript':
                                return solution && <Solution solution={solution.JavaScript} language='JavaScript'/>;
                                break;
                                case 'Python':
                                return solution && <Solution solution={solution.Python} language='Python'/>;
                                break;
                        
                                default:
                                        "No solution found for current problem :("
                                break;
                        }

                        })()}
                </div> 
            )}
        </>
    )
}