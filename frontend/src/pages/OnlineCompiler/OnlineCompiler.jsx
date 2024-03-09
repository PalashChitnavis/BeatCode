/* eslint-disable no-unused-vars */
import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LeftPart from "../../components/LeftPart/LeftPart";
import RightPart from "../../components/RightPart/RightPart";

function OnlineCompiler() {
        return (
                <div>
                        <div className="h-[8vh] w-[100vw] flex justify-center items-center">
                                <Header />
                        </div>
                        <div className="flex flex-col h-[75vh] justify-evenly gap-2 lg:flex-row lg:h-[87vh]">
                                <LeftPart />
                                <RightPart />
                        </div>

                        <div className="h-[5vh] w-[100vw] flex justify-center items-center">
                                <Footer />
                        </div>
                </div>
        );
}

export default OnlineCompiler;
