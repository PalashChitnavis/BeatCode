/* eslint-disable no-unused-vars */
import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LeftPart from "../../components/LeftPart/LeftPart";
import RightPart from "../../components/RightPart/RightPart";
import "./OnlineCompiler.css";
import { BodyProvider } from "../../context/BodyProvider";
function OnlineCompiler() {
        return (
                <>
                        <BodyProvider>
                                <Header />
                                <div className="flex">
                                        <LeftPart />
                                        <RightPart />
                                </div>

                                <Footer />
                        </BodyProvider>
                </>
        );
}

export default OnlineCompiler;
