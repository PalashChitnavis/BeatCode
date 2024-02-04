/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import SubmissionList from "../../components/SubmissionList/SubmissionList";
const SubmissionPage = () => {
        return (
                <div>
                        <Header />
                        {isLoggedIn() ? (
                                <div>
                                        <SubmissionList />
                                </div>
                        ) : (
                                <div>bye world</div>
                        )}
                        <Footer />
                </div>
        );
};

export default SubmissionPage;
